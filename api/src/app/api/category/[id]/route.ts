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
    // ambil id
  const { id } = await context.params;
  const categoryId = Number(id);
    // cek apakah id valid
  if (isNaN(categoryId)) {
    return NextResponse.json(
        // jika id tidak valid
      { success: false, message: "ID tidak valid" },
      { status: 400 }
    );
  }
//   cek apakah category ada
  await prisma.category.delete({
    where: { id: categoryId }
  });
// jika category ada
  return NextResponse.json({
    success: true,
    message: "Kategori berhasil dihapus"
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

  const updated = await prisma.category.update({
    where: { id: categoryId },
    data: {
      name: body.name,
      color: body.color
    }
  });

  return NextResponse.json({
    success: true,
    message: "Kategori berhasil diupdate",
    data: updated
  });
}