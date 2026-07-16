import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { registerUser } from "@/api/auth";
import { sendEmail } from "@/lib/send-email";
import { APP_NAME } from "@/config";
import crypto from "crypto";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, password } = body;

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Name, email, and password are required" },
                { status: 400 }
            );
        }

        let activationToken = "";
        let authUser = null;
        let responseStatus = 201;
        const existing = await prisma.user.findUnique({ where: { email } });

        if (existing) {
            if (existing.isVerified) {
                // If email already registered and verified, return success silently to prevent enumeration
                return NextResponse.json({ emailSent: true }, { status: 200 });
            } else {
                // If not verified, regenerate token and resend email
                activationToken = crypto.randomBytes(32).toString("hex");
                const activationTokenHash = crypto.createHash("sha256").update(activationToken).digest("hex");
                await prisma.user.update({
                    where: { id: existing.id },
                    data: { activationTokenHash },
                });
                authUser = existing;
                responseStatus = 200;
            }
        } else {
            // New registration
            const res = await registerUser({ name, email, password });
            activationToken = res.activationToken;
            authUser = res.user;
        }

        const response = NextResponse.json({ emailSent: true, user: authUser }, { status: responseStatus });

        // Build email
        const verificationLink = `${req.nextUrl.origin}/api/auth/verify?token=${activationToken}`;

        const htmlBody = `
        <!DOCTYPE html>
        <html lang="id">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 40px 0; color: #1f2937; }
            .wrapper { width: 100%; max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); overflow: hidden; }
            .header-banner { background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%); padding: 32px 20px; text-align: center; }
            .header-banner h1 { margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
            .content { padding: 32px 40px; text-align: center; }
            .content h2 { margin: 0 0 16px; font-size: 20px; font-weight: 600; color: #111827; }
            .content p { margin: 0 0 24px; font-size: 15px; line-height: 1.6; color: #4b5563; }
            .button { display: inline-block; background-color: #111827; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); width: 100%; box-sizing: border-box; }
            .button:hover { background-color: #374151; }
            .footer { padding: 24px; text-align: center; border-top: 1px solid #f3f4f6; }
            .footer p { margin: 0; font-size: 13px; color: #9ca3af; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="header-banner">
              <h1>${APP_NAME}</h1>
            </div>
            <div class="content">
              <h2>Halo, ${name}! 👋</h2>
              <p>Terima kasih telah mendaftar. Akun Anda telah berhasil dibuat dan hampir siap digunakan. Sebagai langkah terakhir, silakan klik tombol di bawah ini untuk mengaktifkan akun Anda.</p>
              <a href="${verificationLink}" class="button" style="color: #ffffff;">Aktifkan Akun Saya</a>
            </div>
            <div class="footer">
              <p>Tautan ini hanya berlaku selama 5 menit.</p>
              <p style="margin-top: 8px;">&copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
        `;

        sendEmail({
            to: email,
            subject: `Aktivasi Akun ${APP_NAME}`,
            message: `Halo ${name},\n\nTerima kasih telah mendaftar di ${APP_NAME}. Silakan kunjungi link berikut untuk mengaktifkan akun Anda:\n\n${verificationLink}\n\nSetelah aktivasi, Anda bisa login.`,
            htmlBody: htmlBody,
        }).catch(() => { });

        return response;
    } catch (error) {
        const message = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json({ error: message }, { status: 400 });
    }
}
