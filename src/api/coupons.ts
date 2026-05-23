import { apiFetch } from "@/api/client.ts";
import { CouponResponseSchema, type CouponResponse } from "@/schemas/productSchema.ts";

export async function applyCoupon(code: string, subtotal: number): Promise<CouponResponse> {
  const data = await apiFetch<unknown>("/v1/coupons/apply", {
    method: "POST",
    body: JSON.stringify({ code, subtotal }),
  });
  return CouponResponseSchema.parse(data);
}
