import { NextRequest, NextResponse } from "next/server";
import { resetPassword } from "@/api/auth";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { token, password } = body;

        if (!token || !password) {
            return NextResponse.json({ error: "Token and new password are required" }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
        }

        await resetPassword(token, password);

        return NextResponse.json({ message: "Password has been reset successfully" }, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json({ error: message }, { status: 400 });
    }
}
