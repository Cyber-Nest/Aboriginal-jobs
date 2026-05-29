import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db/mongoose";
import { getAuth } from "@/lib/auth/auth";

import { Employer } from "@/lib/models/Employer";
import { PromoCode } from "@/lib/models/PromoCode";
import { EmployerPackage } from "@/lib/models/EmployerPackage";
import { EmployerPackageHistory } from "@/lib/models/EmployerPackageHistory";
import { PaymentTransaction } from "@/lib/models/PaymentTransaction";

const PACKAGE_CONFIG = {
  Starter: {
    credits: 1,
    unlimitedJobs: false,
    expiryDays: 180,
    amount: 12.5,
  },

  Deluxe: {
    credits: 5,
    unlimitedJobs: false,
    expiryDays: 180,
    amount: 47.5,
  },

  Ultimate: {
    credits: 10,
    unlimitedJobs: false,
    expiryDays: 180,
    amount: 97.5,
  },

  "Pro Plan": {
    credits: 20,
    unlimitedJobs: false,
    expiryDays: 180,
    amount: 190,
  },

  Unlimited: {
    credits: 0,
    unlimitedJobs: true,
    expiryDays: 365,
    amount: 675,
  },
};

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const auth = await getAuth();

    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "Authentication required.",
        },
        {
          status: 401,
        },
      );
    }

    const body = await request.json();

    const packageName = body.packageName?.trim();

    const promoCode = body.promoCode?.trim()?.toUpperCase();

    if (!packageName || !promoCode) {
      return NextResponse.json(
        {
          error: "Package and promo code are required.",
        },
        {
          status: 400,
        },
      );
    }

    const selectedPackage =
      PACKAGE_CONFIG[packageName as keyof typeof PACKAGE_CONFIG];

    if (!selectedPackage) {
      return NextResponse.json(
        {
          error: "Invalid package selected.",
        },
        {
          status: 400,
        },
      );
    }

    const employer = await Employer.findOne({
      authUserId: session.user.id,
    });

    if (!employer) {
      return NextResponse.json(
        {
          error: "Employer not found.",
        },
        {
          status: 404,
        },
      );
    }

    const promo = await PromoCode.findOne({
      code: promoCode,
      packageName,
      active: true,
    });

    if (!promo) {
      return NextResponse.json(
        {
          error: "Invalid promo code.",
        },
        {
          status: 400,
        },
      );
    }

    if (promo.expiresAt && promo.expiresAt < new Date()) {
      return NextResponse.json(
        {
          error: "Promo code expired.",
        },
        {
          status: 400,
        },
      );
    }

    if (promo.maxUses && promo.usedCount >= promo.maxUses) {
      return NextResponse.json(
        {
          error: "Promo usage limit reached.",
        },
        {
          status: 400,
        },
      );
    }

    const now = new Date();

    const expiresAt = new Date();

    expiresAt.setDate(expiresAt.getDate() + selectedPackage.expiryDays);

    // PROMO USED COUNT

    promo.usedCount += 1;

    await promo.save();

    // PACKAGE

    const existingPackage = await EmployerPackage.findOne({
      employerId: employer._id,
    });

    if (existingPackage) {
      existingPackage.packageName = packageName;

      existingPackage.unlimitedJobs = selectedPackage.unlimitedJobs;

      existingPackage.isFreePlan = false;

      existingPackage.status = "Active";

      existingPackage.purchasedAt = now;

      existingPackage.expiresAt = expiresAt;

      if (!selectedPackage.unlimitedJobs) {
        existingPackage.remainingCredits += selectedPackage.credits;

        existingPackage.totalCreditsPurchased += selectedPackage.credits;
      }

      await existingPackage.save();
    } else {
      await EmployerPackage.create({
        employerId: employer._id,

        packageName,

        remainingCredits: selectedPackage.credits,

        totalCreditsPurchased: selectedPackage.credits,

        unlimitedJobs: selectedPackage.unlimitedJobs,

        isFreePlan: false,

        jobPostExpiryDays: selectedPackage.expiryDays,

        status: "Active",

        purchasedAt: now,

        expiresAt,

        creditExpiresAt: null,
      });
    }

    // PAYMENT TRANSACTION

    const payment = await PaymentTransaction.create({
      employerId: employer._id,

      packageName,

      amount: 0,

      currency: "CAD",

      paymentStatus: "paid",

      paymentProvider: "promo",

      paymentMethod: "Promo Code",

      promoCodeUsed: promoCode,

      isPromoPayment: true,
    });

    // HISTORY

    await EmployerPackageHistory.create({
      employerId: employer._id,

      packageName,

      creditsAdded: selectedPackage.credits,

      unlimitedJobs: selectedPackage.unlimitedJobs,

      promoCodeUsed: promoCode,

      isFreePlan: false,

      jobPostExpiryDays: selectedPackage.expiryDays,

      purchasedAt: now,

      expiresAt,

      paymentStatus: "paid",

      paymentProvider: "promo",

      paymentMethod: "Promo Code",

      transactionId: String(payment._id),

      amount: 0,

      currency: "CAD",
    });

    return NextResponse.json({
      success: true,

      message: "Promo applied successfully.",
    });
  } catch (error) {
    console.error("PROMO VERIFY ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to verify promo code.",
      },
      {
        status: 500,
      },
    );
  }
}
