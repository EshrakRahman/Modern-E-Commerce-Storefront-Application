import { Search, Filter, Compass } from "lucide-react";

interface PaginationLimitFallbackProps {
  categories?: { name: string; slug: string }[];
  onSelectCategory: (slug: string) => void;
}

export default function PaginationLimitFallback({
  categories = [],
  onSelectCategory,
}: PaginationLimitFallbackProps) {
  // Filter out "all" category if present
  const popularCategories = categories.filter((c) => c.slug !== "all").slice(0, 5);

  return (
    <div className="w-full py-12 px-6 flex flex-col items-center justify-center text-center">
      <div className="max-w-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-xl border border-zinc-100 dark:border-zinc-800 transition-all duration-300 hover:shadow-2xl">
        {/* Decorative floating icons */}
        <div className="flex justify-center gap-4 mb-6">
          <div className="p-4 bg-indigo-50 dark:bg-indigo-950/50 rounded-2xl text-indigo-600 dark:text-indigo-400 animate-bounce" style={{ animationDuration: "3s" }}>
            <Search size={28} />
          </div>
          <div className="p-4 bg-violet-50 dark:bg-violet-950/50 rounded-2xl text-violet-600 dark:text-violet-400 animate-pulse">
            <Filter size={28} />
          </div>
          <div className="p-4 bg-fuchsia-50 dark:bg-fuchsia-950/50 rounded-2xl text-fuchsia-600 dark:text-fuchsia-400 animate-bounce" style={{ animationDuration: "4s" }}>
            <Compass size={28} />
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-950 dark:text-zinc-50 tracking-tight leading-tight mb-4">
          Looking for Something Specific?
        </h2>

        <p className="text-zinc-600 dark:text-zinc-400 text-base md:text-lg mb-8 max-w-lg mx-auto leading-relaxed">
          You've reached the browsing limit for unfiltered listings. With over <strong className="text-indigo-600 dark:text-indigo-400">100,000+ products</strong> in our catalog, narrowing down your criteria will help you find the best deals faster!
        </p>

        {/* Suggestion Section */}
        <div className="space-y-6 text-left border-t border-zinc-100 dark:border-zinc-800 pt-8">
          <div>
            <h3 className="text-sm font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3">
              Try Filtering by Popular Categories
            </h3>
            {popularCategories.length > 0 ? (
              <div className="flex flex-wrap gap-2.5">
                {popularCategories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => onSelectCategory(cat.slug)}
                    className="px-4 py-2 bg-zinc-50 hover:bg-indigo-50 dark:bg-zinc-800 dark:hover:bg-indigo-950 text-zinc-800 dark:text-zinc-200 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium rounded-xl text-sm transition-all duration-200 border border-zinc-100 dark:border-zinc-700 hover:border-indigo-200 dark:hover:border-indigo-900 cursor-pointer"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-500">Select a category from the sidebar to continue browsing.</p>
            )}
          </div>

          <div className="flex items-start gap-3 bg-zinc-50/50 dark:bg-zinc-800/30 p-4 rounded-2xl border border-zinc-100/50 dark:border-zinc-800/50">
            <div className="mt-0.5 text-indigo-600 dark:text-indigo-400">
              <Compass size={18} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                Refining controls
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Apply a specific <strong>Price Range</strong> or <strong>Size</strong> filter in the sidebar to bypass this browsing limit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
