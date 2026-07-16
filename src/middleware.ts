import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/api/auth/verify-token";

const ADMIN_ROLES = ["OWNER", "TEACHER"];
const STUDENT_ROLE = "STUDENT";

const protectedRoutes: Record<string, string[]> = {
    "/dashboard": ADMIN_ROLES,
    "/moduls": [STUDENT_ROLE, ...ADMIN_ROLES], // both can view moduls
};

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Find if this route needs protection
    const matchedRoute = Object.keys(protectedRoutes).find((route) =>
        pathname.startsWith(route)
    );

    if (!matchedRoute) return NextResponse.next();

    const token = req.cookies.get("fraise_token")?.value;

    // Not logged in → redirect to login
    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    const user = verifyToken(token);
    if (!user) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    const allowedRoles = protectedRoutes[matchedRoute];

    // Role not allowed for this route
    if (!allowedRoles.includes(user.role)) {
        if (user.role === STUDENT_ROLE) {
            return NextResponse.redirect(new URL("/moduls", req.url));
        }
        return NextResponse.redirect(new URL("/dashboard/home", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/moduls/:path*"],
};
