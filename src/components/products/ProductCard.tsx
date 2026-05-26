import { Heart, ShoppingBag } from "lucide-react";
import { Ratings } from "@/components/products/Ratings.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import type { Size } from "@/schemas/productSchema";
import ProductImg from "@/assets/product_one.png";

type Props = {
    id: number;
    title: string;
    ratings: number;
    slug: string;
    price: number;
    sale_price?: number | null;
    has_discount?: boolean | null;
    compare_price?: number | null;
    prdImg?: string;
    sizes?: Size[];
}

export default function ProductCard({ id, title, ratings, slug, price, sale_price, has_discount, compare_price, prdImg, sizes }: Props) {
    const { user } = useAuth();
    const { isWishlisted, add, remove } = useWishlist();
    const { addItem } = useCart();
    const navigate = useNavigate();
    const wishlisted = isWishlisted(id);
    const hasSizes = sizes && sizes.length > 0;
    const linkParams = { slug };

    const hasSale = has_discount || (compare_price != null && compare_price > price);
    const currentPrice = has_discount ? (sale_price ?? price) : price;
    const originalPrice = has_discount ? price : (compare_price && compare_price > price ? compare_price : null);
    const discountPercent = hasSale && originalPrice != null && originalPrice > 0
        ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
        : null;

    const toggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (wishlisted) {
            remove(id);
        } else {
            add(id);
        }
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (hasSizes) {
            navigate({ to: "/products/$slug", params: linkParams });
        } else {
            addItem({
                product_id: id,
                product_name: title,
                price: currentPrice,
                image: prdImg ?? "",
                quantity: 1,
                size_id: null,
                size_name: null,
            });
        }
    };

    return (
        <Link to="/products/$slug" params={linkParams} className="block group hover:-translate-y-1.5 transition-all duration-300">
            <section className="w-full">
                <div className="product-img rounded-2xl w-full aspect-square bg-[#F0EEED] relative overflow-hidden shadow-sm group-hover:shadow-md transition-shadow duration-300">
                    {user && (
                        <button
                            onClick={toggleWishlist}
                            className={`absolute top-2.5 right-2.5 z-10 p-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer ${
                                wishlisted ? "animate-heart-pop text-red-500" : "text-gray-600 hover:text-red-500"
                            }`}
                            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                        >
                            <Heart className={`w-4 h-4 ${wishlisted ? "fill-red-500 text-red-500" : ""}`} />
                        </button>
                    )}
                    <img
                        className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                        src={prdImg || ProductImg}
                        alt={title}
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = ProductImg;
                        }}
                    />
                    <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <button
                            onClick={handleAddToCart}
                            className="w-full py-2.5 bg-black text-white text-sm font-medium flex items-center justify-center gap-1.5 hover:bg-gray-900 transition-colors cursor-pointer"
                        >
                            <ShoppingBag className="w-4 h-4" />
                            Add to Cart
                        </button>
                    </div>
                </div>
                <div className="desc flex flex-col pt-3 gap-1">
                    <p className="text-gray-800 group-hover:text-black font-semibold text-sm leading-snug line-clamp-2 transition-colors">{title}</p>
                    <Ratings ratings={ratings} />
                    <div className="flex items-center gap-2 flex-wrap mt-0.5">
                        <span className="font-bold text-black text-base">${currentPrice}</span>
                        {originalPrice && (
                            <span className="font-medium text-gray-400 text-sm line-through">${originalPrice}</span>
                        )}
                        {discountPercent && (
                            <Badge variant="destructive" className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-red-50 text-red-600 border border-red-100">
                              -{discountPercent}%
                            </Badge>
                        )}
                    </div>
                </div>
            </section>
        </Link>
    )
}
