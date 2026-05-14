import { z } from "zod";

export const BannerSchema = z.object({
  id: z.number(),
  title: z.string(),
  subtitle: z.string().nullable(),
  cta_text: z.string(),
  cta_url: z.string(),
  desktop_image: z.string().nullable(),
  mobile_image: z.string().nullable(),
  bg_color: z.string().nullable(),
  text_color: z.string().nullable(),
  sort_order: z.number(),
});

export type Banner = z.infer<typeof BannerSchema>;
