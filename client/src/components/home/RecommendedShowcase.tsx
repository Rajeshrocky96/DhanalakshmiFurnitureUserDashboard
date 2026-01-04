import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Product } from "@/types/api";

interface RecommendedShowcaseProps {
    products: Product[];
    title?: string;
}

const RecommendedShowcase = ({ products, title = "Recommended For You" }: RecommendedShowcaseProps) => {
    const [startIndex, setStartIndex] = useState(0);

    const nextSlide = () => {
        setStartIndex((prev) => (prev + 1) % products.length);
    };

    const prevSlide = () => {
        setStartIndex((prev) => (prev - 1 + products.length) % products.length);
    };

    if (!products || products.length === 0) return null;

    // Determine visible products (circular)
    const getVisibleProducts = () => {
        const items = [];
        for (let i = 0; i < 3; i++) {
            items.push(products[(startIndex + i) % products.length]);
        }
        return items;
    };

    const visibleProducts = getVisibleProducts();

    const getSpecValue = (val: any): string => {
        if (!val) return "";
        if (typeof val === 'string') return val;
        if (typeof val === 'object' && val !== null && 'value' in val) return val.value;
        return "";
    };

    return (
        <section className="py-8 bg-gradient-to-b from-slate-50 to-gray-100 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-3xl" />
            </div>

            <div className="container-custom relative z-10">
                <div className="flex flex-col items-center justify-center mb-10 text-center relative">
                    <div>
                        <h2 className="font-heading font-bold text-2xl text-primary">{title}</h2>
                        <p className="text-muted-foreground mt-2">Curated selections just for you</p>
                        <div className="w-full h-0.5 bg-[#e8aa35] mt-6 mb-2 rounded-full" />
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={prevSlide}
                            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-colors"
                            aria-label="Previous"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-colors"
                            aria-label="Next"
                        >
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {visibleProducts.map((product, index) => (
                        <div key={`${product.productId}-${index}`} className="group hidden first:block md:block last:hidden lg:last:block">
                            <Link to={`/product/${product.slug || product.productId}`} className="block relative">
                                {/* Oval Image Container */}
                                <div className="relative aspect-[3/4] w-full max-w-[320px] mx-auto overflow-hidden rounded-[100px] bg-white mb-6 border-4 border-[#e8aa35] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] group-hover:shadow-[0_25px_60px_-12px_rgba(var(--primary-rgb),0.3)] transition-all duration-500 ease-out transform group-hover:-translate-y-2">
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />

                                    {/* Innovative Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-100">
                                            <ArrowRight className="w-5 h-5 text-primary" />
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="text-center px-4 relative z-10">
                                    <h3 className="font-heading font-bold text-2xl text-gray-900 mb-3 group-hover:text-primary transition-colors">
                                        {product.name}
                                    </h3>

                                    {/* Specs as minimal dots/pills */}
                                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                                        {product.specs && Object.entries(product.specs).slice(0, 2).map(([key, val]) => {
                                            const value = getSpecValue(val);
                                            if (!value) return null;
                                            return (
                                                <span key={key} className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full uppercase tracking-wider">
                                                    {value}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RecommendedShowcase;
