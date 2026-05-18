import { useState } from "react";
import type { Product } from "@/schemas/productSchema.ts";
import ProductShowcaseCard from "@/components/product details/ProductShowcaseCard.tsx";
import ProductPriceInfo from "@/components/product details/ProductPriceInfo.tsx";
import ChooseSize from "@/components/product details/ChooseSize.tsx";
import Container from "@/components/layout/Container.tsx";
import QuantitySelector from "@/components/product details/QuantitySelector.tsx";
import { useCart } from "@/context/CartContext.tsx";

type Props = { product: Product };

export default function ProductShowcase({ product }: Props) {
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
      <Container className="flex flex-col md:flex-row gap-4 overflow-hidden">
        <div className="w-full md:w-1/2">
          <ProductShowcaseCard image={product.image} />
        </div>
        <div className="w-full md:w-1/2">
          <div className="py-6 border-b border-black/60">
            <ProductPriceInfo product={product} />
          </div>
          <div className="pb-6 border-b border-black/60">
            <ChooseSize sizes={product.sizes} onSizeChange={setSelectedSize} />
          </div>
          <div className="py-6">
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
