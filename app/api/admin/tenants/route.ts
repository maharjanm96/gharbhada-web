import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/session.server";
import { tenantCreateSchema } from "@/lib/validations/tenant";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Verify admin is authenticated
    const adminSession = await getServerSession();
    if (!adminSession) {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate input
    const validatedData = tenantCreateSchema.parse(body);

    // Check if tenant already exists
    const existingTenant = await prisma.tenant.findUnique({
      where: { email: validatedData.email },
    });

    if (existingTenant) {
      return NextResponse.json(
        { error: "Tenant with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // If roomId is provided, update room status to occupied
    if (validatedData.roomId) {
      await prisma.room.update({
        where: { id: validatedData.roomId },
        data: { status: "occupied" },
      });
    }

    // Create tenant
    const tenant = await prisma.tenant.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        contact: validatedData.contact,
        roomId: validatedData.roomId,
        createdBy: adminSession.id,
      },
      include: {
        room: {
          select: {
            id: true,
            name: true,
            location: true,
            floor: true,
            price: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Tenant created successfully",
        tenant: {
          id: tenant.id,
          email: tenant.email,
          name: tenant.name,
          contact: tenant.contact,
          roomId: tenant.roomId,
          room: tenant.room,
          status: tenant.status,
          createdAt: tenant.createdAt,
          updatedAt: tenant.updatedAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Tenant creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify admin is authenticated
    const adminSession = await getServerSession();
    if (!adminSession) {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }

    const tenants = await prisma.tenant.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        contact: true,
        roomId: true,
        room: {
          select: {
            id: true,
            name: true,
            location: true,
            floor: true,
            price: true,
          },
        },
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        success: true,
        tenants,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get tenants error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
