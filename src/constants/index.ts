// Google Forms — CONTACT FORM ONLY. Orders go to DB.
export const GOOGLE_FORMS = {
  CONTACT: {
    url: "https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse",
    fields: {
      name: "entry.XXXXXXXXX",
      phone: "entry.XXXXXXXXX",
      message: "entry.XXXXXXXXX",
    },
  },
};

export const BUSINESS = {
  name: "Lions Landscape Nursery",
  shortName: "Lions Nursery",
  tagline: "Bringing Nature's Beauty to Your Home",
  phone: "+91 9383475378",
  whatsapp: "+91 9383475378",
  email: "info@lionslandscapenursery.com",
  /** Matches Google Maps search used in the embed below. */
  address: "Lions Nursery, Coimbatore — Kurumbapalayam, Tamil Nadu 641107",
  /**
   * Google Maps embed with a marker at the nursery area (Kurumbapalayam, ~641107).
   * `q=lat,lng` with `output=embed` shows the red pin; text-only queries often omit it.
   */
  mapEmbedUrl:
    "https://www.google.com/maps?q=11.1255%2C77.0320&z=16&hl=en&output=embed",
  hours: "Monday - Sunday, 9:00 AM - 6:00 PM",
  established: "2020",
  domain: "https://lionslandscapenursery.com",
};

export const CLOUDINARY = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
  folders: {
    plants: "lions-nursery/plants",
    hero: "lions-nursery/hero",
    settings: "lions-nursery/settings",
  },
};

export const REVALIDATE = {
  landing: 3600,
  plants: 300,
};
