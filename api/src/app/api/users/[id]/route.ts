import { PrismaClient } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();



// ambil satu user
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const userId = Number(id);

  if (isNaN(userId)) {
    return NextResponse.json(
      {
        success: false,
        message: "ID tidak valid"
      },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: "User tidak ditemukan"
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: user
  });
}


// service delete user
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const id = Number(context.params.id);

  if (isNaN(id)) {
    return NextResponse.json(
      { success: false, message: "ID tidak valid" },
      { status: 400 }
    );
  }

  await prisma.user.delete({ where: { id } });

  return NextResponse.json({
    success: true,
    message: "User berhasil dihapus",
  });
}

// service update user
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const id = Number(context.params.id);
  const body = await request.json();

  if (isNaN(id)) {
    return NextResponse.json(
      { success: false, message: "ID tidak valid" },
      { status: 400 }
    );
  }

  const checkEmail = await prisma.user.findFirst({
    where: {
      email: body.email,
      id: { not: id },
    },
  });

  if (checkEmail) {
    return NextResponse.json(
      { success: false, message: "Email sudah digunakan user lain" },
      { status: 400 }
    );
  }

  const updated = await prisma.user.update({
    where: { id },
    data: {
      name: body.name,
      email: body.email,
      password: body.password,
    },
  });

  return NextResponse.json({
    success: true,
    data: updated,
  });
}
