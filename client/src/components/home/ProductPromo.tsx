import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { fetchBanners } from "@/services/api";
import { Banner } from "@/types/api";
import { useBannerNavigation } from "@/hooks/useBannerNavigation";

const ProductPromo = () => {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const { handleBannerClick } = useBannerNavigation();

    useEffect(() => {
        const loadBanners = async () => {
            try {
                const allBanners = await fetchBanners();
                const promoBanners = allBanners
                    .filter(b => b.position === 'PRODUCT_PROMO' && b.isActive)
                    .sort((a, b) => a.order - b.order);
                setBanners(promoBanners);
            } catch (error) {
                console.error("Failed to load product promo banners", error);
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
            default: return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
        }
    };

    return (
        <section className="py-4 bg-background">
            <div className="container-custom">
                <div className={`grid gap-6 ${getGridClass(banners.length)}`}>
                    {banners.map((banner, index) => (
                        <motion.div
                            key={banner.bannerId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.15 }}
                            onClick={() => handleBannerClick(banner)}
                            className="cursor-pointer"
                        >
                            <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden group shadow-lg">
                                <img
                                    src={banner.image}
                                    alt={banner.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductPromo;
