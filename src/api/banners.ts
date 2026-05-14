import { BannerSchema } from "@/schemas/bannerSchema";
import { apiFetch } from "@/api/client";
import { z } from "zod";

export async function getBanners() {
  const raw = await apiFetch<{ data: unknown }>("/v1/banners?position=hero");
  return z.array(BannerSchema).parse(raw.data);
}
