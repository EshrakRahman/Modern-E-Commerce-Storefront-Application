import { SearchX } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import type { Product } from "@/schemas/productSchema";

type Props = {
  products: Product[];
  isLoading: boolean;
};

export default function ProductGrid({ products, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 animate-pulse">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="w-full aspect-square bg-gray-100 rounded-2xl" />
            <div className="h-4 bg-gray-100 rounded w-3/4" />
            <div className="h-4 bg-gray-100 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <SearchX className="mx-auto h-16 w-16 text-gray-300" />
        <h2 className="mt-4 text-xl font-semibold">No products found</h2>
        <p className="mt-2 text-gray-500">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            slug={product.slug}
            title={product.name}
            price={product.price}
            sale_price={product.sale_price}
            has_discount={product.has_discount}
            compare_price={product.compare_price}
            ratings={4.5}
            prdImg={product.image ?? undefined}
            sizes={product.sizes}
          />
      ))}
    </div>
  );
}
