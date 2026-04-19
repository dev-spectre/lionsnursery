import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe config for middleware (no Prisma). Must match session shape from
 * `@/lib/auth`: JWT strategy so middleware can verify the cookie without DB.
 */
export default {
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/admin/login",
  },
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  callbacks: {
    async signIn({ user }) {
      if (!user?.email) return false;
      const admin = process.env.ADMIN_EMAIL?.trim().toLowerCase();
      return user.email.trim().toLowerCase() === admin;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id ?? token.sub;
        if (user.email) token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (token.sub) session.user.id = token.sub;
        if (typeof token.email === "string") session.user.email = token.email;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      try {
        if (new URL(url).origin === baseUrl) return url;
      } catch {
        /* ignore */
      }
      return `${baseUrl}/admin/dashboard`;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
