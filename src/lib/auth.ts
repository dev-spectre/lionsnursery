import NextAuth from "next-auth";
import Nodemailer from "next-auth/providers/nodemailer";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/features/shared/lib/prisma";
import authConfig from "@/auth.config";
import { getMailTransport, getMailFrom } from "@/lib/mailer";

export const { handlers, signIn, signOut, auth } = NextAuth(async () => {
  return {
    ...authConfig,
    adapter: PrismaAdapter(prisma),
    providers: [
      Nodemailer({
        // The `server` field is required by the type but unused when we
        // provide a custom `sendVerificationRequest`. Pass a dummy value.
        server: {},
        from: getMailFrom(),
        async sendVerificationRequest({ identifier: email, url, provider }) {
          const transport = await getMailTransport();

          const result = await transport.sendMail({
            to: email,
            from: provider.from,
            subject: "Sign in to Lions Nursery",
            text: `Sign in to Lions Nursery\n\n${url}\n\n`,
            html: `
              <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f4f4f5; padding: 40px 0;">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                  <tr>
                    <td style="background: linear-gradient(135deg, #16a34a, #15803d); padding: 32px 24px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">🌿 Lions Nursery</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 32px 24px;">
                      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 8px;">Hello,</p>
                      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">Click the button below to sign in to your account. This link will expire shortly.</p>
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center">
                            <a href="${url}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #16a34a, #15803d); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 600;">Sign in</a>
                          </td>
                        </tr>
                      </table>
                      <p style="color: #6b7280; font-size: 13px; line-height: 1.5; margin: 24px 0 0;">If you didn't request this email, you can safely ignore it.</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="background: #f9fafb; padding: 16px 24px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <p style="color: #9ca3af; font-size: 12px; margin: 0;">© Lions Landscape Nursery</p>
                    </td>
                  </tr>
                </table>
              </body>
            `,
          });

          const failed = result.rejected?.concat(result.pending ?? []).filter(Boolean);
          if (failed && failed.length > 0) {
            throw new Error(
              `Email(s) (${failed.join(", ")}) could not be sent`,
            );
          }
        },
      }),
    ],
  };
});
