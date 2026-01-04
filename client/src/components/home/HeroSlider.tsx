import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchBanners } from "@/services/api";
import { Banner } from "@/types/api";
import { useBannerNavigation } from "@/hooks/useBannerNavigation";

const HeroSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const { handleBannerClick } = useBannerNavigation();

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const allBanners = await fetchBanners();
        const heroBanners = allBanners
          .filter(b => b.position === 'HOME_HERO' && b.isActive)
          .sort((a, b) => a.order - b.order);
        setBanners(heroBanners);
      } catch (error) {
        console.error("Failed to load hero banners", error);
      } finally {
        setLoading(false);
      }
    };
    loadBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex, banners.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  if (loading) return <div className="h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] bg-muted animate-pulse rounded-xl" />;
  if (banners.length === 0) return null;

  return (
    <section className="bg-background">
      <div className="w-full">
        <div className="relative w-full overflow-hidden group grid grid-cols-1">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={banners[currentIndex].bannerId}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="col-start-1 row-start-1 w-full h-auto cursor-pointer"
              onClick={() => handleBannerClick(banners[currentIndex])}
            >
              <img
                src={banners[currentIndex].image}
                alt={banners[currentIndex].title}
                className="w-full h-auto object-contain"
              />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/5 transition-colors duration-300" />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows - Only if > 1 slide */}
          {banners.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => { e.stopPropagation(); setCurrentIndex(index); }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${index === currentIndex
                      ? "bg-white w-6"
                      : "bg-white/50 w-1.5 hover:bg-white/80"
                      }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
