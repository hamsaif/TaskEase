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
