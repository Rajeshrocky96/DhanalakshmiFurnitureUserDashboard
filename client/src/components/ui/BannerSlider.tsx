import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Banner } from "@/types/api";
import { useBannerNavigation } from "@/hooks/useBannerNavigation";

interface BannerSliderProps {
    banners: Banner[];
    aspectRatio?: string;
    showContent?: boolean;
}

const BannerSlider = ({ banners, aspectRatio = "aspect-[21/9]", showContent = true }: BannerSliderProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { handleBannerClick } = useBannerNavigation();

    useEffect(() => {
        if (banners.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [currentIndex, banners.length]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    };

    if (banners.length === 0) return null;

    return (
        <div className={`relative w-full overflow-hidden rounded-xl shadow-lg group ${aspectRatio}`}>
            <AnimatePresence initial={false} mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`absolute inset-0 w-full h-full ${banners[currentIndex].redirectType && banners[currentIndex].redirectValue ? 'cursor-pointer' : 'cursor-default'}`}
                    onClick={() => {
                        if (banners[currentIndex].redirectType && banners[currentIndex].redirectValue) {
                            handleBannerClick(banners[currentIndex]);
                        }
                    }}
                >
                    <img
                        src={banners[currentIndex].image}
                        alt={banners[currentIndex].title}
                        className="w-full h-full object-cover"
                    />

                    {showContent && (
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/5 transition-colors duration-300" />
                    )}
                </motion.div>
            </AnimatePresence>

            {banners.length > 1 && (
                <>
                    <button
                        onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
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
    );
};

export default BannerSlider;
