import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import Container from "@/components/layout/Container.tsx";
import {Button} from "@/components/ui/button.tsx";
import { Link } from "@tanstack/react-router";
import { useCart } from "@/context/CartContext.tsx";
import { useAuth } from "@/context/AuthContext.tsx";
import ProductImg from "@/assets/product_one.png";

export default function Cart() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    shipping,
    discount,
    total,
    activeCoupon,
    applyCouponAction,
    removeCouponAction
  } = useCart();
  const { user } = useAuth();
  const [couponCode, setCouponCode] = useState("");
  const [applying, setApplying] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setApplying(true);
    try {
      await applyCouponAction(couponCode.trim());
      setCouponCode("");
    } catch {
      // Error message is handled in context
    } finally {
      setApplying(false);
    }
  };

  return (
    <Container>
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="space-y-6">
              {items.length === 0 ? (
                <div className="text-center py-20">
                  <ShoppingBag className="mx-auto h-16 w-16 text-gray-300" />
                  <h2 className="mt-4 text-xl font-semibold">Your cart is empty</h2>
                  <p className="mt-2 text-gray-500">Looks like you haven't added anything yet.</p>
                  <Link to="/new-arrivals">
                    <Button className="mt-6 rounded-full">Browse New Arrivals</Button>
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.product_id + (item.size_id ? '-' + item.size_id : '')} className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-gray-100">
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
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{item.product_name}</h3>
                        <p className="text-sm text-gray-500">
                          {item.size_name ? `Size: ${item.size_name}` : "One Size"}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xl">${item.price}</span>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => updateQuantity(item.product_id, item.size_id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                          >
                            -
                          </button>
                          <span className="font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product_id, item.size_id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                          >
                            +
                          </button>
                          <button 
                            onClick={() => removeItem(item.product_id, item.size_id)}
                            className="ml-4 text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span className="font-medium">Discount ({activeCoupon?.code})</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-4 flex justify-between">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-lg">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Promo Code section */}
              <div className="border-t pt-4 mt-4 mb-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">Promo Code</h3>
                {activeCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-emerald-50/80 border border-emerald-100 rounded-xl">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-800 text-sm tracking-wider uppercase">
                          {activeCoupon.code}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                          {activeCoupon.type === "percentage" ? `${activeCoupon.value}% OFF` : `$${activeCoupon.value} OFF`}
                        </span>
                      </div>
                      {activeCoupon.description && (
                        <p className="text-xs text-emerald-700/80 mt-1">{activeCoupon.description}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={removeCouponAction}
                      className="text-emerald-700 hover:text-emerald-900 p-1 hover:bg-emerald-100 rounded-full transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : user ? (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all bg-gray-50/50 uppercase"
                      disabled={applying}
                    />
                    <Button
                      type="submit"
                      disabled={applying || !couponCode.trim()}
                      className="px-4 py-2 text-sm rounded-xl"
                    >
                      {applying ? "Applying..." : "Apply"}
                    </Button>
                  </form>
                ) : (
                  <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-center">
                    <p className="text-xs text-gray-500">
                      <Link to="/login" className="font-semibold text-black underline hover:text-gray-700">Log in</Link> to apply promo codes.
                    </p>
                  </div>
                )}
              </div>

              <Link to="/checkout">
                <Button className="w-full py-3 rounded-full text-lg">
                  Proceed to Checkout
                </Button>
              </Link>
              
              <p className="text-center text-sm text-gray-500 mt-4">
                Free shipping on orders over $500
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
