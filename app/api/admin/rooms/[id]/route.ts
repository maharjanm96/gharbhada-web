import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/session.server";
import { roomUpdateSchema } from "@/lib/validations/room";
import { NextRequest, NextResponse } from "next/server";

// Get a single room by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin is authenticated
    const adminSession = await getServerSession();
    if (!adminSession) {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }

    const room = await prisma.room.findUnique({
      where: { id: params.id },
      include: {
        tenants: {
          select: {
            id: true,
            name: true,
            email: true,
            contact: true,
          },
        },
      },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        room: {
          ...room,
          tenant: room.tenants[0] || null,
          tenants: undefined,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get room error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Update a room
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const validatedData = roomUpdateSchema.parse(body);

    // Check if room exists
    const existingRoom = await prisma.room.findUnique({
      where: { id: params.id },
    });

    if (!existingRoom) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Update room
    const room = await prisma.room.update({
      where: { id: params.id },
      data: validatedData,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Room updated successfully",
        room: {
          id: room.id,
          name: room.name,
          price: room.price,
          location: room.location,
          floor: room.floor,
          status: room.status,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Room update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete a room
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin is authenticated
    const adminSession = await getServerSession();
    if (!adminSession) {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }

    // Check if room exists and if it has any tenants
    const existingRoom = await prisma.room.findUnique({
      where: { id: params.id },
      include: {
        tenants: true,
      },
    });

    if (!existingRoom) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // If room has tenants, you may want to prevent deletion or handle it
    if (existingRoom.tenants.length > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete room with assigned tenants. Please remove tenants first.",
        },
        { status: 409 }
      );
    }

    // Delete room
    await prisma.room.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Room deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Room deletion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
