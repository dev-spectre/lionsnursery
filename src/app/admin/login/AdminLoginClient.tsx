"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Leaf } from "lucide-react";

export function AdminLoginClient() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lg">
        <div className="flex items-center gap-2 font-display text-xl font-bold text-botanical-text">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-botanical-primary-light text-botanical-primary">
            <Leaf className="h-5 w-5" />
          </span>
          Lions Nursery Admin
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in with a magic link sent to your email.
        </p>
        {sent ? (
          <p className="mt-6 rounded-lg bg-botanical-primary-light p-4 text-sm text-botanical-text">
            Check your email for a login link. After you open it, you will be
            sent to the dashboard.
          </p>
        ) : (
          <form
            className="mt-6 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              const result = await signIn("nodemailer", {
                email,
                callbackUrl: "/admin/dashboard",
                redirect: false,
              });
              if (result?.error) {
                setError(
                  result.error === "AccessDenied"
                    ? "This email is not allowed to sign in."
                    : "Could not send the login email. Try again.",
                );
                return;
              }
              setSent(true);
            }}
          >
            {error ? (
              <p className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </p>
            ) : null}
            <div>
              <label className="text-sm font-medium" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 rounded-lg"
                autoComplete="email"
              />
            </div>
            <Button type="submit" className="w-full rounded-full">
              Send magic link
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
