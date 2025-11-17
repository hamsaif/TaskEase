import { PrismaClient } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

//  ambil semua user
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        categories: true,
        tasks: true,
      },
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Gagal mengambil user" },
      { status: 500 }
    );
  }
}

// untuk membuat user baru
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: body.password,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Gagal membuat user" },
      { status: 500 }
    );
  }
}


