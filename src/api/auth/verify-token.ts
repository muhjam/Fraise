import jwt from "jsonwebtoken";
import type { AuthUser } from "./index";

const JWT_SECRET = process.env.JWT_SECRET ?? "fraise-secret-key-change-in-production";

export function verifyToken(token: string): AuthUser | null {
    try {
        return jwt.verify(token, JWT_SECRET) as AuthUser;
    } catch {
        return null;
    }
}
