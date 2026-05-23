import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Check } from "lucide-react";

interface QuantitySelectorProps {
  productId: string;
  onChange?: (quantity: number) => void;
  onAddToCart?: (quantity: number) => void;
}

export default function QuantitySelector({ onChange, onAddToCart }: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<"idle" | "adding" | "added">("idle");

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onChange?.(newQuantity);
    }
  };

  const handleIncrease = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onChange?.(newQuantity);
  };

  const handleAddClick = async () => {
    if (status !== "idle") return;
    setStatus("adding");
    
    // Simulate loading delay for tactile feedback
    await new Promise((resolve) => setTimeout(resolve, 600));
    onAddToCart?.(quantity);
    setStatus("added");

    // Reset back to idle state after 1.5 seconds
    setTimeout(() => {
      setStatus("idle");
    }, 1500);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <button
          onClick={handleDecrease}
          disabled={status !== "idle"}
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          aria-label="Decrease quantity"
        >
          -
        </button>
        <div className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-900 font-medium">
          {quantity}
        </div>
        <button
          onClick={handleIncrease}
          disabled={status !== "idle"}
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <Button
        onClick={handleAddClick}
        disabled={status !== "idle"}
        className={`h-10 px-6 w-2/3 rounded-full transition-all duration-300 hover:cursor-pointer flex items-center justify-center gap-2 ${
          status === "added"
            ? "bg-emerald-600 hover:bg-emerald-600 text-white border-emerald-600"
            : "hover:bg-white hover:text-black hover:border-black/90"
        }`}
      >
        {status === "adding" && (
          <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {status === "added" && <Check className="h-4 w-4 shrink-0 animate-bounce" />}
        {status === "idle" && "Add to Cart"}
        {status === "adding" && "Adding..."}
        {status === "added" && "Added!"}
      </Button>
    </div>
  );
}
