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
import type { CartPreviewResponse, CouponResponse } from "@/schemas/productSchema.ts";
import { applyCoupon } from "@/api/coupons.ts";
import { toast } from "sonner";

type CartContextType = {
  items: LocalCartItem[];
  count: number;
  isPreviewing: boolean;
  preview: CartPreviewResponse | null;
  activeCoupon: CouponResponse | null;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  applyCouponAction: (code: string) => Promise<void>;
  removeCouponAction: () => void;
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
  const [activeCoupon, setActiveCoupon] = useState<CouponResponse | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

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

  const subtotal = preview
    ? preview.subtotal
    : items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const shipping = subtotal > 500 ? 0 : 15;

  let discount = 0;
  if (activeCoupon) {
    if (activeCoupon.type === "percentage") {
      discount = (subtotal * activeCoupon.value) / 100;
    } else {
      discount = Math.min(activeCoupon.value, subtotal);
    }
  }

  const total = Math.max(0, subtotal + shipping - discount);

  // Monitor subtotal to see if the coupon requirements are still met
  useEffect(() => {
    if (
      activeCoupon &&
      activeCoupon.min_order_amount &&
      subtotal < activeCoupon.min_order_amount
    ) {
      setActiveCoupon(null);
      toast.error(
        `Coupon "${activeCoupon.code}" removed: Minimum purchase of $${activeCoupon.min_order_amount.toFixed(
          2
        )} is required.`
      );
    }
  }, [subtotal, activeCoupon]);

  const applyCouponAction = useCallback(async (code: string) => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      toast.error("Please log in to apply a coupon.");
      return;
    }
    try {
      const result = await applyCoupon(code, subtotal);
      setActiveCoupon(result);
      toast.success(`Coupon "${code}" applied successfully!`);
    } catch (error: any) {
      toast.error(error.message || "Failed to apply coupon.");
      throw error;
    }
  }, [subtotal]);

  const removeCouponAction = useCallback(() => {
    setActiveCoupon(null);
    toast.success("Coupon removed.");
  }, []);

  const addItem = useCallback((item: LocalCartItem) => {
    const updated = addToLocalCart(item);
    setItems([...updated]);
    setIsCartDrawerOpen(true);
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
    setActiveCoupon(null);
    toast('Cart cleared!');
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        count: getCartCount(),
        isPreviewing,
        preview,
        activeCoupon,
        subtotal,
        shipping,
        discount,
        total,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        applyCouponAction,
        removeCouponAction,
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
