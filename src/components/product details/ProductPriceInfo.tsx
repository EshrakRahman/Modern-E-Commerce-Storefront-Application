import type { Product } from "@/schemas/productSchema.ts";
import {Rating} from "@/components/reui/rating.tsx";
import {Badge} from "@/components/ui/badge.tsx";

type Props = { product: Product };

export default function ProductPriceInfo({ product }: Props) {
    const hasSale = product.has_discount || (product.compare_price != null && product.compare_price > product.price);
    const currentPrice = product.has_discount ? (product.sale_price ?? product.price) : product.price;
    const originalPrice = product.has_discount
        ? product.price
        : (product.compare_price && product.compare_price > product.price ? product.compare_price : null);
    const discountPercent = hasSale && originalPrice != null && originalPrice > 0
        ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
        : null;

    return (
        <section className="product-price-info flex flex-col gap-3 md:w-[80%]">
            <h1 className="font-bold text-black text-2xl leading-10 tracking-wider lg:text-4xl">{product.name}</h1>
            <Rating rating={5} />
            <div className="flex items-center gap-2 flex-wrap">
                <p className="font-bold text-black text-lg">${currentPrice}</p>
                {originalPrice && (
                    <p className="font-bold text-black/40 line-through text-lg">${originalPrice}</p>
                )}
                {discountPercent && (
                    <Badge variant="destructive">-{discountPercent}%</Badge>
                )}
            </div>
            <p className="text-sm text-black/60 font-normal leading-5">{product.description}</p>
        </section>
    )
}
