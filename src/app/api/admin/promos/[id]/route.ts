import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db/mongoose";
import { PromoCode } from "@/lib/models/PromoCode";

export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    await connectDB();

    const { id } = await params;

    const promo = await PromoCode.findByIdAndDelete(id);

    if (!promo) {
      return NextResponse.json(
        {
          error: "Promo code not found.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,

      message: "Promo code deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE PROMO ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to delete promo code.",
      },
      {
        status: 500,
      },
    );
  }
}
