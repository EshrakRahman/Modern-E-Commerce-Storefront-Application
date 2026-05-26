import { PRICE_RANGES, SIZES } from "@/lib/filters";

type CategoryItem = {
  name: string;
  slug: string;
};

type Props = {
  categories: CategoryItem[];
  activeCategory?: string;
  activeMinPrice?: string;
  activeMaxPrice?: string;
  activeSize?: string;
  onToggleCategory: (slug: string) => void;
  onTogglePrice: (min: string, max: string | undefined) => void;
  onToggleSize: (size: string) => void;
};

export default function FilterSidebar({
  categories,
  activeCategory,
  activeMinPrice,
  activeMaxPrice,
  activeSize,
  onToggleCategory,
  onTogglePrice,
  onToggleSize,
}: Props) {
  return (
    <>
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-4 space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Category</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.slug;
                return (
                  <li key={cat.slug}>
                    <button
                      onClick={() => onToggleCategory(cat.slug)}
                      className={`w-full text-left cursor-pointer transition-colors ${
                        isActive ? "text-black font-semibold" : "hover:text-black"
                      }`}
                    >
                      {cat.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Price</h3>
            <div className="flex flex-wrap gap-2">
              {PRICE_RANGES.map((range) => {
                const active = activeMinPrice === range.min && activeMaxPrice === (range.max ?? undefined);
                return (
                  <button
                    key={range.label}
                    onClick={() => onTogglePrice(range.min, range.max)}
                    className={`px-3 py-1.5 text-xs rounded-full border transition-colors cursor-pointer ${
                      active ? "bg-black text-white border-black" : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {range.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Size</h3>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((size) => {
                const active = activeSize === size.value;
                return (
                  <button
                    key={size.value}
                    onClick={() => onToggleSize(size.value)}
                    className={`w-9 h-9 text-sm rounded-lg border transition-colors cursor-pointer ${
                      active ? "bg-black text-white border-black" : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {size.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </aside>

      <div className="flex lg:hidden gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.slug;
          return (
            <button
              key={cat.slug}
              onClick={() => onToggleCategory(cat.slug)}
              className={`px-4 py-2 text-sm rounded-full border whitespace-nowrap transition-colors cursor-pointer ${
                isActive ? "bg-black text-white border-black" : "border-gray-200 hover:border-gray-400"
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
    </>
  );
}
