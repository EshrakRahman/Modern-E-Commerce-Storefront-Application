import { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button.tsx";
import { X } from "lucide-react";

type OrderData = {
  id: number;
  order_number: string;
  total: number;
  payment_intent_client_secret: string | null;
};

type PaymentFormProps = {
  order: OrderData;
  onSuccess: () => void;
  onRetryPayment: () => Promise<string | null>;
  onClose: () => void;
};

const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#1a1a1a",
      "::placeholder": { color: "#9ca3af" },
      fontFamily: "inherit",
    },
    invalid: { color: "#ef4444" },
  },
};

function InnerForm({
  order,
  onSuccess,
  onRetryPayment,
  onClose,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState(
    order.payment_intent_client_secret
  );

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handlePay = async () => {
    if (!stripe || !elements || !clientSecret) return;
    setError(null);
    setLoading(true);

    try {
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: { card: elements.getElement(CardElement)! },
        });

      if (stripeError) {
        setError(stripeError.message ?? "Payment failed");
        return;
      }

      if (paymentIntent.status === "succeeded") {
        onSuccess();
      } else {
        setError(`Payment status: ${paymentIntent.status}`);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async () => {
    setError(null);
    setLoading(true);
    try {
      const newSecret = await onRetryPayment();
      if (newSecret) {
        setClientSecret(newSecret);
      }
    } catch {
      setError("Failed to reset payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Complete Payment</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Order</span>
            <span className="font-medium">#{order.order_number}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t pt-2">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Card Details
          </label>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <CardElement options={cardElementOptions} />
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <Button
          onClick={handlePay}
          disabled={!stripe || loading}
          className="w-full py-3 rounded-full text-lg mb-2 hover:cursor-pointer"
        >
          {loading ? "Processing..." : `Pay $${order.total.toFixed(2)}`}
        </Button>

        {error && (
          <Button
            onClick={handleRetry}
            variant="outline"
            disabled={loading}
            className="w-full py-3 rounded-full hover:cursor-pointer"
          >
            Retry Payment
          </Button>
        )}

        <p className="text-xs text-gray-400 text-center mt-4">
          Your payment is secured via Stripe
        </p>
      </div>
    </div>
  );
}

export default function PaymentForm(props: PaymentFormProps) {
  const [stripePromise] = useState(() => {
    const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!key) return null;
    return loadStripe(key);
  });

  if (!stripePromise) return null;

  return (
    <Elements stripe={stripePromise}>
      <InnerForm {...props} />
    </Elements>
  );
}
