import { NextRequest, NextResponse } from "next/server";
import { changePassword, verifyToken } from "@/api/auth";

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get("fraise_token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const user = verifyToken(token);
        if (!user) {
            return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });
        }

        const body = await req.json();
        const { currentPassword, newPassword } = body;

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ error: "Current and new passwords are required" }, { status: 400 });
        }

        if (newPassword.length < 8) {
            return NextResponse.json({ error: "New password must be at least 8 characters" }, { status: 400 });
        }

        await changePassword(user.id, currentPassword, newPassword);

        return NextResponse.json({ message: "Password changed successfully" }, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json({ error: message }, { status: 400 });
    }
}
