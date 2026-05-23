import type { Product } from "@/schemas/productSchema.ts";
import {Rating} from "@/components/reui/rating.tsx";
import {Badge} from "@/components/ui/badge.tsx";
type Props = { 
  product: Product;
  averageRating: number;
  totalReviews: number;
};

export default function ProductPriceInfo({ product, averageRating, totalReviews }: Props) {
    const hasSale = product.has_discount || (product.compare_price != null && product.compare_price > product.price);
    const currentPrice = product.has_discount ? (product.sale_price ?? product.price) : product.price;
    const originalPrice = product.has_discount
        ? product.price
        : (product.compare_price && product.compare_price > product.price ? product.compare_price : null);
    const discountPercent = hasSale && originalPrice != null && originalPrice > 0
        ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
        : null;

    return (
        <section className="product-price-info flex flex-col gap-4">
            <h1 className="font-extrabold text-black text-3xl md:text-4xl tracking-tight leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-2">
                <Rating rating={averageRating} />
                <span className="font-semibold text-black text-sm">{averageRating.toFixed(1)}</span>
                <span className="text-gray-400 text-sm">
                  ({totalReviews} review{totalReviews !== 1 ? "s" : ""})
                </span>
            </div>

            <div className="flex items-center gap-3 flex-wrap mt-1">
                <p className="font-extrabold text-black text-2xl md:text-3xl">${currentPrice}</p>
                {originalPrice && (
                    <p className="font-medium text-gray-400 line-through text-lg md:text-xl">${originalPrice}</p>
                )}
                {discountPercent && (
                    <Badge variant="destructive" className="bg-red-50 text-red-600 border border-red-100 font-semibold px-2.5 py-0.5 rounded-full text-xs">
                      -{discountPercent}%
                    </Badge>
                )}
            </div>

            <p className="text-sm md:text-base text-gray-500 font-normal leading-relaxed mt-2">{product.description}</p>
        </section>
    );
}
