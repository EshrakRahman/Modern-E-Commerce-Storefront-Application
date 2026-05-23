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
  product_id: z.number(),
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
  shipping_cost: z.number().nullable(),
  discount: z.number().nullable(),
  total: z.number(),
  shipping_address: AddressSchema,
  billing_address: AddressSchema.nullable(),
  notes: z.string().nullable(),
  payment_status: z.string().nullable(),
  payment_intent_id: z.string().nullable().optional(),
  payment_intent_client_secret: z.string().nullable().optional(),
  coupon_code: z.string().nullable().optional(),
  created_at: z.string(),
});

export const PlaceOrderItemSchema = z.object({
  product_id: z.number(),
  size_id: z.number().nullable().optional(),
  quantity: z.number(),
})

export const PlaceOrderPayloadSchema = z.object({
  items: z.array(PlaceOrderItemSchema),
  payment_method: z.string().optional(),
  shipping_address: AddressSchema,
  billing_address: AddressSchema.nullable().optional(),
  notes: z.string().nullable().optional(),
  coupon_code: z.string().nullable().optional(),
});

export const ReviewSchema = z.object({
  id: z.number(),
  user_name: z.string().nullable().optional(),
  product_id: z.number(),
  rating: z.number(),
  title: z.string().nullable().optional(),
  body: z.string(),
  is_approved: z.boolean().nullable().optional(),
  created_at: z.string(),
});

export const ProductReviewsResponseSchema = z.object({
  data: z.array(ReviewSchema),
  meta: z.object({
    average_rating: z.union([z.number(), z.string()]).nullable().optional(),
    total_reviews: z.number(),
  }),
});

export const CouponResponseSchema = z.object({
  code: z.string(),
  type: z.enum(["percentage", "fixed"]),
  value: z.number(),
  discount_amount: z.number(),
  min_order_amount: z.number().nullable().optional(),
  description: z.string().nullable().optional(),
});

export type Product = z.infer<typeof ProductSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Size = z.infer<typeof SizeSchema>;
export type CartPreviewItem = z.infer<typeof CartPreviewItemSchema>;
export type CartPreviewResponse = z.infer<typeof CartPreviewResponseSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type PlaceOrderPayload = z.infer<typeof PlaceOrderPayloadSchema>;
export type PlaceOrderItem = z.infer<typeof PlaceOrderItemSchema>;
export type Review = z.infer<typeof ReviewSchema>;
export type ProductReviewsResponse = z.infer<typeof ProductReviewsResponseSchema>;
export type CouponResponse = z.infer<typeof CouponResponseSchema>;

