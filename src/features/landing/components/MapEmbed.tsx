"use client";

export function MapEmbed({ src }: { src: string }) {
  return (
    <iframe
      title="Google Map — Lions Nursery, Coimbatore"
      src={src}
      className="h-[400px] min-h-[320px] w-full rounded-xl border border-border shadow-md"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
    />
  );
}
