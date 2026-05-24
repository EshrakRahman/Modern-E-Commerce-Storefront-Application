import Container from "@/components/layout/Container.tsx";
import ProductCard from "@/components/products/ProductCard.tsx";
import { Button } from "@/components/ui/button.tsx";
import { FiHeart } from "react-icons/fi";
import { Link } from "@tanstack/react-router";
import { useWishlist } from "@/context/WishlistContext.tsx";

export default function Wishlist() {
  const { items, isLoading } = useWishlist();

  return (
    <Container>
      <div className="py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Your Wishlist</h1>
            <p className="text-gray-500 text-sm mt-1">
              {isLoading ? "Loading..." : `${items.length} items`}
            </p>
          </div>
          <Button variant="outline" className="rounded-full">
            Share Wishlist
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="w-full aspect-square bg-gray-100 rounded-2xl" />
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-4 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <FiHeart className="text-5xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6">Save your favorite items here!</p>
            <Link to="/">
              <Button className="rounded-full px-8">Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {items.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                slug={product.slug}
                title={product.name}
                price={product.price}
                sale_price={product.sale_price}
                has_discount={product.has_discount}
                compare_price={product.compare_price}
                ratings={4.5}
                prdImg={product.image ?? undefined}
                sizes={product.sizes}
              />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
