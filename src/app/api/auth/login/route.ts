import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/api/auth";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        const { token, user } = await loginUser({ email, password });

        const response = NextResponse.json({ user }, { status: 200 });

        // Set JWT as HttpOnly cookie for security
        response.cookies.set("fraise_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });

        return response;
    } catch (error) {
        const message = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json({ error: message }, { status: 401 });
    }
}
