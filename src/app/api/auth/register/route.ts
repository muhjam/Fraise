import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/api/auth";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, password, role, bimbelName, bimbelId } = body;

        if (!name || !email || !password || !role) {
            return NextResponse.json(
                { error: "Name, email, password, and role are required" },
                { status: 400 }
            );
        }

        const { token, user } = await registerUser({ name, email, password, role, bimbelName, bimbelId });

        const response = NextResponse.json({ user }, { status: 201 });

        response.cookies.set("fraise_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });

        return response;
    } catch (error) {
        const message = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json({ error: message }, { status: 400 });
    }
}
