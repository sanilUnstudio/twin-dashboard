// app/api/db-check/route.ts
import { prismaWrite } from '@/lib/prisma';
import { NextResponse } from 'next/server';
export async function GET() {
  try {
    await prismaWrite.$connect();
    return NextResponse.json({ status: 'success', message: 'Database connection successful ✅' });
  } catch (error) {
    console.error('Database connection failed ❌', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to connect to DB', error: String(error) },
      { status: 500 }
    );
  } finally {
    await prismaWrite.$disconnect();
  }
}
