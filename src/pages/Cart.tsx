import { ShoppingBag } from "lucide-react";
import Container from "@/components/layout/Container.tsx";
import {Button} from "@/components/ui/button.tsx";
import { Link } from "@tanstack/react-router";
import { useCart } from "@/context/CartContext.tsx";

export default function Cart() {
  const { items, removeItem, updateQuantity, preview } = useCart();

  const subtotal = preview
    ? preview.subtotal
    : items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const shipping = subtotal > 500 ? 0 : 15;

  const total = preview ? preview.total : subtotal + shipping;

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
                      <img src={item.image} alt={item.product_name} className="w-full h-full object-cover" />
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
                <div className="border-t pt-4 flex justify-between">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-lg">${total.toFixed(2)}</span>
                </div>
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
