import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

/**
 * Creates a nodemailer transporter using Google OAuth2 credentials.
 *
 * Required env vars (production):
 *   GMAIL_USER          – the Gmail address to send from
 *   GMAIL_CLIENT_ID     – Google Cloud OAuth2 client ID
 *   GMAIL_CLIENT_SECRET – Google Cloud OAuth2 client secret
 *   GMAIL_REFRESH_TOKEN – long-lived refresh token with https://mail.google.com/ scope
 *
 * In development, if GMAIL_CLIENT_ID is not set, an Ethereal test account is
 * created automatically so magic-link emails can be inspected without real creds.
 */

let cachedTransport: Transporter | null = null;

export async function getMailTransport(): Promise<Transporter> {
  if (cachedTransport) return cachedTransport;

  // ── Development fallback: Ethereal ─────────────────────────────────
  if (process.env.NODE_ENV === "development" && !process.env.GMAIL_CLIENT_ID) {
    const testAccount = await nodemailer.createTestAccount();
    console.info(
      [
        "",
        "──────────────────────────────────────────────────────────",
        "  Ethereal Email (dev) — open magic links here",
        "  https://ethereal.email/login",
        `  User: ${testAccount.user}`,
        `  Pass: ${testAccount.pass}`,
        "──────────────────────────────────────────────────────────",
        "",
      ].join("\n"),
    );

    cachedTransport = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    return cachedTransport;
  }

  // ── Production: Google OAuth2 ──────────────────────────────────────
  const user = process.env.GMAIL_USER;
  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;

  if (!user || !clientId || !clientSecret || !refreshToken) {
    throw new Error(
      "Missing Gmail OAuth2 env vars. Set GMAIL_USER, GMAIL_CLIENT_ID, " +
        "GMAIL_CLIENT_SECRET, and GMAIL_REFRESH_TOKEN. " +
        "In development, omit GMAIL_CLIENT_ID to use Ethereal automatically.",
    );
  }

  cachedTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user,
      clientId,
      clientSecret,
      refreshToken,
    },
  });

  return cachedTransport;
}

/**
 * Returns the "from" address for outgoing emails.
 */
export function getMailFrom(): string {
  return (
    process.env.AUTH_EMAIL_FROM?.trim() ||
    `"Lions Nursery" <${process.env.GMAIL_USER ?? process.env.ADMIN_EMAIL ?? "noreply@localhost"}>`
  );
}
