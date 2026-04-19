import { z } from "zod";

export const orderStatuses = [
  "PENDING",
  "CONTACTED",
  "CONFIRMED",
  "DELIVERED",
  "CANCELLED",
] as const;

export const orderCreateSchema = z.object({
  customerName: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  address: z.string().optional(),
  message: z.string().optional(),
  couponCode: z.string().optional(),
  items: z
    .array(
      z.object({
        plantId: z.string().min(1),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1, "Cart cannot be empty"),
});

export const plantCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  price: z.number().positive(),
  imageUrl: z.string().url().optional().nullable().or(z.literal("")),
  inStock: z.boolean().optional(),
  categoryIds: z.array(z.string()).min(1),
});

export const plantPatchSchema = plantCreateSchema
  .partial()
  .extend({
    restore: z.boolean().optional(),
  });

export const categoryCreateSchema = z.object({
  name: z.string().min(1),
});

export const couponCreateSchema = z.object({
  code: z.string().min(1),
  discount: z.number().min(0).max(100),
  maxUses: z.number().int().positive().optional().nullable(),
  active: z.boolean().optional(),
  expiresAt: z.string().optional().nullable(),
});

export const couponPatchSchema = couponCreateSchema.partial();

export const heroSlideCreateSchema = z.object({
  imageUrl: z.string().url().optional().nullable().or(z.literal("")),
  title: z.string().optional().nullable(),
  subtitle: z.string().optional().nullable(),
  active: z.boolean().optional(),
  order: z.number().int().optional(),
});

export const settingsPatchSchema = z.object({
  siteName: z.string().optional(),
  tagline: z.string().optional().nullable(),
  aboutTitle: z.string().optional().nullable(),
  aboutBody: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  mapEmbedUrl: z.string().optional().nullable(),
  hours: z.string().optional().nullable(),
  footerText: z.string().optional().nullable(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  ogImageUrl: z.string().optional().nullable(),
});

export const orderStatusSchema = z.object({
  status: z.enum(orderStatuses),
});

export const revalidateSchema = z.object({
  paths: z.array(z.string().min(1)),
});

export const heroReorderSchema = z.object({
  ids: z.array(z.string().min(1)),
});
