import { apiFetch } from "@/api/client.ts";
import { ProductReviewsResponseSchema, ReviewSchema, type Review, type ProductReviewsResponse } from "@/schemas/productSchema.ts";

export async function getProductReviews(productId: number, page = 1): Promise<ProductReviewsResponse> {
  const data = await apiFetch<unknown>(`/v1/products/${productId}/reviews?page=${page}`);
  return ProductReviewsResponseSchema.parse(data);
}

export async function createReview(
  productId: number,
  payload: { rating: number; title?: string; body: string }
): Promise<Review> {
  const data = await apiFetch<unknown>(`/v1/products/${productId}/reviews`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  // The backend store method returns the new ReviewResource directly.
  // Laravel JsonResource wraps it in a 'data' property by default.
  // Let's check if the backend wraps store response in 'data' key.
  // Store method in ReviewController.php: return new ReviewResource($review);
  // Laravel default behavior wraps it in 'data' when calling toResponse/json serialization.
  // Let's handle both wrapped 'data' and direct object.
  const rawObj = data && typeof data === "object" && "data" in data ? (data as { data: unknown }).data : data;
  return ReviewSchema.parse(rawObj);
}
