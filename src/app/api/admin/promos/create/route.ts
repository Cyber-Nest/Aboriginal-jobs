import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db/mongoose";
import { PromoCode } from "@/lib/models/PromoCode";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const { code, packageName, maxUses, expiresAt, createdBy } = body;

    if (!code || !packageName) {
      return NextResponse.json(
        {
          error: "Code and package name are required.",
        },
        {
          status: 400,
        },
      );
    }

    const existingPromo = await PromoCode.findOne({
      code: code.toUpperCase(),
    });

    if (existingPromo) {
      return NextResponse.json(
        {
          error: "Promo code already exists.",
        },
        {
          status: 400,
        },
      );
    }

    const promo = await PromoCode.create({
      code: code.toUpperCase(),

      packageName,

      active: true,

      usedCount: 0,

      maxUses: maxUses || null,

      expiresAt: expiresAt || null,

      createdBy: createdBy || "admin",
    });

    return NextResponse.json(
      {
        success: true,
        promo,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("CREATE PROMO ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to create promo code.",
      },
      {
        status: 500,
      },
    );
  }
}
