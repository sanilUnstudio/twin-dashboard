// app/api/avatar/route.ts
import { NextResponse } from "next/server";
import { prismaWrite, prismaRead } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    await prismaWrite.avatar.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Avatar deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete avatar" },
      { status: 500 }
    );
  }
}
