import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "@/api/wishlist.ts";
import type { Product } from "@/schemas/productSchema.ts";
import {toast} from "sonner";

type WishlistContextType = {
  items: Product[];
  isLoading: boolean;
  add: (productId: number) => Promise<void>;
  remove: (productId: number) => Promise<void>;
  isWishlisted: (productId: number) => boolean;
};

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setItems([]);
      return;
    }
    setIsLoading(true);
    try {
      const data = await getWishlist();
      setItems(data);
    } catch {
      setItems([]);
      toast.error('Failed to fetch wishlist');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const add = useCallback(async (productId: number) => {
    await addToWishlist(productId);
    await fetchWishlist();
    toast('Item added to wishlist!');
  }, [fetchWishlist]);

  const remove = useCallback(async (productId: number) => {
    await removeFromWishlist(productId);
    await fetchWishlist();
    toast('Item removed from wishlist!');
  }, [fetchWishlist]);

  const isWishlisted = useCallback(
    (productId: number): boolean => {
      return items.some((item) => item.id === productId);
    },
    [items]
  );

  return (
    <WishlistContext.Provider
      value={{ items, isLoading, add, remove, isWishlisted }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextType {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return ctx;
}
