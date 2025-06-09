import { NextRequest, NextResponse } from "next/server";
import { prismaWrite } from "@/lib/prisma"; // adjust to your path
import { Gender, Category } from "@prisma/client"; // adjust import if enums are declared elsewhere

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const garmentId = params.id;
    const formData = await req.formData();

    const displayUrl = formData.get("imageUrl") as string;
    const gender = formData.get("gender") as Gender | null;
    const type = formData.get("category") as Category | null;
    const brandName = formData.get("brandName") as string;
    const priceRaw = formData.get("price") as string;
    const name = formData.get("name") as string;
    const buyLink = formData.get("buyLink") as string;

    const price = parseFloat(priceRaw || "0");

    if (!garmentId || !displayUrl || !gender || !type) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedGarment = await prismaWrite.garment.update({
      where: { id: garmentId },
      data: {
        displayUrl,
        url: displayUrl, // assuming displayUrl and url are same
        gender,
        type,
        brandName,
        price,
        name,
        buyLink,
      },
    });

    return NextResponse.json({ success: true, data: updatedGarment });
  } catch (error) {
    console.error("Error updating garment:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update garment" },
      { status: 500 }
    );
  }
}
