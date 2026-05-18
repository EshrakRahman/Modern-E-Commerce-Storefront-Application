import { Heart, ShoppingBag } from "lucide-react";
import { Ratings } from "@/components/products/Ratings.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import type { Size } from "@/schemas/productSchema";

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
        <Link to="/products/$slug" params={linkParams} className="block group">
            <section className="w-48">
                <div className="product-img rounded-2xl w-48 h-48 bg-[#F0EEED] relative overflow-hidden">
                    {user && (
                        <button
                            onClick={toggleWishlist}
                            className="absolute top-2 right-2 z-10 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:scale-110 transition-transform cursor-pointer"
                            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                        >
                            <Heart className={`w-4 h-4 ${wishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
                        </button>
                    )}
                    {prdImg && (
                        <img
                            className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                            src={prdImg}
                            alt={title}
                        />
                    )}
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
                <div className="desc flex flex-col pt-3 gap-1.5">
                    <p className="text-black font-primary font-bold text-sm leading-snug line-clamp-2">{title}</p>
                    <Ratings ratings={ratings} />
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-black text-base">${currentPrice}</span>
                        {originalPrice && (
                            <span className="font-bold text-black/40 text-sm line-through">${originalPrice}</span>
                        )}
                        {discountPercent && (
                            <Badge variant="destructive" className="text-[10px] px-1.5 py-0.5">-{discountPercent}%</Badge>
                        )}
                    </div>
                </div>
            </section>
        </Link>
    )
}
