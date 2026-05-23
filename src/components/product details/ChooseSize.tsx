import { useState } from "react";
import type { Size } from "@/schemas/productSchema.ts";

type Props = { sizes?: Size[]; onSizeChange?: (sizeId: number | null) => void };

export default function ChooseSize({ sizes = [], onSizeChange }: Props) {
    const [selectedSize, setSelectedSize] = useState<number | null>(null);

    if (sizes.length === 0) return null;

    const handleSelect = (sizeId: number) => {
        setSelectedSize(sizeId);
        onSizeChange?.(sizeId);
    };

    return (
        <section className="choose-size flex flex-col gap-3">
            <p className="font-semibold text-sm uppercase tracking-wider text-gray-500">Select Size</p>
            <div className="flex gap-2.5 flex-wrap">
                {sizes.map((size) => (
                    <button
                        key={size.id}
                        onClick={() => handleSelect(size.id)}
                        className={`px-4 py-2.5 text-sm font-medium rounded-lg border transition-all duration-200 cursor-pointer ${
                            selectedSize === size.id
                                ? "bg-black text-white border-black shadow-sm"
                                : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:text-black"
                        }`}
                    >
                        {size.name}
                    </button>
                ))}
            </div>
        </section>
    );
}
