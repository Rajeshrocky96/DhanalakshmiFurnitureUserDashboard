import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/types/api";

interface ProductSectionProps {
    title: string;
    subtitle?: string;
    products: Product[];
    viewAllLink: string;
    loading?: boolean;
    showBadge?: boolean;
}

const ProductSection = ({ title, subtitle, products, viewAllLink, loading, showBadge }: ProductSectionProps) => {
    const [startIndex, setStartIndex] = useState(0);

    const nextSlide = () => {
        if (startIndex + 4 < products.length) {
            setStartIndex(prev => prev + 1);
        }
    };

    const prevSlide = () => {
        if (startIndex > 0) {
            setStartIndex(prev => prev - 1);
        }
    };

    if (loading) {
        return (
            <section className="py-12 bg-background">
                <div className="container-custom">
                    <div className="text-center mb-10">
                        <div className="h-8 w-48 bg-secondary animate-pulse mx-auto rounded mb-2"></div>
                        <div className="h-4 w-64 bg-secondary animate-pulse mx-auto rounded"></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="aspect-[3/4] bg-secondary animate-pulse rounded-lg"></div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (products.length === 0) return null;

    return (
        <section className="py-8 bg-gray-50/50">
            <div className="container-custom">
                <div className="relative flex flex-col sm:flex-row items-center justify-center mb-8 gap-4 sm:gap-0">
                    <div className="text-center w-full sm:w-auto">
                        <h2 className="font-heading font-bold text-2xl text-primary">
                            {title}
                        </h2>
                        {subtitle && (
                            <p className="text-muted-foreground mt-2 text-sm">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    <div className="sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2">
                        <Link
                            to={viewAllLink}
                            className="btn-outline inline-flex items-center gap-1.5 text-xs py-1.5 px-4 h-auto min-h-0"
                        >
                            View All <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                </div>

                <div className="w-full h-0.5 bg-[#e8aa35] mb-6 rounded-full" />

                <div className="relative group">
                    {/* Previous Button */}
                    {startIndex > 0 && (
                        <button
                            onClick={prevSlide}
                            className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors border border-gray-100 hidden md:flex"
                            aria-label="Previous products"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                        {products.slice(startIndex, startIndex + 4).map((product, index) => (
                            <motion.div
                                key={product.productId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <ProductCard product={product} showBadge={showBadge} />
                            </motion.div>
                        ))}
                    </div>

                    {/* Next Button */}
                    {startIndex + 4 < products.length && (
                        <button
                            onClick={nextSlide}
                            className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors border border-gray-100 hidden md:flex"
                            aria-label="Next products"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ProductSection;
