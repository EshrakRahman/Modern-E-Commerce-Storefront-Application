import {Skeleton} from "@/components/ui/skeleton.tsx";

export default function ProductCardSkeleton() {
    return (
        <section className="w-48">
            <div className="product-img rounded-2xl w-48 h-48 bg-[#F0EEED] p-4">
                <Skeleton className="w-full h-full" />
            </div>
            <div className="desc flex flex-col pt-3 gap-1.5">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
            </div>
        </section>
    )
}
