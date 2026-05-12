import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";

interface QuantitySelectorProps {
  productId: string;
  onChange?: (quantity: number) => void;
  onAddToCart?: (quantity: number) => void;
}

export default function QuantitySelector({ onChange, onAddToCart }: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(1);

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

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <button
          onClick={handleDecrease}
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
          aria-label="Decrease quantity"
        >
          -
        </button>
        <div className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-900 font-medium">
          {quantity}
        </div>
        <button
          onClick={handleIncrease}
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <Button
        onClick={() => onAddToCart?.(quantity)}
        className="h-10 px-6 w-2/3 rounded-full hover:bg-white hover:text-black transition-all duration-300 hover:border-black/90 hover:cursor-pointer"
      >
        Add to Cart
      </Button>
    </div>
  );
}
