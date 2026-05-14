import { useRef, useState, useEffect, useCallback } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { getBanners } from "@/api/banners";
import { Button } from "@/components/ui/button";

const AUTO_ADVANCE_MS = 5000;

function SlideIndicator({ total, active, onSelect }: { total: number; active: number; onSelect: (i: number) => void }) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
            i === active ? "bg-white w-6" : "bg-white/50 hover:bg-white/80"
          }`}
          aria-label={`Go to slide ${i + 1}`}
        />
      ))}
    </div>
  );
}

export default function BannerCarousel() {
  const { data: banners } = useSuspenseQuery({
    queryKey: ["banners"],
    queryFn: getBanners,
  });

  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const slideCount = banners.length;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    if (slideCount <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slideCount);
    }, AUTO_ADVANCE_MS);
  }, [clearTimer, slideCount]);

  useEffect(() => {
    if (isPaused) {
      clearTimer();
    } else {
      startTimer();
    }
  }, [isPaused, startTimer, clearTimer]);

  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  if (!banners || banners.length === 0) return null;

  const goToSlide = (i: number) => {
    setCurrent(i);
  };

  return (
    <section
      className="relative w-full overflow-hidden min-h-[250px] md:min-h-[400px] lg:min-h-[550px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((banner) => {
          const isLight = banner.text_color === "light";
          const img = banner.desktop_image ?? banner.mobile_image;

          return (
            <div
              key={banner.id}
              className="relative w-full shrink-0 flex items-center"
              style={{
                minHeight: "inherit",
                background: img
                  ? `url(${banner.desktop_image ?? banner.mobile_image}) center/cover no-repeat`
                  : banner.bg_color ?? "#F2F0F1",
              }}
            >
              {banner.mobile_image && (
                <picture className="absolute inset-0 -z-10">
                  <source media="(min-width: 768px)" srcSet={banner.desktop_image ?? undefined} />
                  <img src={banner.mobile_image} alt="" className="w-full h-full object-cover" />
                </picture>
              )}
              <div
                className={`absolute inset-0 ${
                  isLight ? "bg-black/40" : "bg-black/10"
                }`}
              />

              <div className="relative z-10 px-6 md:px-12 lg:px-20 max-w-2xl">
                <h2
                  className={`text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 ${
                    isLight ? "text-white" : "text-gray-900"
                  }`}
                >
                  {banner.title}
                </h2>
                {banner.subtitle && (
                  <p
                    className={`text-sm md:text-lg lg:text-xl mb-6 ${
                      isLight ? "text-white/80" : "text-gray-700"
                    }`}
                  >
                    {banner.subtitle}
                  </p>
                )}
                <Link to={banner.cta_url}>
                  <Button className="rounded-full px-8 py-5 text-base font-semibold">
                    {banner.cta_text}
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <SlideIndicator total={slideCount} active={current} onSelect={goToSlide} />
    </section>
  );
}
