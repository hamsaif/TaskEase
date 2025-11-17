import { PrismaClient } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// ambil satu user
export const GET = async (
    request: NextRequest,
    { params }: { params: { slug: string } }
) => {
    const id = params.slug;

    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true
        }
    });

    if (!user) {
        return NextResponse.json({
            message: "User tidak ditemukan",
            success: false
        }, { status: 404 });
    }

    return NextResponse.json({
        message: "User ditemukan",
        success: true,
        data: user
    });
};

// service delete user
export const DELETE = async (
    request: NextRequest,
    { params }: { params: { slug: string } }
) => {
    const id = params.slug;

    const check = await prisma.user.findUnique({
        where: { id },
        select: { id: true }
    });

    if (!check) {
        return NextResponse.json({
            message: "User gagal dihapus, id tidak ditemukan",
            success: false
        }, { status: 404 });
    }

    await prisma.user.delete({
        where: { id }
    });

    return NextResponse.json({
        message: "User berhasil dihapus",
        success: true
    });
};