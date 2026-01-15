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

    // validasi data wajib
    if (!name || !userId) {

      return NextResponse.json(
        { success: false, message: "Nama & User wajib diisi" },
        { status: 400 }
      );
    }

    const userIdNumber = Number(userId);

    if (isNaN(userIdNumber)) {
      return NextResponse.json(
        { success: false, message: "User ID tidak valid" },
        { status: 400 }
      );
    }

    // cek user ada
    const user = await prisma.user.findUnique({
      where: { id: userIdNumber }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    // cek nama category sudah ada
    const checkCategory = await prisma.category.findFirst({
      where: { name }
    });

    if (checkCategory) {
      return NextResponse.json(
        { success: false, message: "Nama category sudah digunakan" },
        { status: 400 }
      );
    }

    // create category
    const category = await prisma.category.create({
      data: {
        name,
        color,
        userId: userIdNumber
      }
    });

    return NextResponse.json({
      success: true,
      message: "Kategori berhasil ditambahkan",
      data: category
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Gagal menambah kategori" },
      { status: 500 }
    );
  }
}