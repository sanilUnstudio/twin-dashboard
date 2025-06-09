import { prismaWrite } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify"; // install this package

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ success: false, message: "Name is required" }, { status: 400 });
    }

    const slug = slugify(name, { lower: true });

    const existing = await prismaWrite.merchCategory.findUnique({ where: { slug } });

    if (existing) {
      return NextResponse.json({
        success: false,
        message: "A category with this name already exists",
      }, { status: 409 });
    }

    const newCategory = await prismaWrite.merchCategory.create({
      data: { name, slug },
    });

    return NextResponse.json({ success: true, data: newCategory });

  } catch (error) {
    console.error("Create merch category error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
