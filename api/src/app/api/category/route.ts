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
// ambil data
  try {
    const body = await request.json();
    const { name, color, userId } = body;
    // cek data
    if (!name || !userId) {
        // jika data tidak ada
      return NextResponse.json(
        { success: false, message: "Nama & User wajib diisi" },
        { status: 400 }
      );
    }

    // cek apakah user ada
    const user = await prisma.user.findUnique({
    // jika user ada
      where: { id: Number(userId) }
    });
    // jika user tidak ada
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User tidak ditemukan" },
        { status: 404 }
      );
    }
    // buat kategori
    const category = await prisma.category.create({
      data: {
        name,
        color,
        userId: Number(userId)
      }
    });
    // jika berhasil
    return NextResponse.json({
      success: true,
      message: "Kategori berhasil ditambahkan",
      data: category
    });

    // jika error
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal menambah kategori" },
      { status: 500 }
    );
  }
}