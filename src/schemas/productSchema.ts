import { z } from "zod";

export const SizeSchema = z.object({
  id: z.number(),
  name: z.string(),
  additional_price: z.number().optional(),
  stock: z.number(),
});

export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  category: z.string().nullable(),
  description: z.string().nullable(),
  price: z.number(),
  sale_price: z.number().nullable().optional(),
  has_discount: z.boolean().nullable().optional(),
  compare_price: z.number().nullable(),
  quantity: z.number(),
  image: z.string().nullable(),
  sizes: z.array(SizeSchema).default([]),
  is_featured: z.boolean(),
  created_at: z.string(),
});

export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  created_at: z.string(),
});

export const CategoryWithProductsSchema = CategorySchema.extend({
  products: z.array(ProductSchema),
});

export const CartPreviewItemSchema = z.object({
  product_id: z.number(),
  product_name: z.string(),
  size_id: z.number().nullable(),
  size_name: z.string().nullable(),
  unit_price: z.number(),
  quantity: z.number(),
  subtotal: z.number(),
  in_stock: z.boolean(),
  available_stock: z.number(),
});

export const CartPreviewResponseSchema = z.object({
  items: z.array(CartPreviewItemSchema),
  subtotal: z.number(),
  total: z.number(),
});

export const OrderItemSchema = z.object({
  product_name: z.string(),
  size_name: z.string().nullable(),
  quantity: z.number(),
  unit_price: z.number(),
  subtotal: z.number(),
});

export const AddressSchema = z.object({
  name: z.string(),
  phone: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  country: z.string(),
});

export const OrderSchema = z.object({
  id: z.number(),
  order_number: z.string(),
  status: z.string(),
  items: z.array(OrderItemSchema),
  subtotal: z.number(),
  shipping_cost: z.number(),
  discount: z.number(),
  total: z.number(),
  shipping_address: AddressSchema,
  billing_address: AddressSchema.nullable(),
  notes: z.string().nullable(),
  payment_status: z.string(),
  created_at: z.string(),
});

export const PlaceOrderItemSchema = z.object({
  product_id: z.number(),
  size_id: z.number().nullable().optional(),
  quantity: z.number(),
})

export const PlaceOrderPayloadSchema = z.object({
  items: z.array(PlaceOrderItemSchema),
  shipping_address: AddressSchema,
  billing_address: AddressSchema.nullable().optional(),
  notes: z.string().nullable().optional(),
})

export type Product = z.infer<typeof ProductSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Size = z.infer<typeof SizeSchema>;
export type CartPreviewItem = z.infer<typeof CartPreviewItemSchema>;
export type CartPreviewResponse = z.infer<typeof CartPreviewResponseSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type PlaceOrderPayload = z.infer<typeof PlaceOrderPayloadSchema>;
export type PlaceOrderItem = z.infer<typeof PlaceOrderItemSchema>;

