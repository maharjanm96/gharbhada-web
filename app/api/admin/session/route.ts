import { getServerSession } from "@/lib/session.server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const sessionData = await getServerSession();

    if (!sessionData) {
      return NextResponse.json(
        {
          authenticated: false,
          admin: null,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        authenticated: true,
        admin: {
          id: sessionData.id,
          email: sessionData.email,
          name: sessionData.name,
          role: sessionData.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
