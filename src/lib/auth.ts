import NextAuth from "next-auth";
import Nodemailer from "next-auth/providers/nodemailer";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/features/shared/lib/prisma";
import authConfig from "@/auth.config";

let etherealMailPromise: Promise<{ server: string; from: string }> | null =
  null;

async function resolveMail() {
  if (process.env.AUTH_EMAIL_SERVER?.trim() && process.env.NODE_ENV !== "development") {
    return {
      server: process.env.AUTH_EMAIL_SERVER,
      from:
        process.env.AUTH_EMAIL_FROM?.trim() ??
        `"Lions Nursery" <${process.env.ADMIN_EMAIL ?? "noreply@localhost"}>`,
    };
  }

  if (process.env.NODE_ENV === "development") {
    etherealMailPromise ??= (async () => {
      const nodemailer = await import("nodemailer");
      const account = await nodemailer.default.createTestAccount();
      const server = `smtp://${encodeURIComponent(account.user)}:${encodeURIComponent(account.pass)}@smtp.ethereal.email:587`;
      const from = `"Lions Nursery Dev" <${account.user}>`;
      console.info(
        [
          "",
          "──────────────────────────────────────────────────────────",
          "  Ethereal Email (dev) — open magic links here",
          "  https://ethereal.email/login",
          `  User: ${account.user}`,
          `  Pass: ${account.pass}`,
          "──────────────────────────────────────────────────────────",
          "",
        ].join("\n"),
      );
      return { server, from };
    })();
    return etherealMailPromise;
  }

  throw new Error(
    "AUTH_EMAIL_SERVER is not set. In development, omit it to use Ethereal automatically. In production, set AUTH_EMAIL_SERVER and AUTH_EMAIL_FROM.",
  );
}

export const { handlers, signIn, signOut, auth } = NextAuth(async () => {
  const { server, from } = await resolveMail();
  return {
    ...authConfig,
    adapter: PrismaAdapter(prisma),
    providers: [
      Nodemailer({
        server,
        from,
      }),
    ],
  };
});

