import { useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { Link, useLocation } from "@tanstack/react-router";

import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/api/categories";

const FALLBACK_CATEGORIES = [
  { name: "Clothing", slug: "clothing" },
  { name: "Shoes", slug: "shoes" },
  { name: "Accessories", slug: "accessories" },
  { name: "Electronics", slug: "electronics" },
  { name: "Home & Kitchen", slug: "home-kitchen" },
];

export default function NavItems() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { pathname } = useLocation();

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const categories = categoriesData ?? FALLBACK_CATEGORIES;

  const isActive = (path: string) => pathname === path;

  const linkClass = (path: string) =>
    `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive(path)
        ? "text-orange-400 bg-gray-800"
        : "text-white/70 hover:text-white hover:bg-gray-800"
    }`;

  return (
    <div className="bg-black mt-4 rounded-xl w-full p-4">
      <ul className="flex flex-col gap-1">
        <li>
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <span>Shop</span>
            <IoMdArrowDropdown
              className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>
          {isDropdownOpen && (
            <ul className="ml-3 mt-1 flex flex-col gap-1 border-l border-gray-700 pl-3">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    to="/categories/$slug"
                    params={{ slug: cat.slug }}
                    className={linkClass("/categories/" + cat.slug)}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
        <li>
          <Link to="/on-sale" className={linkClass("/on-sale")}>
            On Sale
          </Link>
        </li>
        <li>
          <Link to="/new-arrivals" className={linkClass("/new-arrivals")}>
            New Arrivals
          </Link>
        </li>
        <li>
          <Link to="/brands" className={linkClass("/brands")}>
            Brands
          </Link>
        </li>
      </ul>
    </div>
  );
}
