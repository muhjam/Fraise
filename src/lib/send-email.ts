/**
 * Sends an email via the Google Apps Script email gateway.
 * Silently swallows errors — email delivery is best-effort.
 */
export interface SendEmailOptions {
    to: string;
    subject: string;
    name?: string;
    message: string;
    title?: string;
    actionLink?: string;
    /** Pass a pre-built HTML body to bypass the GAS template. */
    htmlBody?: string;
}

export async function sendEmail(opts: SendEmailOptions): Promise<void> {
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
    if (!scriptUrl) {
        console.warn("[sendEmail] GOOGLE_SCRIPT_URL is not set — skipping.");
        return;
    }

    const token = process.env.GOOGLE_SCRIPT_TOKEN ?? "aX9pQwL7zRb5MnP4t2VkYj3Hs8NcBd6Uf0GqR1TwXeZsCv4";

    try {
        const res = await fetch(scriptUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token,
                email: opts.to,
                subject: opts.subject,
                name: opts.name ?? opts.to,
                message: opts.message,
                title: opts.title ?? opts.subject,
                actionLink: opts.actionLink ?? null,
                htmlBody: opts.htmlBody ?? null,
            }),
        });

        if (!res.ok) {
            console.warn("[sendEmail] GAS responded with status", res.status);
        }
    } catch (err) {
        // Never let email failure break the caller
        console.warn("[sendEmail] Failed silently:", err);
    }
}
