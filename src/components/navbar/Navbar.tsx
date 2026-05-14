import {FaSearch} from "react-icons/fa";
import {FiShoppingCart, FiHeart} from "react-icons/fi";
import {CgProfile} from "react-icons/cg";
import {MdOutlineMenu, MdLogout, MdPerson, MdReceipt} from "react-icons/md";
import NavItems from "./NavItems";
import {useState} from "react";
import SearchInput from "@/components/ui/SearchInput.tsx";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext.tsx";
import { useCart } from "@/context/CartContext.tsx";

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openSearchPanel, setOpenSearchPanel] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { user, logout } = useAuth();
    const { count } = useCart();

    return (
        <section className="px-4 py-4 h-15 lg:hidden">
            <nav className="mobile-nav flex justify-between items-center">
                <div className="mob-left flex items-center gap-4">
                    <button
                        onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                        className="div"
                    >
                        <MdOutlineMenu className="text-2xl" />
                    </button>
                    <div className="logo">
                        <Link to="/">
                            <span className="font-heading font-bold text-2xl uppercase text-black">
                              shop.co
                            </span>
                        </Link>
                    </div>
                </div>
                <div className="mob-right flex items-center gap-3">
                    {openSearchPanel && <SearchInput onClose={() => setOpenSearchPanel(false)} />}
                    {!openSearchPanel && <FaSearch
                        onClick={() => setOpenSearchPanel(!openSearchPanel)}
                        className="text-2xl"
                    /> }
                    <Link to="/cart" className="relative">
                      <FiShoppingCart className="text-2xl" />
                      {count > 0 && <span className="absolute -top-2 -right-2 w-4.5 h-4.5 flex items-center justify-center bg-black text-white text-[10px] font-bold rounded-full">{count}</span>}
                    </Link>
                    <Link to="/wishlist" className="relative">
                      <FiHeart className="text-2xl" />
                    </Link>
                    {user ? (
                      <div className="relative">
                        <button onClick={() => setIsProfileOpen((prev) => !prev)} className="hover:cursor-pointer">
                          <CgProfile className="text-2xl" />
                        </button>
                        {isProfileOpen && (
                          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                            <div className="px-4 py-2 border-b border-gray-100">
                              <p className="text-sm font-medium text-black truncate">{user.name}</p>
                              <p className="text-xs text-black/40 truncate">{user.email}</p>
                            </div>
                            <Link to="/account" className="flex items-center gap-2 px-4 py-2 text-sm text-black/60 hover:text-black hover:bg-gray-50 transition-colors">
                              <MdPerson className="text-lg" />
                              My Account
                            </Link>
                            <Link to="/orders" className="flex items-center gap-2 px-4 py-2 text-sm text-black/60 hover:text-black hover:bg-gray-50 transition-colors">
                              <MdReceipt className="text-lg" />
                              Orders
                            </Link>
                            <button
                              onClick={logout}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 w-full transition-colors hover:cursor-pointer"
                            >
                              <MdLogout className="text-lg" />
                              Logout
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link to="/login"><CgProfile className="text-2xl" /></Link>
                    )}
                </div>
            </nav>
            {isMobileMenuOpen && (
                <div className="mobile-menu mt-4">
                    <NavItems />
                </div>
            )}
        </section>
    );
}
