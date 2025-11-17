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



