import { PrismaClient } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// service get task
export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        user: {
          select: { id: true, name: true }
        },
        category: {
          select: { id: true, name: true }
        },
        subtasks: true
      }
    });

    return NextResponse.json({
      success: true,
      data: tasks
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data task" },
      { status: 500 }
    );
  }
}

// create task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      priority,
      dueDate,
      userId,
      categoryId
    } = body;

    if (!title || !userId) {
      return NextResponse.json(
        { success: false, message: "Title & User wajib diisi" },
        { status: 400 }
      );
    }

    // cek user
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    // cek category (jika ada)
    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: Number(categoryId) }
      });

      if (!category) {
        return NextResponse.json(
          { success: false, message: "Kategori tidak ditemukan" },
          { status: 404 }
        );
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: Number(userId),
        categoryId: categoryId ? Number(categoryId) : null
      }
    });

    return NextResponse.json({
      success: true,
      message: "Task berhasil ditambahkan",
      data: task
    });

  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal menambah task" },
      { status: 500 }
    );
  }
}