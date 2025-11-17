import { PrismaClient } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

//  ambil semua user
export const GET = async () => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json({
      success: true,
      message: "Data user ditemukan",
      data: users
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Gagal mengambil data user",
      error: error
    });
  }
};
// cerate user
export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();

    const { name, email, password } = body;

    // Cek apakah email sudah dipakai
    const check = await prisma.user.findUnique({
      where: { email }
    });

    if (check) {
      return NextResponse.json({
        success: false,
        message: "Email sudah digunakan"
      });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password
      }
    });

    return NextResponse.json({
      success: true,
      message: "User berhasil ditambahkan",
      data: user
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Gagal menambah user",
      error: error
    });
  }
};

