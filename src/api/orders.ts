import { apiFetch } from "@/api/client.ts";
import { z } from "zod";
import {OrderSchema, type PlaceOrderPayload} from "@/schemas/productSchema.ts";

type Order = z.infer<typeof OrderSchema>;

const RetryPaymentResponseSchema = z.object({
  payment_intent_client_secret: z.string(),
});

const PaymentStatusResponseSchema = z.object({
  payment_status: z.string(),
});

export async function getOrders(): Promise<Order[]> {
  const raw = await apiFetch<{ data: unknown }>("/v1/orders");
  return z.array(OrderSchema).parse(raw.data);
}

export async function getOrder(id: number): Promise<Order> {
  const raw = await apiFetch<{ data: unknown }>(`/v1/orders/${id}`);
  return OrderSchema.parse(raw.data);
}

export async function placeOrder(payload: PlaceOrderPayload): Promise<Order> {
  const raw = await apiFetch<{ data: unknown }>("/v1/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return OrderSchema.parse(raw.data);
}

export async function retryPayment(
  orderId: number
): Promise<{ payment_intent_client_secret: string }> {
  const raw = await apiFetch<{ data: unknown }>(
    `/v1/orders/${orderId}/retry-payment`,
    { method: "POST" }
  );
  return RetryPaymentResponseSchema.parse(raw.data);
}

export async function getPaymentStatus(
  orderId: number
): Promise<{ payment_status: string }> {
  const raw = await apiFetch<{ data: unknown }>(
    `/v1/orders/${orderId}/payment-status`
  );
  return PaymentStatusResponseSchema.parse(raw.data);
}
