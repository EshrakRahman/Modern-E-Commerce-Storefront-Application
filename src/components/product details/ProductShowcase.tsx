import { useState } from "react";
import type { Product } from "@/schemas/productSchema.ts";
import ProductShowcaseCard from "@/components/product details/ProductShowcaseCard.tsx";
import ProductPriceInfo from "@/components/product details/ProductPriceInfo.tsx";
import ChooseSize from "@/components/product details/ChooseSize.tsx";
import Container from "@/components/layout/Container.tsx";
import QuantitySelector from "@/components/product details/QuantitySelector.tsx";
import { useCart } from "@/context/CartContext.tsx";
type Props = { 
  product: Product;
  averageRating: number;
  totalReviews: number;
};

export default function ProductShowcase({ product, averageRating, totalReviews }: Props) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const handleAddToCart = (quantity: number) => {
    addItem({
      product_id: product.id,
      product_name: product.name,
      price: product.has_discount ? (product.sale_price ?? product.price) : product.price,
      image: product.image ?? "",
      quantity,
      size_id: selectedSize,
      size_name: product.sizes.find((s) => s.id === selectedSize)?.name ?? null,
    });
  };

  return (
    <>
      <Container className="flex flex-col md:flex-row gap-8 lg:gap-16 py-10 md:py-16 items-start overflow-hidden">
        <div className="w-full md:w-1/2">
          <ProductShowcaseCard image={product.image} />
        </div>
        <div className="w-full md:w-1/2 space-y-6">
          <div className="pb-6 border-b border-gray-100">
            <ProductPriceInfo 
              product={product} 
              averageRating={averageRating}
              totalReviews={totalReviews}
            />
          </div>
          <div className="pb-6 border-b border-gray-100">
            <ChooseSize sizes={product.sizes} onSizeChange={setSelectedSize} />
          </div>
          <div className="pt-2">
            <QuantitySelector
              productId={String(product.id)}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>
      </Container>
    </>
  )
}
