import { PrismaClient } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// get semua category
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        user: {
          select: { id: true, name: true }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: categories
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal mengambil kategori" },
      { status: 500 }
    );
  }
}

// service create category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, color, userId } = body;

    if (!name || !userId) {
      return NextResponse.json(
        { success: false, message: "Nama & User wajib diisi" },
        { status: 400 }
      );
    }


    const user = await prisma.user.findUnique({
      where: { id: Number(userId) }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        color,
        userId: Number(userId)
      }
    });

    return NextResponse.json({
      success: true,
      message: "Kategori berhasil ditambahkan",
      data: category
    });

  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal menambah kategori" },
      { status: 500 }
    );
  }
}