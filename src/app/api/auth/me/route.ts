import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/api/auth";

export async function GET(req: NextRequest) {
    const token = req.cookies.get("token")?.value ?? req.cookies.get("fraise_token")?.value;

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
    response.cookies.set("token", "", { maxAge: 0, path: "/" });
    response.cookies.set("fraise_token", "", { maxAge: 0, path: "/" });
    return response;
}
