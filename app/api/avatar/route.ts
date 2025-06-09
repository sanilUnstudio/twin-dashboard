export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prismaRead } from "@/lib/prisma";

export async function GET() {
  try {
    const avatars = await prismaRead.avatar.findMany({
      select: {
        id: true,
        userId: true,
        email: true,
        gender: true,
        numberOfImages: true,
      },
    });

    const response = NextResponse.json(avatars);
    return response;
  } catch (error) {
    console.error("GET /api/avatar error:", error); // Log for Vercel or server logs
    return NextResponse.json(
      { error: "Failed to fetch avatars" },
      { status: 500 }
    );
  }
}
