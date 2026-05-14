import { useQuery } from "@tanstack/react-query";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { getProducts } from "@/api/products";
import Container from "@/components/layout/Container";
import FilterSidebar from "@/components/products/FilterSidebar";
import ProductGrid from "@/components/products/ProductGrid";
import PaginationBar from "@/components/products/PaginationBar";
import { useProductFilters } from "@/hooks/useProductFilters";

export default function ShopPage() {
  const { page: pageStr, category, minPrice: minPriceStr, maxPrice: maxPriceStr, size } = useSearch({ from: "/shop" });
  const navigate = useNavigate({ from: "/shop" });

  const filters = {
    category,
    minPrice: minPriceStr ? Number(minPriceStr) : undefined,
    maxPrice: maxPriceStr ? Number(maxPriceStr) : undefined,
    size,
    page: Number(pageStr),
  };

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", "shop"],
    queryFn: () => getProducts(),
  });

  const { items, totalPages, totalCount, categories } = useProductFilters(products, filters);

  const toggleCategory = (cat: string) => {
    const nextCategory = category === cat.toLowerCase() ? undefined : cat.toLowerCase();
    navigate({ search: { page: "1", category: nextCategory, minPrice: minPriceStr, maxPrice: maxPriceStr, size } });
  };

  const togglePrice = (min: string, max: string | undefined) => {
    const isActive = minPriceStr === min && maxPriceStr === (max ?? undefined);
    const searchParams = isActive
      ? { page: "1", category, minPrice: undefined, maxPrice: undefined, size }
      : { page: "1", category, minPrice: min, maxPrice: max ?? undefined, size };
    navigate({ search: searchParams });
  };

  const toggleSize = (s: string) => {
    const nextSize = size === s ? undefined : s;
    navigate({ search: { page: "1", category, minPrice: minPriceStr, maxPrice: maxPriceStr, size: nextSize } });
  };

  const goToPage = (p: number) => {
    navigate({ search: { page: String(p), category, minPrice: minPriceStr, maxPrice: maxPriceStr, size } });
  };

  return (
    <Container>
      <div className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Shop</h1>
          <p className="text-gray-500 text-sm mt-1">
            {isLoading ? "Loading..." : `Showing ${items.length} of ${totalCount} product${totalCount !== 1 ? "s" : ""}`}
          </p>
        </div>

        <div className="flex gap-8">
          <FilterSidebar
            categories={categories}
            activeCategory={category}
            activeMinPrice={minPriceStr}
            activeMaxPrice={maxPriceStr}
            activeSize={size}
            onToggleCategory={toggleCategory}
            onTogglePrice={togglePrice}
            onToggleSize={toggleSize}
          />

          <div className="flex-1">
            <ProductGrid products={items} isLoading={isLoading} />
            <PaginationBar currentPage={filters.page} totalPages={totalPages} onPageChange={goToPage} />
          </div>
        </div>
      </div>
    </Container>
  );
}
