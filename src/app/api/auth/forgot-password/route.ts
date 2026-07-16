import { NextRequest, NextResponse } from "next/server";
import { requestPasswordReset } from "@/api/auth";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // requestPasswordReset doesn't reveal if email exists or not
        const { resetToken } = await requestPasswordReset(email);

        // In a real app, send the resetToken via email.
        // For dev purposes, we return the token in the response.
        const isDev = process.env.NODE_ENV !== "production";
        return NextResponse.json(
            {
                message: "If that email exists, a reset link has been sent.",
                ...(isDev && resetToken ? { resetToken } : {}),
            },
            { status: 200 }
        );
    } catch (error) {
        const message = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
