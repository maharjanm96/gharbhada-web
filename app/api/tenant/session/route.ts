import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get("tenant-auth-token");

    if (!authToken) {
      return NextResponse.json(
        {
          authenticated: false,
          tenant: null,
        },
        { status: 200 }
      );
    }

    try {
      // Decode the session token
      const sessionData = JSON.parse(
        Buffer.from(authToken.value, "base64").toString()
      );

      // Verify token hasn't expired (30 days)
      const maxAge = 30 * 24 * 60 * 60 * 1000;
      if (Date.now() - sessionData.timestamp > maxAge) {
        return NextResponse.json(
          {
            authenticated: false,
            tenant: null,
            error: "Session expired",
          },
          { status: 401 }
        );
      }

      return NextResponse.json(
        {
          authenticated: true,
          tenant: {
            id: sessionData.id,
            email: sessionData.email,
            role: sessionData.role,
          },
        },
        { status: 200 }
      );
    } catch (decodeError) {
      return NextResponse.json(
        {
          authenticated: false,
          tenant: null,
          error: "Invalid session",
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Tenant session check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
