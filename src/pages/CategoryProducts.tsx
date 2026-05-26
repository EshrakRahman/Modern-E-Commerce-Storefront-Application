import { useQuery } from "@tanstack/react-query";
import { useParams, useSearch, useNavigate } from "@tanstack/react-router";
import { getProducts } from "@/api/products";
import { getCategories } from "@/api/categories";
import Container from "@/components/layout/Container";
import FilterSidebar from "@/components/products/FilterSidebar";
import ProductGrid from "@/components/products/ProductGrid";
import PaginationBar from "@/components/products/PaginationBar";
import PaginationLimitFallback from "@/components/products/PaginationLimitFallback";
import { parseNumericParam, cleanStringParam } from "@/lib/utils";

export default function CategoryProducts() {
  const { slug: rawSlug } = useParams({ from: "/categories/$slug" });
  const { cursor: cursorRaw, minPrice: minPriceRaw, maxPrice: maxPriceRaw, size: sizeRaw, q: qRaw, page: pageRaw } = useSearch({ from: "/categories/$slug" });
  const navigate = useNavigate({ from: "/categories/$slug" });

  const slug = cleanStringParam(rawSlug) || "all";
  const cursor = cleanStringParam(cursorRaw);
  const minPriceStr = cleanStringParam(minPriceRaw);
  const maxPriceStr = cleanStringParam(maxPriceRaw);
  const size = cleanStringParam(sizeRaw);
  const q = cleanStringParam(qRaw);
  const page = parseNumericParam(pageRaw) || 1;

  const filters = {
    cursor,
    minPrice: parseNumericParam(minPriceStr),
    maxPrice: parseNumericParam(maxPriceStr),
    size,
    q,
  };

  const isUnfilteredAllProducts = slug === "all" && !minPriceStr && !maxPriceStr && !size && !q;
  const isLimitReached = isUnfilteredAllProducts && page >= 3;

  const queryKey = ["products", { slug, sort: "latest", ...filters }];

  const queryFn = () => {
    return getProducts({
      search: filters.q || undefined,
      category: slug !== "all" ? slug : undefined,
      sort: "latest",
      cursor: filters.cursor,
      per_page: 12,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      size: filters.size,
    });
  };

  const { data: products, isLoading: isProductsLoading, error: productsError } = useQuery({
    queryKey,
    queryFn,
    enabled: !isLimitReached,
  });

  const { data: categoriesData, isLoading: isCategoriesLoading, error: categoriesError } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const items = products?.data ?? [];
  const nextCursor = products?.meta?.next_cursor;
  const prevCursor = products?.meta?.prev_cursor;
  const hasPrev = !!prevCursor;
  const hasNext = !!nextCursor;
  const isLoading = (isProductsLoading && !isLimitReached) || isCategoriesLoading;
  const error = productsError || categoriesError;

  const title = q
    ? `Search results for "${q}"`
    : slug !== "all"
    ? slug.charAt(0).toUpperCase() + slug.slice(1)
    : "All Products";

  const sidebarCategories = [
    { name: "All Products", slug: "all" },
    ...(categoriesData?.map((c) => ({ name: c.name, slug: c.slug })) ?? [])
  ];

  const handleCategoryClick = (catSlug: string) => {
    navigate({
      to: `/categories/${catSlug}`,
      search: { cursor: undefined, page: undefined, q },
    });
  };

  const togglePrice = (min: string, max: string | undefined) => {
    const isActive = minPriceStr === min && maxPriceStr === (max ?? undefined);
    const searchParams = isActive
      ? { cursor: undefined, page: undefined, minPrice: undefined, maxPrice: undefined, size, q }
      : { cursor: undefined, page: undefined, minPrice: min, maxPrice: max ?? undefined, size, q };
    navigate({ search: searchParams });
  };

  const toggleSize = (s: string) => {
    const nextSize = size === s ? undefined : s;
    navigate({
      search: { cursor: undefined, page: undefined, minPrice: minPriceStr, maxPrice: maxPriceStr, size: nextSize, q },
    });
  };

  const handleNext = () => {
    if (nextCursor) {
      navigate({
        search: { cursor: nextCursor, page: page + 1, minPrice: minPriceStr, maxPrice: maxPriceStr, size, q },
      });
    }
  };

  const handlePrev = () => {
    if (prevCursor) {
      navigate({
        search: { cursor: prevCursor, page: Math.max(1, page - 1), minPrice: minPriceStr, maxPrice: maxPriceStr, size, q },
      });
    }
  };

  return (
    <Container>
      <div className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {isLimitReached ? "General Listing Limit Reached" : (isLoading ? "Loading..." : `Showing ${items.length} product${items.length !== 1 ? "s" : ""}`)}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <FilterSidebar
            categories={sidebarCategories}
            activeCategory={slug}
            activeMinPrice={minPriceStr}
            activeMaxPrice={maxPriceStr}
            activeSize={size}
            onToggleCategory={handleCategoryClick}
            onTogglePrice={togglePrice}
            onToggleSize={toggleSize}
          />

          <div className="flex-1">
            {isLimitReached ? (
              <PaginationLimitFallback categories={sidebarCategories} onSelectCategory={handleCategoryClick} />
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
