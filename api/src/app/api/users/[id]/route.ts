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

// service update user
export const PUT = async (
    request: NextRequest,
    { params }: { params: { slug: string } }
) => {
    const id = params.slug;
    const body = await request.json();

    // Cek email sudah dipakai user lain
    const checkEmail = await prisma.user.findFirst({
        where: {
            email: body.email,
            id: { not: id }
        },
        select: { id: true }
    });

    if (checkEmail) {
        return NextResponse.json({
            message: "Email sudah digunakan user lain",
            success: false
        }, { status: 400 });
    }

    const updated = await prisma.user.update({
        where: { id },
        data: {
            name: body.name,
            email: body.email,
            password: body.password
        }
    });

    return NextResponse.json({
        message: "User berhasil diupdate",
        success: true,
        data: updated
    });
};