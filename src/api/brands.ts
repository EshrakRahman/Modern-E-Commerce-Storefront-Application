import { BrandSchema } from "@/schemas/productSchema.ts";
import { apiFetch } from "@/api/client.ts";
import { z } from "zod";

export async function getBrands() {
  const raw = await apiFetch<{ data: unknown }>("/v1/brands");
  return z.array(BrandSchema).parse(raw.data);
}
