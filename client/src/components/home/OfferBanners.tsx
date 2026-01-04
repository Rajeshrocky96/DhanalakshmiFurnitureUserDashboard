import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fetchBanners } from "@/services/api";
import { Banner } from "@/types/api";
import { useBannerNavigation } from "@/hooks/useBannerNavigation";

const OfferBanners = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const { handleBannerClick } = useBannerNavigation();

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const allBanners = await fetchBanners();
        const offerBanners = allBanners
          .filter(b => b.position === 'HOME_OFFER' && b.isActive)
          .sort((a, b) => a.order - b.order);
        setBanners(offerBanners);
      } catch (error) {
        console.error("Failed to load offer banners", error);
      } finally {
        setLoading(false);
      }
    };
    loadBanners();
  }, []);

  if (loading || banners.length === 0) return null;

  const getGridClass = (count: number) => {
    switch (count) {
      case 1: return "grid-cols-1";
      case 2: return "grid-cols-1 md:grid-cols-2";
      case 3: return "grid-cols-1 md:grid-cols-3";
      case 4: return "grid-cols-1 md:grid-cols-2"; // 2x2 grid
      default: return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"; // Fallback
    }
  };

  return (
    <section className="py-4 sm:py-8 bg-gray-50/50">
      <div className="container-custom">
        <div className="text-left mb-3">
          <h2 className="font-heading font-extrabold text-lg sm:text-xl text-primary">
            Exclusive Deals
          </h2>
        </div>

        <div className={`grid gap-3 ${getGridClass(banners.length)}`}>
          {banners.map((banner, index) => (
            <motion.div
              key={banner.bannerId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              onClick={() => handleBannerClick(banner)}
              className="cursor-pointer"
            >
              <div className="offer-banner block group h-full">
                <div className="relative h-28 sm:h-48 w-full rounded-xl overflow-hidden">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OfferBanners;
