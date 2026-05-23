import { useState, useEffect, useRef } from "react";
import ProductCard from "@/components/products/ProductCard.tsx";
import ProductCardSkeleton from "@/components/skeleton/ProductCardSkeleton.tsx";
import { getProducts } from "@/api/products.ts";
import { getCategories } from "@/api/categories.ts";
import type { Product } from "@/schemas/productSchema.ts";

type SimilarProductsProps = {
  currentProduct: Product;
};

export default function SimilarProducts({ currentProduct }: SimilarProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("You Might Also Like");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchSimilar() {
      try {
        setLoading(true);

        // Fetch categories first to match slug
        const categories = await getCategories();
        if (!active) return;

        const matchedCategory = categories.find(
          (c) => c.name.toLowerCase() === currentProduct.category?.toLowerCase()
        );

        let similarResults: Product[] = [];
        
        if (matchedCategory) {
          const results = await getProducts({ category: matchedCategory.slug, limit: 12 });
          // Filter out the active product
          similarResults = results.filter((p) => p.id !== currentProduct.id);
        }

        // Fallback to featured products if we have too few category matches
        if (similarResults.length < 4) {
          const featured = await getProducts({ featured: true, limit: 8 });
          similarResults = featured.filter((p) => p.id !== currentProduct.id);
          setTitle("Recommended for You");
        } else {
          setTitle("You Might Also Like");
        }

        if (active) {
          setProducts(similarResults.slice(0, 8));
        }
      } catch (err) {
        // Fallback to featured on error
        try {
          const featured = await getProducts({ featured: true, limit: 8 });
          if (active) {
            setProducts(featured.filter((p) => p.id !== currentProduct.id).slice(0, 8));
            setTitle("Recommended for You");
          }
        } catch {
          if (active) setProducts([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchSimilar();

    return () => {
      active = false;
    };
  }, [currentProduct]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  if (!loading && products.length === 0) return null;

  return (
    <section className="similar-products py-12 border-t border-gray-100 bg-gray-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center mb-8">
          <h3 className="font-bold text-2xl lg:text-4xl text-black tracking-tight">{title}</h3>
        </div>

        <div className="relative w-full">
          {/* Scroll Left Button */}
          <button
            aria-label="Scroll left"
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-md border border-gray-100 hover:bg-white hover:scale-105 active:scale-95 transition-all hover:cursor-pointer"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Slider list */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide w-full py-2 px-1"
          >
            {loading ? (
              // Shimmer Skeletons
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="min-w-48 shrink-0">
                  <ProductCardSkeleton />
                </div>
              ))
            ) : (
              products.map((product) => (
                <div key={product.id} className="min-w-48 shrink-0">
                  <ProductCard
                    id={product.id}
                    slug={product.slug}
                    prdImg={product.image ?? undefined}
                    title={product.name}
                    ratings={4.5}
                    price={product.price}
                    sale_price={product.sale_price}
                    has_discount={product.has_discount}
                    compare_price={product.compare_price}
                    sizes={product.sizes}
                  />
                </div>
              ))
            )}
          </div>

          {/* Scroll Right Button */}
          <button
            aria-label="Scroll right"
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-md border border-gray-100 hover:bg-white hover:scale-105 active:scale-95 transition-all hover:cursor-pointer"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
