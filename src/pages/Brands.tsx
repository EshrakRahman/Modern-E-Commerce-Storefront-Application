import Container from "@/components/layout/Container";

const BRANDS = [
  { name: "Nike", description: "Premium athletic wear and footwear" },
  { name: "Adidas", description: "Sportswear and lifestyle products" },
  { name: "Puma", description: "Performance and casual wear" },
  { name: "Levi's", description: "Classic denim and apparel" },
  { name: "Zara", description: "Contemporary fashion" },
  { name: "H&M", description: "Affordable fashion for everyone" },
];

export default function BrandsPage() {
  return (
    <Container>
      <div className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Brands</h1>
          <p className="text-gray-500 text-sm mt-1">Explore our collection of premium brands</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BRANDS.map((brand) => (
            <div
              key={brand.name}
              className="border border-gray-200 rounded-2xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <h3 className="text-xl font-bold text-black mb-2">{brand.name}</h3>
              <p className="text-black/60 text-sm">{brand.description}</p>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
