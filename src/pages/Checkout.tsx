import { useState, useEffect } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import Container from "@/components/layout/Container.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useCart } from "@/context/CartContext.tsx";
import { placeOrder, confirmPayment, retryPayment } from "@/api/orders.ts";
import { ApiError } from "@/api/client.ts";
import { toast } from "sonner";
import PaymentForm from "@/components/checkout/PaymentForm.tsx";
import ProductImg from "@/assets/product_one.png";

const SESSION_KEY = "pending_order";

type PendingOrder = {
  id: number;
  order_number: string;
  total: number;
  payment_intent_client_secret: string | null;
};

export default function Checkout() {
  const navigate = useNavigate();
  const {
    items,
    clearCart,
    subtotal,
    shipping,
    discount,
    total,
    activeCoupon
  } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<PendingOrder | null>(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (order) {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(order));
    } else {
      sessionStorage.removeItem(SESSION_KEY);
    }
  }, [order]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setError(null);
    setLoading(true);

    try {
      const result = await placeOrder({
        items: items.map((i) => ({
          product_id: i.product_id,
          size_id: i.size_id ?? undefined,
          quantity: i.quantity,
        })),
        payment_method: "stripe",
        shipping_address: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: "US",
        },
        notes: formData.notes || undefined,
        coupon_code: activeCoupon?.code || undefined,
      });

      setOrder({
        id: result.id,
        order_number: result.order_number,
        total: result.total,
        payment_intent_client_secret:
          result.payment_intent_client_secret ?? null,
      });
    } catch (err) {
      if (err instanceof ApiError) {
        const fieldErrors = err.errors
          ? Object.entries(err.errors)
              .map(([field, msgs]) => `${field}: ${msgs.join(", ")}`)
              .join("; ")
          : "";
        setError(fieldErrors ? `${err.message} — ${fieldErrors}` : err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async () => {
    const currentOrder = order!;

    try {
      const confirmation = await confirmPayment(currentOrder.id);

      if (confirmation.paid) {
        clearCart();
        setOrder(null);
        await navigate({
          to: "/order-success",
          search: { orderNumber: currentOrder.order_number },
        });
        toast.success("Payment successful!");
      } else if (confirmation.stripe_status === "processing") {
        await new Promise((r) => setTimeout(r, 2000));
        const retry = await confirmPayment(currentOrder.id);
        if (retry.paid) {
          clearCart();
          setOrder(null);
          await navigate({
            to: "/order-success",
            search: { orderNumber: currentOrder.order_number },
          });
          toast.success("Payment successful!");
        } else {
          setError("Payment is still processing. Please check your orders page.");
        }
      } else {
        setError(
          confirmation.stripe_status === "requires_payment_method"
            ? "Payment was declined. Please try a different card."
            : "Payment verification failed. Please try again."
        );
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Unable to verify payment. Please try again.");
      }
    }
  };

  const handleRetryPayment = async (): Promise<string | null> => {
    if (!order) return null;
    const result = await retryPayment(order.id);
    return result.payment_intent_client_secret;
  };

  const handleCloseModal = () => {
    setOrder(null);
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black/10";

  if (items.length === 0 && !order) {
    return (
      <Container>
        <div className="text-center py-20">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-300" />
          <h2 className="mt-4 text-xl font-semibold">Nothing to check out</h2>
          <p className="mt-2 text-gray-500">
            Your cart is empty. Add some items first.
          </p>
          <Link to="/new-arrivals">
            <Button className="mt-6 rounded-full">Browse New Arrivals</Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <form onSubmit={handlePlaceOrder} className="py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4">Contact Info</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className={inputClass}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      className={inputClass}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 000-0000"
                    className={inputClass}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Main St"
                    className={inputClass}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="New York"
                      className={inputClass}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="NY"
                      className={inputClass}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      placeholder="10001"
                      className={inputClass}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Order Notes</h2>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Leave at the door (optional)"
                className={`${inputClass} resize-none h-24`}
                disabled={loading}
              />
            </section>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {items.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Your cart is empty
                  </p>
                ) : (
                  items.map((item) => (
                    <div
                      key={
                        item.product_id +
                        (item.size_id ? "-" + item.size_id : "")
                      }
                      className="flex gap-3"
                    >
                      <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
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
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {item.product_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity}
                          {item.size_name
                            ? ` | Size: ${item.size_name}`
                            : ""}
                        </p>
                        <p className="font-semibold text-sm">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0
                      ? "Free"
                      : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-emerald-600">
                    <span>Discount ({activeCoupon?.code})</span>
                    <span className="font-medium">
                      -${discount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-3">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || items.length === 0}
                className="w-full py-3 rounded-full text-lg hover:cursor-pointer"
              >
                {loading ? "Placing Order..." : "Place Order"}
              </Button>
            </div>
          </div>
        </div>
      </form>

      {order && (
        <PaymentForm
          order={order}
          onSuccess={handlePaymentSuccess}
          onRetryPayment={handleRetryPayment}
          onClose={handleCloseModal}
        />
      )}
    </Container>
  );
}
