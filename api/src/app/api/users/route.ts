import { PrismaClient } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

//  ambil semua user
export const GET = async () => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true
        }
    });

    return NextResponse.json({
        message: "Berhasil mengambil data user",
        success: true,
        data: users
    });
};

// cerate user
export const POST = async (request: NextRequest) => {
    const body = await request.json();

    // Cek email sudah ada
    const check = await prisma.user.findUnique({
        where: { email: body.email },
        select: { id: true }
    });

    if (check) {
        return NextResponse.json({
            message: "Email sudah digunakan",
            success: false
        }, { status: 400 });
    }

    const create = await prisma.user.create({
        data: {
            name: body.name,
            email: body.email,
            password: body.password
        }
    });

    return NextResponse.json({
        message: "User berhasil dibuat",
        success: true,
        data: create
    });
};

