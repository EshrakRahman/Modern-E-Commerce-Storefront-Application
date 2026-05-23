import { FiShoppingCart, FiHeart } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { MdLogout, MdPerson, MdReceipt } from "react-icons/md";
import Container from "@/components/layout/Container.tsx";
import { IoMdArrowDropdown } from "react-icons/io";
import SearchInput from "@/components/ui/SearchInput.tsx";
import { Link, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext.tsx";
import { useCart } from "@/context/CartContext.tsx";

const CATEGORIES = [
  { name: "T-Shirts", slug: "t-shirts" },
  { name: "Shirts", slug: "shirts" },
  { name: "Pants", slug: "pants" },
  { name: "Jackets", slug: "jackets" },
  { name: "Shoes", slug: "shoes" },
  { name: "Accessories", slug: "accessories" },
];

const NAV_LINKS = [
  { label: "Shop", path: "/shop", hasDropdown: true },
  { label: "On Sale", path: "/on-sale" },
  { label: "New Arrivals", path: "/new-arrivals" },
  { label: "Brands", path: "/brands" },
];

export default function DesktopNav() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { count, setIsCartDrawerOpen } = useCart();
  const { pathname } = useLocation();

  const isActive = (path: string) => pathname === path;

  return (
    <section className="px-4 py-4 hidden lg:block border-b border-gray-100">
      <Container>
        <nav className="flex justify-between items-center">
          <div className="flex items-center gap-10">
            <div className="logo">
              <Link to="/">
                <span className="font-heading font-bold text-2xl uppercase text-black">
                  shop.co
                </span>
              </Link>
            </div>
            <ul className="flex gap-1">
              {NAV_LINKS.map((link) =>
                link.hasDropdown ? (
                  <li key={link.label} className="relative group">
                    <div
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        isActive(link.path)
                          ? "text-black bg-gray-100"
                          : "text-black/60 hover:text-black hover:bg-gray-50"
                      }`}
                    >
                      <Link to={link.path}>{link.label}</Link>
                      <IoMdArrowDropdown className="text-sm" />
                    </div>
                    <ul className="absolute left-0 top-full w-44 pt-2 hidden group-hover:flex flex-col gap-1 bg-white rounded-xl shadow-lg border border-gray-100 p-2 z-50">
                      {CATEGORIES.map((cat) => (
                        <li key={cat.slug}>
                          <Link
                            to="/categories/$slug"
                            params={{ slug: cat.slug }}
                            className="block px-3 py-2 text-sm text-black/60 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            {cat.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ) : (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors block ${
                        isActive(link.path)
                          ? "text-black bg-gray-100"
                          : "text-black/60 hover:text-black hover:bg-gray-50"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="flex items-center gap-3">
            <SearchInput />
            <button onClick={() => setIsCartDrawerOpen(true)} className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors hover:cursor-pointer">
              <FiShoppingCart className="text-xl" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 flex items-center justify-center bg-black text-white text-[10px] font-bold rounded-full">
                  {count}
                </span>
              )}
            </button>
            <Link to="/wishlist" className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <FiHeart className="text-xl" />
            </Link>
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  className="p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                >
                  <CgProfile className="text-xl" />
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-black truncate">{user.name}</p>
                      <p className="text-xs text-black/40 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/account"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-black/60 hover:text-black hover:bg-gray-50 transition-colors"
                    >
                      <MdPerson className="text-lg" />
                      My Account
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-black/60 hover:text-black hover:bg-gray-50 transition-colors"
                    >
                      <MdReceipt className="text-lg" />
                      Orders
                    </Link>
                    <button
                      onClick={logout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 w-full transition-colors cursor-pointer"
                    >
                      <MdLogout className="text-lg" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <CgProfile className="text-xl" />
              </Link>
            )}
          </div>
        </nav>
      </Container>
    </section>
  );
}
