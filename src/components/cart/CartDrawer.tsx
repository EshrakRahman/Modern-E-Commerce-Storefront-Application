import { useState, useEffect } from "react";
import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext.tsx";
import { useAuth } from "@/context/AuthContext.tsx";
import { useNavigate, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button.tsx";
import ProductImg from "@/assets/product_one.png";

export default function CartDrawer() {
  const {
    items,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    removeItem,
    updateQuantity,
    subtotal,
    shipping,
    discount,
    total,
    activeCoupon,
    applyCouponAction,
    removeCouponAction,
  } = useCart();
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState("");
  const [applying, setApplying] = useState(false);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isCartDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartDrawerOpen]);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setApplying(true);
    try {
      await applyCouponAction(couponCode.trim());
      setCouponCode("");
    } catch {
      // Error message is already handled inside context toast
    } finally {
      setApplying(false);
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartDrawerOpen(false);
    navigate({ to: "/checkout" });
  };

  if (!isCartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      {/* Drawer slide-over container */}
      <div className="relative w-full sm:w-[460px] h-full bg-white shadow-2xl flex flex-col z-50 animate-slide-in-right">
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-5 w-5 text-black" />
            <h2 className="text-lg font-bold text-black">Your Cart ({items.length})</h2>
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-1.5 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Items list */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-hide">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20">
              <ShoppingBag className="h-16 w-16 text-gray-200 mb-4" />
              <h3 className="text-base font-semibold text-gray-800">Your cart is empty</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-[240px]">
                Add some awesome products to get started!
              </p>
              <Button
                onClick={() => setIsCartDrawerOpen(false)}
                className="mt-6 rounded-full px-6 text-sm"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product_id + (item.size_id ? "-" + item.size_id : "")}
                className="flex gap-4 p-3 bg-gray-50/50 rounded-2xl border border-gray-100/80 shadow-sm"
              >
                {/* Product image */}
                <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-200/40">
                  <img
                    src={item.image}
                    alt={item.product_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = ProductImg;
                    }}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-semibold text-sm text-gray-900 truncate">
                        {item.product_name}
                      </h4>
                      <button
                        onClick={() => removeItem(item.product_id, item.size_id)}
                        className="text-gray-400 hover:text-red-500 p-0.5 rounded transition-colors shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.size_name ? `Size: ${item.size_name}` : "One Size"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-sm text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    
                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1">
                      <button
                        onClick={() =>
                          updateQuantity(item.product_id, item.size_id, item.quantity - 1)
                        }
                        className="w-5 h-5 rounded flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-xs font-semibold px-1 min-w-[16px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product_id, item.size_id, item.quantity + 1)
                        }
                        className="w-5 h-5 rounded flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer footer summary */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-6 bg-white space-y-4">
            {/* Promo Code box inside Drawer */}
            <div className="pb-2">
              {activeCoupon ? (
                <div className="flex items-center justify-between p-3 bg-emerald-50/80 border border-emerald-100 rounded-xl">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-emerald-800 text-xs tracking-wider uppercase">
                        {activeCoupon.code}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                        {activeCoupon.type === "percentage"
                          ? `${activeCoupon.value}% OFF`
                          : `$${activeCoupon.value} OFF`}
                      </span>
                    </div>
                    {activeCoupon.description && (
                      <p className="text-[10px] text-emerald-700/80 mt-0.5">
                        {activeCoupon.description}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={removeCouponAction}
                    className="text-emerald-700 hover:text-emerald-900 p-1 hover:bg-emerald-100 rounded-full transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : user ? (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all bg-gray-50/50 uppercase"
                    disabled={applying}
                  />
                  <Button
                    type="submit"
                    disabled={applying || !couponCode.trim()}
                    className="px-3 py-1.5 text-xs rounded-xl h-auto"
                  >
                    {applying ? "..." : "Apply"}
                  </Button>
                </form>
              ) : (
                <div className="p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-center">
                  <p className="text-[11px] text-gray-500">
                    <Link
                      to="/login"
                      onClick={() => setIsCartDrawerOpen(false)}
                      className="font-semibold text-black underline hover:text-gray-700"
                    >
                      Log in
                    </Link>{" "}
                    to apply promo codes.
                  </p>
                </div>
              )}
            </div>

            {/* Calculations */}
            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-emerald-600">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-gray-900 border-t pt-2 mt-1">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 pt-2">
              <Button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 rounded-full text-sm font-semibold shadow-sm hover:cursor-pointer"
              >
                Proceed to Checkout
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsCartDrawerOpen(false)}
                className="w-full py-3 rounded-full text-xs font-medium text-gray-500 hover:text-black hover:cursor-pointer"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
