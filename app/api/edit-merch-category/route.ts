import { prismaWrite } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

export async function PUT(req: NextRequest) {
  try {
    const { id, name } = await req.json();

    if (!id || !name) {
      return NextResponse.json(
        { success: false, message: "ID and name are required" },
        { status: 400 }
      );
    }

    const slug = slugify(name, { lower: true });

    // check if another category with same slug already exists
    const existing = await prismaWrite.merchCategory.findFirst({
      where: {
        slug,
        NOT: { id }, // don't clash with the current one being edited
      },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Category with this name already exists" },
        { status: 409 }
      );
    }

    const updated = await prismaWrite.merchCategory.update({
      where: { id },
      data: { name, slug },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Edit merch category error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update category" },
      { status: 500 }
    );
  }
}
