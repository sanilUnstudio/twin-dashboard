// app/api/merch-category/route.ts
import { prismaWrite } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('id');

    if (!categoryId) {
      return NextResponse.json(
        { success: false, message: 'Category ID is required' },
        { status: 400 }
      );
    }

    // 1. Check if the category exists
    const category = await prismaWrite.merchCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Merch category not found' },
        { status: 404 }
      );
    }

    // 2. Remove all garment-category associations
    await prismaWrite.garmentMerchCategory.deleteMany({
      where: { merchCategoryId: categoryId },
    });

    // 3. Delete the merch category
    await prismaWrite.merchCategory.delete({
      where: { id: categoryId },
    });

    return NextResponse.json({
      success: true,
      message: `Merch category '${category.name}' deleted successfully.`,
    });
  } catch (error) {
    console.error('Error deleting merch category:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete merch category' },
      { status: 500 }
    );
  }
}
