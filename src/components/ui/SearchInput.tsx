import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { GoSearch } from "react-icons/go";
import { Input } from "@/components/ui/input.tsx";
import { getProducts } from "@/api/products.ts";
import { getCategories } from "@/api/categories.ts";
import type { Product, Category } from "@/schemas/productSchema.ts";
import ProductImg from "@/assets/product_one.png";

type SearchInputProps = {
  onClose?: () => void;
};

export default function SearchInput({ onClose }: SearchInputProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch all categories once on mount
  useEffect(() => {
    getCategories()
      .then(setAllCategories)
      .catch(() => {});
  }, []);

  // Debounced search for products
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setProducts([]);
      return;
    }

    setLoading(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const resObj = await getProducts({ search: trimmed });
        setProducts(resObj.data.slice(0, 5));
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setIsDropdownOpen(false);
    onClose?.();
    navigate({ to: "/categories/all", search: { q: trimmed } });
  };

  // Filter categories locally
  const filteredCategories = allCategories
    .filter((cat) => cat.name.toLowerCase().includes(query.toLowerCase().trim()))
    .slice(0, 3);

  const showDropdown = isDropdownOpen && query.trim().length >= 2;

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      {/* Search Input Field */}
      <div className="relative">
        <GoSearch className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search products..."
          value={query}
          onFocus={() => setIsDropdownOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsDropdownOpen(true);
          }}
          className="h-11 w-full rounded-full bg-gray-50/75 pl-10 pr-4 text-sm shadow-sm border border-gray-200 focus:border-black focus:bg-white focus:ring-0 transition-colors uppercase"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearchSubmit();
            }
          }}
        />
      </div>

      {/* Autocomplete Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 p-4 max-h-[420px] overflow-y-auto animate-fade-in scrollbar-hide">
          {loading && products.length === 0 ? (
            <div className="flex items-center justify-center py-6 text-sm text-gray-400">
              <svg className="animate-spin h-5 w-5 mr-2 text-black" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Searching products...
            </div>
          ) : (
            <div className="space-y-4">
              {/* Category Suggestions */}
              {filteredCategories.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Categories
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {filteredCategories.map((cat) => (
                      <Link
                        key={cat.id}
                        to="/categories/$slug"
                        params={{ slug: cat.slug }}
                        onClick={() => setIsDropdownOpen(false)}
                        className="px-3 py-1 bg-gray-50 hover:bg-gray-100 border border-gray-200/50 rounded-full text-xs font-medium text-gray-700 transition-colors hover:cursor-pointer"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Results */}
              <div>
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Products
                </h4>
                {products.length === 0 ? (
                  <p className="text-xs text-gray-500 py-2">No matching products found.</p>
                ) : (
                  <div className="space-y-2">
                    {products.map((product) => {
                      const finalPrice = product.has_discount
                        ? (product.sale_price ?? product.price)
                        : product.price;
                      return (
                        <Link
                          key={product.id}
                          to="/products/$slug"
                          params={{ slug: product.slug }}
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl transition-colors hover:cursor-pointer border border-transparent hover:border-gray-100/80"
                        >
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200/20">
                            <img
                              src={product.image || ProductImg}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = ProductImg;
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-900 truncate">
                              {product.name}
                            </p>
                            <p className="text-[10px] text-gray-500 truncate">
                              {product.category || "General"}
                            </p>
                          </div>
                          <span className="text-xs font-bold text-black shrink-0">
                            ${finalPrice.toFixed(2)}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* View all results link */}
              <div className="border-t border-gray-100 pt-3 text-center">
                <button
                  onClick={handleSearchSubmit}
                  className="text-xs font-bold text-black hover:underline cursor-pointer"
                >
                  View all search results for &ldquo;{query}&rdquo;
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
