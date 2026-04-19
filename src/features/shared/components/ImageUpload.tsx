"use client";

import { useEffect, useRef, useState } from "react";
import { CLOUDINARY } from "@/constants";
import { cloudinaryDeliveryUrl } from "@/features/shared/lib/cloudinary";
import { Button } from "@/components/ui/button";
import { ImageIcon, Trash2 } from "lucide-react";

declare global {
  interface Window {
    cloudinary?: {
      createUploadWidget: (
        options: Record<string, unknown>,
        callback: (err: unknown, result: { event: string; info?: { secure_url: string } }) => void,
      ) => { open: () => void };
    };
  }
}

type Props = {
  folder: string;
  currentUrl?: string | null;
  onUpload: (url: string) => void;
  onRemove?: () => void;
};

export function ImageUpload({
  folder,
  currentUrl,
  onUpload,
  onRemove,
}: Props) {
  const widgetRef = useRef<ReturnType<
    NonNullable<typeof window.cloudinary>["createUploadWidget"]
  > | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.cloudinary) {
      setReady(true);
      return;
    }
    const existing = document.querySelector(
      'script[data-cloudinary-widget="1"]',
    );
    if (existing) {
      existing.addEventListener("load", () => setReady(true));
      return;
    }
    const s = document.createElement("script");
    s.src = "https://upload-widget.cloudinary.com/global/all.js";
    s.async = true;
    s.dataset.cloudinaryWidget = "1";
    s.onload = () => setReady(true);
    document.body.appendChild(s);
  }, []);

  const open = () => {
    if (!window.cloudinary || !CLOUDINARY.cloudName || !CLOUDINARY.uploadPreset) {
      return;
    }
    widgetRef.current?.open();
  };

  useEffect(() => {
    if (!ready || !window.cloudinary) return;
    widgetRef.current = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUDINARY.cloudName,
        uploadPreset: CLOUDINARY.uploadPreset,
        folder,
        sources: ["local", "url", "camera"],
      },
      (_err, result) => {
        if (result?.event === "success" && result.info?.secure_url) {
          const url = cloudinaryDeliveryUrl(result.info.secure_url) ?? result.info.secure_url;
          onUpload(url);
        }
      },
    );
  }, [ready, folder, onUpload]);

  const preview = cloudinaryDeliveryUrl(currentUrl ?? undefined) ?? currentUrl;

  return (
    <div className="flex flex-col gap-3">
      {preview ? (
        <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-xl border border-border bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="flex aspect-video w-full max-w-md items-center justify-center rounded-xl border border-dashed border-border bg-botanical-primary-light/40">
          <ImageIcon className="h-10 w-10 text-botanical-text-muted" />
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          className="rounded-full"
          onClick={open}
          disabled={!ready}
        >
          {preview ? "Change image" : "Upload image"}
        </Button>
        {preview && onRemove && (
          <Button
            type="button"
            variant="ghost"
            className="rounded-full text-destructive"
            onClick={onRemove}
          >
            <Trash2 className="mr-1 h-4 w-4" />
            Remove
          </Button>
        )}
      </div>
    </div>
  );
}
