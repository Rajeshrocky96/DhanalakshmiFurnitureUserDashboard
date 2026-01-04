import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { fetchBanners } from "@/services/api";
import { Banner } from "@/types/api";
import { useBannerNavigation } from "@/hooks/useBannerNavigation";

const BottomBanners = () => {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const { handleBannerClick } = useBannerNavigation();

    useEffect(() => {
        const loadBanners = async () => {
            try {
                const allBanners = await fetchBanners();
                const bottomBanners = allBanners
                    .filter(b => b.position === 'HOME_BOTTOM' && b.isActive)
                    .sort((a, b) => a.order - b.order);
                setBanners(bottomBanners);
            } catch (error) {
                console.error("Failed to load bottom banners", error);
            } finally {
                setLoading(false);
            }
        };
        loadBanners();
    }, []);

    // Auto-advance slider if more than 2 banners
    useEffect(() => {
        if (banners.length <= 2) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [banners.length, currentIndex]);

    const nextSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % banners.length);
    };

    const prevSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    };

    if (loading || banners.length === 0) return null;

    const BannerCard = ({ banner, className }: { banner: Banner, className?: string }) => (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => handleBannerClick(banner)}
            className={`relative rounded-xl overflow-hidden cursor-pointer group h-[200px] sm:h-[250px] w-full shadow-md hover:shadow-xl transition-all duration-300 ${className}`}
        >
            <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/5 transition-colors duration-300" />
        </motion.div>
    );

    return (
        <section className="py-6 bg-background">
            <div className="container-custom">
                {/* Case 1: Single Banner - Full Width */}
                {banners.length === 1 && (
                    <BannerCard banner={banners[0]} className="h-[250px] sm:h-[350px]" />
                )}

                {/* Case 2: Two Banners - Split Row */}
                {banners.length === 2 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {banners.map((banner) => (
                            <BannerCard key={banner.bannerId} banner={banner} />
                        ))}
                    </div>
                )}

                {/* Case 3: More than 2 Banners - Slider */}
                {banners.length > 2 && (
                    <div className="relative h-[250px] sm:h-[350px] overflow-hidden rounded-xl group/slider">
                        <AnimatePresence initial={false} mode="wait">
                            <motion.div
                                key={banners[currentIndex].bannerId}
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.3 }}
                                className="absolute inset-0"
                            >
                                <BannerCard banner={banners[currentIndex]} className="h-full" />
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation Buttons */}
                        <button
                            onClick={prevSlide}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-black/50"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-black/50"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>

                        {/* Dots */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                            {banners.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentIndex(index);
                                    }}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${index === currentIndex
                                        ? "bg-white w-6"
                                        : "bg-white/50 w-1.5 hover:bg-white/80"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default BottomBanners;
