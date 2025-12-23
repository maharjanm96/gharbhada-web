import prisma from "@/lib/prisma";
import { tenantLoginSchema } from "@/lib/validations/tenant";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = tenantLoginSchema.parse(body);

    // Check if tenant exists
    const tenant = await prisma.tenant.findUnique({
      where: { email: validatedData.email },
    });

    if (!tenant) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check if tenant account is active
    if (tenant.status !== "active") {
      return NextResponse.json(
        {
          error:
            "Your account has been suspended. Please contact the administrator.",
        },
        { status: 403 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(
      validatedData.password,
      tenant.password
    );

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create session token
    const sessionToken = Buffer.from(
      JSON.stringify({
        id: tenant.id,
        email: tenant.email,
        role: "tenant",
        timestamp: Date.now(),
      })
    ).toString("base64");

    // Create response with session cookie
    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        tenant: {
          id: tenant.id,
          email: tenant.email,
          name: tenant.name,
          phone: tenant.phone,
          propertyId: tenant.propertyId,
          unitNumber: tenant.unitNumber,
        },
      },
      { status: 200 }
    );

    // Set secure HTTP-only cookie
    response.cookies.set("tenant-auth-token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Tenant login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
