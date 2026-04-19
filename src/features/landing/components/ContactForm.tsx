"use client";

import { useState } from "react";
import { submitContactForm } from "@/features/shared/lib/google-forms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await submitContactForm({ name, phone, message });
      toast.success("Message sent! We'll get back to you shortly.");
      setName("");
      setPhone("");
      setMessage("");
    } catch {
      toast.error("Failed to send. Please call us directly.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mt-6 space-y-4 rounded-xl border border-border bg-card p-6 shadow-md"
    >
      <div>
        <label className="text-sm font-medium text-botanical-text" htmlFor="cf-name">
          Full Name <span className="text-destructive">*</span>
        </label>
        <Input
          id="cf-name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1.5 rounded-lg border-border"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-botanical-text" htmlFor="cf-phone">
          Phone <span className="text-destructive">*</span>
        </label>
        <Input
          id="cf-phone"
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1.5 rounded-lg border-border"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-botanical-text" htmlFor="cf-msg">
          Message <span className="text-destructive">*</span>
        </label>
        <Textarea
          id="cf-msg"
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1.5 rounded-lg border-border"
        />
      </div>
      <Button
        type="submit"
        className="w-full rounded-full shadow-none"
        disabled={loading}
      >
        {loading ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
