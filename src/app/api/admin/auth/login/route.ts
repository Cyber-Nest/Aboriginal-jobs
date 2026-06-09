import { NextRequest, NextResponse } from "next/server";
import { generateAdminToken, ADMIN_TOKEN_NAME } from "@/lib/admin/adminAuth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        { error: "Admin credentials not configured." },
        { status: 500 },
      );
    }

    // Simple direct comparison — no hashing
    if (
      email.toLowerCase() !== adminEmail.toLowerCase() ||
      password !== adminPassword
    ) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 },
      );
    }

    const token = await generateAdminToken(email);

    const response = NextResponse.json({
      success: true,
      message: "Login successful.",
    });

    response.cookies.set(ADMIN_TOKEN_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error);
    return NextResponse.json(
      { error: "Login failed." },
      { status: 500 },
    );
  }
}
