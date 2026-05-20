import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import Container from "@/components/layout/Container.tsx";
import { Button } from "@/components/ui/button.tsx";
import { getOrders } from "@/api/orders.ts";
import { useAuth } from "@/context/AuthContext.tsx";

export default function Orders() {
  const { user } = useAuth();
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
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
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

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {order.items.slice(0, 3).map((item, i) => (
                        <span key={i} className="text-xs text-gray-400">
                          {item.product_name}
                          {item.size_name ? ` (${item.size_name})` : ""}
                          {i < Math.min(order.items.length, 3) - 1 ? ", " : ""}
                        </span>
                      ))}
                      {order.items.length > 3 && (
                        <span className="text-xs text-gray-400">
                          +{order.items.length - 3} more
                        </span>
                      )}
                    </div>
                    {order.notes && (
                      <p className="text-xs text-gray-400 mt-1">Note: {order.notes}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">${order.total.toFixed(2)}</p>
                    {order.shipping_cost != null && order.shipping_cost > 0 && (
                      <p className="text-xs text-gray-400">
                        Shipping: ${order.shipping_cost.toFixed(2)}
                      </p>
                    )}
                    {order.discount != null && order.discount > 0 && (
                      <p className="text-xs text-green-600">
                        Discount: -${order.discount.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>

                {order.shipping_address && (
                  <div className="mt-3 pt-3 border-t border-gray-50">
                    <p className="text-xs text-gray-400">
                      Ship to: {order.shipping_address.name}, {order.shipping_address.city},{" "}
                      {order.shipping_address.state}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
