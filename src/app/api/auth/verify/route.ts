import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
        return NextResponse.redirect(new URL("/login?error=Invalid verification link", req.url));
    }

    const activationTokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await prisma.user.findFirst({
        where: { activationTokenHash },
    });

    if (!user) {
        return NextResponse.redirect(new URL("/login?error=Invalid or expired verification link", req.url));
    }

    await prisma.user.update({
        where: { id: user.id },
        data: {
            isVerified: true,
            activationTokenHash: null,
        },
    });

    return NextResponse.redirect(new URL("/login?verified=true", req.url));
}
