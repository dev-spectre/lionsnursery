/**
 * Append auto format/quality for delivery URLs.
 */
export function cloudinaryDeliveryUrl(url: string | null | undefined): string | undefined {
  if (!url?.trim()) return undefined;
  if (!url.includes("res.cloudinary.com")) return url;
  if (url.includes("/upload/f_auto,q_auto")) return url;
  return url.replace("/upload/", "/upload/f_auto,q_auto/");
}

export function cloudinaryBlurDataUrl(url: string | null | undefined): string | undefined {
  if (!url?.trim()) return undefined;
  if (!url.includes("res.cloudinary.com")) return undefined;
  const withTransform = url.replace("/upload/", "/upload/f_auto,q_1,w_10/");
  return withTransform;
}
