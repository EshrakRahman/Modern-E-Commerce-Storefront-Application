import { ProductSchema } from "@/schemas/productSchema.ts";
import { apiFetch } from "@/api/client.ts";
import { z } from "zod";

export const PaginationMetaSchema = z.object({
  current_page: z.number().optional(),
  from: z.number().nullable().optional(),
  last_page: z.number().optional(),
  per_page: z.number().optional(),
  to: z.number().nullable().optional(),
  total: z.number().optional(),
  next_cursor: z.string().nullable().optional(),
  prev_cursor: z.string().nullable().optional(),
});

export const PaginatedProductsSchema = z.object({
  data: z.array(ProductSchema),
  meta: PaginationMetaSchema.optional(),
});

export type PaginatedProducts = z.infer<typeof PaginatedProductsSchema>;

export async function getProducts(
  params?: {
    search?: string;
    category?: string;
    sort?: string;
    featured?: boolean;
    limit?: number;
    page?: number;
    cursor?: string;
    per_page?: number;
    minPrice?: number;
    maxPrice?: number;
    size?: string;
    onSale?: boolean;
    brand?: string;
  }
): Promise<PaginatedProducts> {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.category) query.set("category", params.category);
  if (params?.sort) query.set("sort", params.sort);
  if (params?.featured) query.set("featured", "true");
  if (params?.onSale) query.set("on_sale", "true");
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.page) query.set("page", String(params.page));
  if (params?.cursor) query.set("cursor", params.cursor);
  if (params?.per_page) query.set("per_page", String(params.per_page));
  if (params?.minPrice !== undefined) query.set("min_price", String(params.minPrice));
  if (params?.maxPrice !== undefined) query.set("max_price", String(params.maxPrice));
  if (params?.size) query.set("size", params.size);
  if (params?.brand) query.set("brand", params.brand);

  const qs = query.toString();
  const path = qs ? `/v1/products?${qs}` : "/v1/products";
  const raw = await apiFetch<unknown>(path);
  return PaginatedProductsSchema.parse(raw);
}

export async function getProduct(id: number) {
  const raw = await apiFetch<{ data: unknown }>(`/v1/products/${id}`);
  return ProductSchema.parse(raw.data);
}

export async function getProductBySlug(slug: string) {
  const raw = await apiFetch<{ data: unknown }>(
    `/v1/products/by-slug/${slug}`
  );
  return ProductSchema.parse(raw.data);
}
