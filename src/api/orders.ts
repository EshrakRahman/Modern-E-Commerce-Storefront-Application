import { apiFetch } from "@/api/client.ts";
import { z } from "zod";
import {OrderSchema, type PlaceOrderPayload} from "@/schemas/productSchema.ts";

type Order = z.infer<typeof OrderSchema>;

const RetryPaymentResponseSchema = z.object({
  payment_intent_id: z.string(),
  payment_intent_client_secret: z.string(),
});

const ConfirmPaymentResponseSchema = z.object({
  order_id: z.number(),
  order_number: z.string(),
  paid: z.boolean(),
  payment_status: z.string(),
  status: z.string(),
  stripe_status: z.string(),
});

const PaymentStatusResponseSchema = z.object({
  order_id: z.number(),
  order_number: z.string(),
  payment_status: z.string(),
  status: z.string(),
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

export async function confirmPayment(
  orderId: number
): Promise<z.infer<typeof ConfirmPaymentResponseSchema>> {
  const raw = await apiFetch<{ data: unknown }>(
    `/v1/orders/${orderId}/confirm-payment`,
    { method: "POST" }
  );
  return ConfirmPaymentResponseSchema.parse(raw);
}

export async function retryPayment(
  orderId: number
): Promise<z.infer<typeof RetryPaymentResponseSchema>> {
  const raw = await apiFetch<{ data: unknown }>(
    `/v1/orders/${orderId}/retry-payment`,
    { method: "POST" }
  );
  return RetryPaymentResponseSchema.parse(raw);
}

export async function getPaymentStatus(
  orderId: number
): Promise<z.infer<typeof PaymentStatusResponseSchema>> {
  const raw = await apiFetch<{ data: unknown }>(
    `/v1/orders/${orderId}/payment-status`
  );
  return PaymentStatusResponseSchema.parse(raw);
}
