import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/api/auth";
import { COOKIE_NAME } from "@/lib/auth-cookie";

function getAdminUser(req: NextRequest) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token) return null;
    const user = verifyToken(token);
    if (!user || user.role !== "SUPER_ADMIN") return null;
    return user;
}

// GET /api/admin/users — list all users
export async function GET(req: NextRequest) {
    if (!getAdminUser(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            planId: true,
            planStartDate: true,
            planEndDate: true,
            isVerified: true,
            createdAt: true,
        },
    });

    return NextResponse.json({ users });
}

// PATCH /api/admin/users — update plan for a user
export async function PATCH(req: NextRequest) {
    if (!getAdminUser(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { userId, planId, planStartDate, planEndDate } = body;

    if (!userId) {
        return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const updated = await prisma.user.update({
        where: { id: userId },
        data: {
            planId: planId ?? null,
            planStartDate: planStartDate ? new Date(planStartDate) : null,
            planEndDate: planEndDate ? new Date(planEndDate) : null,
        },
        select: {
            id: true,
            email: true,
            planId: true,
            planStartDate: true,
            planEndDate: true,
        },
    });

    return NextResponse.json({ user: updated });
}
