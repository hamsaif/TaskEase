import { PrismaClient } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();



// ambil satu user
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
    // ambil id
  const { id } = await context.params;

  const userId = Number(id);
// cek apakah id valid
  if (isNaN(userId)) {
    // jika id tidak valid
    return NextResponse.json(
      {
        success: false,
        message: "ID tidak valid"
      },
      { status: 400 }
    );
  }
// cek apakah user ada
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
// jika user tidak ada
  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: "User tidak ditemukan"
      },
      { status: 404 }
    );
  }
// jika ada maka kembalikan user
  return NextResponse.json({
    success: true,
    data: user
  });
}


// service delete user
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
// ambil id
  const { id } = await context.params;
  const userId = Number(id);
// cek apakah id valid
  if (isNaN(userId)) {
    // jika id tidak valid
    return NextResponse.json(
      { success: false, message: "ID tidak valid" },
      { status: 400 }
    );
  }

// cek apakah user ada
  const check = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true }
  });
// jika user tidak ada
  if (!check) {
    return NextResponse.json(
      { success: false, message: "User tidak ditemukan" },
      { status: 404 }
    );
  }
// jika ada maka hapus user
  await prisma.user.delete({
    where: { id: userId }
  });

  return NextResponse.json({
    success: true,
    message: "User berhasil dihapus"
  });
}

// service update user
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
// ambil id
  const { id } = await context.params;
  const userId = Number(id);
  const body = await request.json();
// cek apakah id valid
  if (isNaN(userId)) {
    return NextResponse.json(
      { success: false, message: "ID tidak valid" },
      { status: 400 }
    );
  }

//  cek apakah user ada
  const checkUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true }
  });
// jika user tidak ada
  if (!checkUser) {
    // jika user tidak ada
    return NextResponse.json(
      { success: false, message: "User tidak ditemukan" },
      { status: 404 }
    );
  }

//  cek apakah email sudah digunakan
  const checkEmail = await prisma.user.findFirst({
    where: {
      email: body.email,
      id: { not: userId }
    },
    select: { id: true }
  });
// jika email sudah digunakan
  if (checkEmail) {
    return NextResponse.json(
      { success: false, message: "Email sudah digunakan user lain" },
      { status: 400 }
    );
  }
// jika ada maka update user
  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      name: body.name,
      email: body.email,
      password: body.password
    }
  });

  return NextResponse.json({
    success: true,
    message: "User berhasil diupdate",
    data: updated
  });
}
