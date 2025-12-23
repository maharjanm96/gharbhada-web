import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/session.server";
import { roomCreateSchema } from "@/lib/validations/room";
import { NextRequest, NextResponse } from "next/server";

// Create a new room
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
    const validatedData = roomCreateSchema.parse(body);

    // Create room
    const room = await prisma.room.create({
      data: {
        name: validatedData.name,
        price: validatedData.price,
        location: validatedData.location,
        floor: validatedData.floor,
        status: validatedData.status,
        createdBy: adminSession.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Room created successfully",
        room: {
          id: room.id,
          name: room.name,
          price: room.price,
          location: room.location,
          floor: room.floor,
          status: room.status,
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

    console.error("Room creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get all rooms
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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where: any = {};
    if (status && (status === "available" || status === "occupied")) {
      where.status = status;
    }

    const rooms = await prisma.room.findMany({
      where,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format response to match expected structure (single tenant per room)
    const formattedRooms = rooms.map((room) => ({
      ...room,
      tenant: room.tenants[0] || null,
      tenants: undefined,
    }));

    return NextResponse.json(
      {
        success: true,
        rooms: formattedRooms,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get rooms error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
