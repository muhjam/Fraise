import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET ?? "fraise-secret-key-change-in-production";

const PROTECTED_PREFIXES = ["/dashboard", "/playground"];

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

    if (isProtected) {
        // Accept both old and new cookie name for backward compatibility
        const token =
            req.cookies.get("token")?.value ??
            req.cookies.get("fraise_token")?.value;

        if (!token) {
            const redirectUrl = new URL("/login", req.url);
            redirectUrl.searchParams.set("redirect", pathname);
            return NextResponse.redirect(redirectUrl);
        }

        try {
            const secret = new TextEncoder().encode(JWT_SECRET);
            await jwtVerify(token, secret);
        } catch (err: any) {
            console.error("Middleware JWT Verify failed. Reason:", err.message);
            const redirectUrl = new URL("/login", req.url);
            redirectUrl.searchParams.set("redirect", pathname);
            redirectUrl.searchParams.set("error", err.message);
            return NextResponse.redirect(redirectUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard", "/dashboard/:path*", "/playground", "/playground/:path*"],
};

