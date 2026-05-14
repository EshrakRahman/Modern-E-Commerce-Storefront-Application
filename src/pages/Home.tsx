import BannerCarousel from "@/components/header/BannerCarousel.tsx";
import LogoBar from "@/components/header/LogoBar.tsx";
import NewArrivals from "@/components/products/NewArrivals.tsx";
import BestSelling from "@/components/products/BestSelling.tsx";
import {Suspense} from "react";
import ProductSkeleton from "@/components/skeleton/ProductSkeleton.tsx";
import CtgBrowse from "@/components/products/CtgBrowse.tsx";
import CtgSkeleton from "@/components/skeleton/CtgSkeleton.tsx";
import ReviewCardContainer from "@/components/reviews/ReviewCardContainer.tsx";
import SimilarProducts from "@/components/product details/SimilarProducts.tsx";

export default function Home() {
    return (
        <>
            <Suspense fallback={<div className="w-full min-h-[250px] md:min-h-[400px] lg:min-h-[550px] bg-gray-100 animate-pulse" />}>
                <BannerCarousel />
            </Suspense>
            <LogoBar />
            <Suspense fallback={<ProductSkeleton />}>
                <NewArrivals />
            </Suspense>
            <Suspense fallback={<ProductSkeleton />}>
                <BestSelling />
            </Suspense>
            <Suspense fallback={<CtgSkeleton />}>
                <CtgBrowse />
            </Suspense>
            <ReviewCardContainer />
            <SimilarProducts />
        </>
    );
}
