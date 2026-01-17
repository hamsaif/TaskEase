import { PrismaClient } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// get 1 task
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const taskId = Number(id);

  if (isNaN(taskId)) {
    return NextResponse.json(
      { success: false, message: "ID tidak valid" },
      { status: 400 }
    );
  }

  const task = await prisma.task.findUnique({
    where: { id: taskId }
  });

  if (!task) {
    return NextResponse.json(
      { success: false, message: "Task tidak ditemukan" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: task });
}

// service delete task
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const taskId = Number(id);

  if (isNaN(taskId)) {
    return NextResponse.json(
      { success: false, message: "ID tidak valid" },
      { status: 400 }
    );
  }

  const check = await prisma.task.findUnique({
    where: { id: taskId },
    select: { id: true }
  });

  if (!check) {
    return NextResponse.json(
      { success: false, message: "Task tidak ditemukan" },
      { status: 404 }
    );
  }

  await prisma.task.delete({
    where: { id: taskId }
  });

  return NextResponse.json({
    success: true,
    message: "Task berhasil dihapus"
  });
}

// service update task
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const taskId = Number(id);
  const body = await request.json();

  if (isNaN(taskId)) {
    return NextResponse.json(
      { success: false, message: "ID tidak valid" },
      { status: 400 }
    );
  }

  const task = await prisma.task.findUnique({
    where: { id: taskId }
  });

  if (!task) {
    return NextResponse.json(
      { success: false, message: "Task tidak ditemukan" },
      { status: 404 }
    );
  }

  // cek title unik
  if (body.title && body.title !== task.title) {
    const checkTitle = await prisma.task.findFirst({
      where: {
        title: body.title,
        id: { not: taskId }
      }
    });

    if (checkTitle) {
      return NextResponse.json(
        { success: false, message: "Judul task sudah digunakan" },
        { status: 400 }
      );
    }
  }
  // cek kategori
  if (body.categoryId) {
  const category = await prisma.category.findUnique({
    where: { id: Number(body.categoryId) }
  });

  if (!category) {
    return NextResponse.json(
      { success: false, message: "Kategori tidak ditemukan" },
      { status: 404 }
    );
  }
}
  const updated = await prisma.task.update({
    where: { id: taskId },
    data: {
      title: body.title,
      description: body.description,
      categoryId: body.categoryId
    }
  });

  return NextResponse.json({
    success: true,
    message: "Task berhasil diupdate",
    data: updated
  });
}
