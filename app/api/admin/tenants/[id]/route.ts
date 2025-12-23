import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/session.server";
import { tenantUpdateSchema } from "@/lib/validations/tenant";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

// GET single tenant
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminSession = await getServerSession();
    if (!adminSession) {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: params.id },
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

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
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
    });
  } catch (error) {
    console.error("Get tenant error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH (update) tenant
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminSession = await getServerSession();
    if (!adminSession) {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = tenantUpdateSchema.parse(body);

    // Get current tenant data
    const currentTenant = await prisma.tenant.findUnique({
      where: { id: params.id },
    });

    if (!currentTenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    // If roomId is being changed, update room statuses
    if (
      validatedData.roomId !== undefined &&
      validatedData.roomId !== currentTenant.roomId
    ) {
      // Set old room to available if it exists
      if (currentTenant.roomId) {
        await prisma.room.update({
          where: { id: currentTenant.roomId },
          data: { status: "available" },
        });
      }

      // Set new room to occupied if it exists
      if (validatedData.roomId) {
        await prisma.room.update({
          where: { id: validatedData.roomId },
          data: { status: "occupied" },
        });
      }
    }

    // Prepare update data
    const updateData: any = { ...validatedData };

    // Hash password if it's being updated
    if (validatedData.password) {
      updateData.password = await bcrypt.hash(validatedData.password, 10);
    }

    const tenant = await prisma.tenant.update({
      where: { id: params.id },
      data: updateData,
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

    return NextResponse.json({
      success: true,
      message: "Tenant updated successfully",
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
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Update tenant error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE tenant
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminSession = await getServerSession();
    if (!adminSession) {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }

    // Get tenant to check if they have a room
    const tenant = await prisma.tenant.findUnique({
      where: { id: params.id },
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    // If tenant has a room, set it to available
    if (tenant.roomId) {
      await prisma.room.update({
        where: { id: tenant.roomId },
        data: { status: "available" },
      });
    }

    await prisma.tenant.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: "Tenant deleted successfully",
    });
  } catch (error) {
    console.error("Delete tenant error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
