import { PrismaClient } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// service ambil 1 category
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
    // ambil id
  const { id } = await context.params;
  const categoryId = Number(id);
    // cek apakah id valid
  if (isNaN(categoryId)) {
    // jika id tidak valid
    return NextResponse.json(
      { success: false, message: "ID tidak valid" },
      { status: 400 }
    );
  }
//   cek apakah category ada
  const category = await prisma.category.findUnique({
    where: { id: categoryId }
  });
    // jika category tidak ada
  if (!category) {
    return NextResponse.json(
      { success: false, message: "Kategori tidak ditemukan" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: category
  });
}

// service delete category
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {

  const { id } = await context.params;
  const categoryId = Number(id);

  if (isNaN(categoryId)) {
    return NextResponse.json(
      { success: false, message: "ID tidak valid" },
      { status: 400 }
    );
  }

  const check = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { id: true }
  });

  if (!check) {
    return NextResponse.json(
      { success: false, message: "Category tidak ditemukan" },
      { status: 404 }
    );
  }

  await prisma.category.delete({
    where: { id: categoryId }
  });

  return NextResponse.json({
    success: true,
    message: "Category berhasil dihapus"
  });
}

// service update category
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const categoryId = Number(id);
  const body = await request.json();

  if (isNaN(categoryId)) {
    return NextResponse.json(
      { success: false, message: "ID tidak valid" },
      { status: 400 }
    );
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId }
  });

  if (!category) {
    return NextResponse.json(
      { success: false, message: "Category tidak ditemukan" },
      { status: 404 }
    );
  }

  // cek nama category unik
  if (body.name && body.name !== category.name) {
    const checkName = await prisma.category.findFirst({
      where: {
        name: body.name,
        id: { not: categoryId }
      }
    });

    if (checkName) {
      return NextResponse.json(
        { success: false, message: "Nama category sudah digunakan" },
        { status: 400 }
      );
    }
  }

  const updated = await prisma.category.update({
    where: { id: categoryId },
    data: { name: body.name }
  });

  return NextResponse.json({
    success: true,
    message: "Category berhasil diupdate",
    data: updated
  });
}