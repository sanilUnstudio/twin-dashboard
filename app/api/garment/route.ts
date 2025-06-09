// app/api/garment/route.ts
import { NextResponse } from "next/server";
import { prismaRead } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { prismaWrite } from "@/lib/prisma"; // assumes you have a write-enabled Prisma client
import { Gender, Category } from "@prisma/client";

export async function GET() {
  try {
    const garments = await prismaRead.garment.findMany({
      orderBy: {
        createdAt: "desc", // Change `createdAt` to the correct field name
      },
    });
    return NextResponse.json({ success: true, data: garments });
  } catch (error) {
    console.error("Error fetching garments:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch garments" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const displayUrl = formData.get("imageUrl") as string;
    const url = displayUrl; // if you use a different image processing service, this may differ
    const gender = formData.get("gender") as Gender | null;
    const type = formData.get("category") as Category | null;
    const brandName = formData.get("brandName") as string;
    const priceRaw = formData.get("price") as string;
    const name = formData.get("name") as string;
    const buyLink = formData.get("buyLink") as string;

    const price = parseFloat(priceRaw || "0");

    if (!displayUrl || !type || !gender) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newGarment = await prismaWrite.garment.create({
      data: {
        displayUrl,
        url,
        gender,
        type,
        brandName,
        price,
        name,
        buyLink
      },
    });

    return NextResponse.json({ success: true, data: newGarment });
  } catch (error) {
    console.error("Error creating garment:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create garment" },
      { status: 500 }
    );
  }
}



export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const garmentId = searchParams.get('id');


    if (!garmentId) {
      return NextResponse.json(
        { success: false, message: 'Garment ID is required' },
        { status: 400 }
      );
    }

    await prismaWrite.garment.delete({
      where: {
        id: garmentId,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Garment with ID ${garmentId} deleted successfully.`,
    });
  } catch (error) {
    console.error('Error deleting garment:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete garment' },
      { status: 500 }
    );
  }
}

