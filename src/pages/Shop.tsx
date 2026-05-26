import { useQuery } from "@tanstack/react-query";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { getProducts } from "@/api/products";
import { getCategories } from "@/api/categories";
import Container from "@/components/layout/Container";
import FilterSidebar from "@/components/products/FilterSidebar";
import ProductGrid from "@/components/products/ProductGrid";
import PaginationBar from "@/components/products/PaginationBar";
import PaginationLimitFallback from "@/components/products/PaginationLimitFallback";
import { parseNumericParam, cleanStringParam } from "@/lib/utils";

export default function ShopPage() {
  const { cursor: cursorRaw, category: categoryRaw, minPrice: minPriceRaw, maxPrice: maxPriceRaw, size: sizeRaw, page: pageRaw } = useSearch({ from: "/shop" });
  const navigate = useNavigate({ from: "/shop" });

  const category = cleanStringParam(categoryRaw);
  const cursor = cleanStringParam(cursorRaw);
  const minPriceStr = cleanStringParam(minPriceRaw);
  const maxPriceStr = cleanStringParam(maxPriceRaw);
  const size = cleanStringParam(sizeRaw);
  const page = parseNumericParam(pageRaw) || 1;

  const filters = {
    category,
    minPrice: parseNumericParam(minPriceStr),
    maxPrice: parseNumericParam(maxPriceStr),
    size,
    cursor,
  };

  const isUnfilteredAllProducts = !category && !minPriceStr && !maxPriceStr && !size;
  const isLimitReached = isUnfilteredAllProducts && page >= 3;

  const { data: paginatedData, isLoading: isProductsLoading, error: productsError } = useQuery({
    queryKey: ["products", "shop", filters],
    queryFn: () => getProducts({
      cursor: filters.cursor,
      per_page: 12,
      category: filters.category,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      size: filters.size,
    }),
    enabled: !isLimitReached,
  });

  const { data: categoriesData, isLoading: isCategoriesLoading, error: categoriesError } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const items = paginatedData?.data ?? [];
  const nextCursor = paginatedData?.meta?.next_cursor;
  const prevCursor = paginatedData?.meta?.prev_cursor;
  const hasPrev = !!prevCursor;
  const hasNext = !!nextCursor;
  const categories = categoriesData?.map((c) => ({ name: c.name, slug: c.slug })) ?? [];
  const isLoading = (isProductsLoading && !isLimitReached) || isCategoriesLoading;
  const error = productsError || categoriesError;

  const toggleCategory = (catSlug: string) => {
    const nextCategory = category === catSlug ? undefined : catSlug;
    navigate({ search: { cursor: undefined, page: undefined, category: nextCategory, minPrice: minPriceStr, maxPrice: maxPriceStr, size } });
  };

  const togglePrice = (min: string, max: string | undefined) => {
    const isActive = minPriceStr === min && maxPriceStr === (max ?? undefined);
    const searchParams = isActive
      ? { cursor: undefined, page: undefined, category, minPrice: undefined, maxPrice: undefined, size }
      : { cursor: undefined, page: undefined, category, minPrice: min, maxPrice: max ?? undefined, size };
    navigate({ search: searchParams });
  };

  const toggleSize = (s: string) => {
    const nextSize = size === s ? undefined : s;
    navigate({ search: { cursor: undefined, page: undefined, category, minPrice: minPriceStr, maxPrice: maxPriceStr, size: nextSize } });
  };

  const handleNext = () => {
    if (nextCursor) {
      navigate({ search: { cursor: nextCursor, page: page + 1, category, minPrice: minPriceStr, maxPrice: maxPriceStr, size } });
    }
  };

  const handlePrev = () => {
    if (prevCursor) {
      navigate({ search: { cursor: prevCursor, page: Math.max(1, page - 1), category, minPrice: minPriceStr, maxPrice: maxPriceStr, size } });
    }
  };

  return (
    <Container>
      <div className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Shop</h1>
          <p className="text-gray-500 text-sm mt-1">
            {isLimitReached ? "General Listing Limit Reached" : (isLoading ? "Loading..." : `Showing ${items.length} product${items.length !== 1 ? "s" : ""}`)}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
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
            {isLimitReached ? (
              <PaginationLimitFallback categories={categories} onSelectCategory={toggleCategory} />
            ) : (
              <>
                <ProductGrid products={items} isLoading={isLoading} error={error} />
                <PaginationBar hasPrev={hasPrev} hasNext={hasNext} onPrev={handlePrev} onNext={handleNext} />
              </>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
