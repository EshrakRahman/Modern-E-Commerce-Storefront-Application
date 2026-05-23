import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import Container from "@/components/layout/Container.tsx";
import { Button } from "@/components/ui/button.tsx";
import { getOrders } from "@/api/orders.ts";
import { useAuth } from "@/context/AuthContext.tsx";
import WriteReviewModal from "@/components/reviews/WriteReviewModal.tsx";

export default function Orders() {
  const { user } = useAuth();
  const [reviewProduct, setReviewProduct] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    enabled: !!user,
  });

  if (!user) {
    return (
      <Container>
        <div className="py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">My Orders</h1>
          <p className="text-gray-500 mb-6">Please log in to view your orders.</p>
          <Link to="/login">
            <Button className="rounded-full px-8">Log In</Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-6 bg-white rounded-xl border border-gray-100 animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-1/4 mb-3" />
                <div className="h-3 bg-gray-100 rounded w-1/3 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Failed to load orders. Please try again.</p>
          </div>
        ) : !orders || orders.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">You haven&apos;t placed any orders yet.</p>
            <Link to="/">
              <Button className="rounded-full px-8">Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-gray-200 transition-colors"
              >
                {/* Order Header Info */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{order.order_number}</h3>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      order.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.status === "processing"
                        ? "bg-blue-100 text-blue-700"
                        : order.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : order.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {order.status}
                    </span>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      order.payment_status === "paid"
                        ? "bg-green-100 text-green-700"
                        : order.payment_status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      Payment: {order.payment_status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>

                {/* List of Products in the Order */}
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-50/50 p-3 rounded-lg border border-gray-50">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-black truncate">{item.product_name}</p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity} {item.size_name ? `| Size: ${item.size_name}` : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-sm text-black">${item.unit_price.toFixed(2)}</span>
                        {/* Only allow reviews for paid or completed orders */}
                        {(order.payment_status === "paid" || order.status === "completed") && (
                          <Button
                            size="xs"
                            onClick={() =>
                              setReviewProduct({
                                id: item.product_id,
                                name: item.product_name,
                              })
                            }
                            className="rounded-full bg-black text-white hover:bg-black/80 hover:cursor-pointer text-[11px] h-7 px-3.5"
                          >
                            Review
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer / Total cost address summary */}
                <div className="flex justify-between items-end mt-4 pt-3 border-t border-gray-100">
                  <div className="min-w-0">
                    {order.shipping_address && (
                      <p className="text-xs text-gray-400 truncate">
                        Ship to: {order.shipping_address.name}, {order.shipping_address.city},{" "}
                        {order.shipping_address.state}
                      </p>
                    )}
                    {order.notes && (
                      <p className="text-xs text-gray-400 truncate mt-0.5">Note: {order.notes}</p>
                    )}
                    {order.coupon_code && (
                      <p className="text-xs text-emerald-600 font-semibold mt-1">
                        Promo Code: <span className="uppercase">{order.coupon_code}</span> (-${(order.discount ?? 0).toFixed(2)})
                      </p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    {order.discount !== null && order.discount > 0 && (
                      <p className="text-xs text-gray-400">
                        Subtotal: ${(order.subtotal ?? 0).toFixed(2)}
                      </p>
                    )}
                    <p className="font-bold text-lg text-black">Total: ${order.total.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Dialog Modal */}
      {reviewProduct && (
        <WriteReviewModal
          productId={reviewProduct.id}
          productName={reviewProduct.name}
          onClose={() => setReviewProduct(null)}
        />
      )}
    </Container>
  );
}
