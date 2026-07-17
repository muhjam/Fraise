import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/api/auth";
import { COOKIE_NAME } from "@/lib/auth-cookie";

export async function GET(req: NextRequest) {
    const token = req.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user) {
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    return NextResponse.json({ user }, { status: 200 });
}

export async function DELETE() {
    const response = NextResponse.json({ message: "Logged out" }, { status: 200 });
    response.cookies.set(COOKIE_NAME, "", { maxAge: 0, path: "/" });
    return response;
}
