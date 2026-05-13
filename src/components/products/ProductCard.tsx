import { Heart } from "lucide-react";
import { Ratings } from "@/components/products/Ratings.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";

type Props = {
    id: number;
    title: string;
    ratings: number;
    slug: string;
    price?: number | string;
    discountedPrice?: number;
    discount?: number | boolean;
    prdImg?: string;
}

export default function ProductCard({ id, title, ratings, slug, price, discount, discountedPrice, prdImg }: Props) {
    const { user } = useAuth();
    const { isWishlisted, add, remove } = useWishlist();
    const wishlisted = isWishlisted(id);
    const linkParams = { slug };

    const toggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (wishlisted) {
            remove(id);
        } else {
            add(id);
        }
    };

    return (
        <Link to="/products/$slug" params={linkParams} className="block w-50">
            <section className="w-50">
                <div className="product-img rounded-2xl w-50 h-50 bg-[#F0EEED] p-4 relative">
                    {user && (
                        <button
                            onClick={toggleWishlist}
                            className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:scale-110 transition-transform cursor-pointer z-10"
                            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                        >
                            <Heart className={`w-4 h-4 ${wishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
                        </button>
                    )}
                    <img
                        className="w-full h-full object-cover"
                        src={prdImg}
                        alt="Product"
                    />
                </div>
                <div className="desc flex flex-col pt-4 gap-2">
                    <p className="text-black font-primary font-bold">{title}</p>
                    <Ratings ratings={ratings} />
                    <div className="flex items-center gap-2 ">
                        <p className="font-bold text-black text-lg">
                            ${price ?? 0}
                        </p>
                        {discountedPrice && (
                            <>
                                <p className="font-bold text-black/40 text-lg">${discountedPrice}</p>
                                <Badge variant="destructive">-{discount}%</Badge>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </Link>
    )
}
