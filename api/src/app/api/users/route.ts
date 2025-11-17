import { PrismaClient } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// untuk ambil semua user
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        categories: true,
        tasks: true,
      },
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Gagal mengambil user" },
      { status: 500 }
    );
  }
}


