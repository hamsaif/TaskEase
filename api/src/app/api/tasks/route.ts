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
    // jika error
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
      priority = "medium",
      dueDate,
      userId,
      categoryId
    } = body;

    // validasi wajib
    if (!title || !userId) {
      return NextResponse.json(
        { success: false, message: "Title & User wajib diisi" },
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

    // cek user
    const user = await prisma.user.findUnique({
      where: { id: userIdNumber }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    // cek title task sudah ada
    const checkTitle = await prisma.task.findFirst({
      where: { title }
    });

    if (checkTitle) {
      return NextResponse.json(
        { success: false, message: "Title task sudah digunakan" },
        { status: 400 }
      );
    }

    // cek category jika ada
    let categoryIdNumber: number | null = null;

    if (categoryId) {
      categoryIdNumber = Number(categoryId);

      if (isNaN(categoryIdNumber)) {
        return NextResponse.json(
          { success: false, message: "Category ID tidak valid" },
          { status: 400 }
        );
      }

      const category = await prisma.category.findUnique({
        where: { id: categoryIdNumber }
      });

      if (!category) {
        return NextResponse.json(
          { success: false, message: "Kategori tidak ditemukan" },
          { status: 404 }
        );
      }
    }

    // create task
    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: userIdNumber,
        categoryId: categoryIdNumber
      }
    });

    return NextResponse.json({
      success: true,
      message: "Task berhasil ditambahkan",
      data: task
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Gagal menambah task" },
      { status: 500 }
    );
  }
}