import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db/mongoose";
import { PromoCode } from "@/lib/models/PromoCode";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

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

    return NextResponse.json({
      success: true,

      valid: true,

      message: "Promo code is valid.",
    });
  } catch (error) {
    console.error("PROMO CHECK ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to validate promo code.",
      },
      {
        status: 500,
      },
    );
  }
}
