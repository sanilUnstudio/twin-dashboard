// app/api/merch-categories/route.ts
import { prismaRead } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await prismaRead.merchCategory.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        garments: true,
      },
    });

    const formatted = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt,
      garmentCount: cat.garments.length,
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (error) {
    console.error("Error fetching merch categories:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch merch categories" },
      { status: 500 }
    );
  }
}
