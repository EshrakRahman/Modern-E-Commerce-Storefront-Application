import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import {
  getLocalCart,
  addToLocalCart,
  removeFromLocalCart,
  updateLocalCartQuantity,
  clearLocalCart,
  getCartCount,
  previewCart,
} from "@/api/cart.ts";
import type { LocalCartItem } from "@/api/cart.ts";
import type { CartPreviewResponse } from "@/schemas/productSchema.ts";
import {toast} from "sonner";

type CartContextType = {
  items: LocalCartItem[];
  count: number;
  isPreviewing: boolean;
  preview: CartPreviewResponse | null;
  addItem: (item: LocalCartItem) => void;
  removeItem: (productId: number, sizeId: number | null) => void;
  updateQuantity: (productId: number, sizeId: number | null, qty: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<LocalCartItem[]>(() => getLocalCart());
  const [preview, setPreview] = useState<CartPreviewResponse | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);

  const triggerPreview = useCallback(async (currentItems: LocalCartItem[]) => {
    const token = localStorage.getItem("auth_token");
    if (!token || currentItems.length === 0) {
      setPreview(null);
      return;
    }
    setIsPreviewing(true);
    try {
      const result = await previewCart(
        currentItems.map((i) => ({
          product_id: i.product_id,
          size_id: i.size_id,
          quantity: i.quantity,
        }))
      );
      setPreview(result);
    } catch {
      setPreview(null);
    } finally {
      setIsPreviewing(false);
    }
  }, []);

  useEffect(() => {

    triggerPreview(items);

  }, [items, triggerPreview]);

  const addItem = useCallback((item: LocalCartItem) => {
    const updated = addToLocalCart(item);
    setItems([...updated]);
    toast('Item added to cart!');
  }, []);

  const removeItem = useCallback(
    (productId: number, sizeId: number | null) => {
      const updated = removeFromLocalCart(productId, sizeId);
      setItems([...updated]);
      toast('Item removed from cart!');
    },
    []
  );

  const updateQuantity = useCallback(
    (productId: number, sizeId: number | null, qty: number) => {
      if (qty < 1) return;
      const updated = updateLocalCartQuantity(productId, sizeId, qty);
      setItems([...updated]);
      toast('Quantity updated!');
    },
    []
  );

  const clearCart = useCallback(() => {
    clearLocalCart();
    setItems([]);
    setPreview(null);
    toast('Cart cleared!');
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        count: getCartCount(),
        isPreviewing,
        preview,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
