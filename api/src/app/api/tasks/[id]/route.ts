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

