import {apiFetch} from "@/api/client.ts";
import {z} from "zod";
import {CartPreviewResponseSchema} from "@/schemas/productSchema.ts";

type CartPreviewResponse = z.infer<typeof CartPreviewResponseSchema>;

const CART_KEY = "shop_cart";

export type LocalCartItem = {
    product_id: number;
    product_name: string;
    price: number;
    image: string;
    quantity: number;
    size_id: number | null;
    size_name: string | null;
};

export function getLocalCart(): LocalCartItem[] {
    try {
        const raw = localStorage.getItem(CART_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        localStorage.removeItem(CART_KEY);
        return [];
    }
}

function saveLocalCart(items: LocalCartItem[]): void {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addToLocalCart(item: LocalCartItem): LocalCartItem[] {
    const cart = getLocalCart();
    const existing = cart.find(
        (i) => i.product_id === item.product_id && i.size_id === item.size_id
    );
    if (existing) {
        existing.quantity += item.quantity;
    } else {
        cart.push(item);
    }
    saveLocalCart(cart);
    return cart;
}

export function removeFromLocalCart(
    productId: number,
    sizeId: number | null
): LocalCartItem[] {
    const cart = getLocalCart().filter(
        (i) => !(i.product_id === productId && i.size_id === sizeId)
    );
    saveLocalCart(cart);
    return cart;
}

export function updateLocalCartQuantity(
    productId: number,
    sizeId: number | null,
    quantity: number
): LocalCartItem[] {
    const cart = getLocalCart();
    const item = cart.find(
        (i) => i.product_id === productId && i.size_id === sizeId
    );
    if (item) {
        item.quantity = Math.max(1, quantity);
    }
    saveLocalCart(cart);
    return cart;
}

export function clearLocalCart(): void {
    localStorage.removeItem(CART_KEY);
}

export function getCartCount(): number {
    return getLocalCart().reduce((sum, item) => sum + item.quantity, 0);
}

export async function previewCart(
    items: { product_id: number; size_id: number | null; quantity: number }[]
): Promise<CartPreviewResponse> {
    const data = await apiFetch<unknown>("/v1/cart/preview", {
        method: "POST",
        body: JSON.stringify({items}),
    });
    return CartPreviewResponseSchema.parse(data);
}
