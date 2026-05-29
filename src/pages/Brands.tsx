import { useQuery } from "@tanstack/react-query";
import { getBrands } from "@/api/brands";
import { Link } from "@tanstack/react-router";
import Container from "@/components/layout/Container";

export default function BrandsPage() {
  const { data: brands, isLoading, error } = useQuery({
    queryKey: ["brands"],
    queryFn: getBrands,
  });

  return (
    <Container>
      <div className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Brands</h1>
          <p className="text-gray-500 text-sm mt-1">Explore our collection of premium brands</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border border-gray-100 rounded-2xl p-8 h-36 bg-gray-50" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10 text-gray-500">Failed to load brands.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands?.map((brand) => (
              <Link
                key={brand.slug}
                to="/shop"
                search={{ brand: brand.slug }}
                className="border border-gray-200 rounded-2xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer block hover:border-black/30"
              >
                <h3 className="text-xl font-bold text-black mb-2">{brand.name}</h3>
                <p className="text-black/60 text-sm">{brand.description || "Explore our premium brand collection."}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
