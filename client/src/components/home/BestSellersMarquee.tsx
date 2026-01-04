import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Product } from "@/types/api";


interface BestSellersMarqueeProps {
    products: Product[];
    loading?: boolean;
}

const BestSellersMarquee = ({ products, loading }: BestSellersMarqueeProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    // Transform scroll progress to horizontal movement
    // Moving right to left as user scrolls down
    // Transform scroll progress to horizontal movement
    // Moving right to left as user scrolls down
    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

    if (products.length === 0 && !loading) return null;

    return (
        <section
            ref={containerRef}
            className="py-20 overflow-hidden bg-[#FDF8C9]"
        >
            {loading ? (
                <div className="container mx-auto px-4">
                    <div className="h-96 bg-white/50 animate-pulse rounded-3xl" />
                </div>
            ) : (
                <>
                    <div className="container mx-auto px-4 mb-12">
                        <h2 className="font-heading font-bold text-4xl md:text-5xl text-gray-900 max-w-xl leading-tight">
                            Timeless Furniture & Electronics, Loved by All.
                        </h2>
                        <p className="mt-4 text-lg text-gray-700">
                            Explore our best-selling pieces that bring comfort and style to every home.
                        </p>
                    </div>

                    <div className="relative w-full">
                        <motion.div
                            style={{ x }}
                            className="flex gap-8 pl-4 min-w-max"
                        >
                            {/* Double the products to ensure smooth scrolling coverage if needed, 
              or just map them. For a 'marquee' feel, we might want more items. 
              If the list is short, we can repeat it. */}
                            {[...products, ...products].map((product, idx) => (
                                <Link
                                    key={`${product.productId}-${idx}`}
                                    to={`/product/${product.slug}`}
                                    className="group relative w-[300px] h-[400px] md:w-[350px] md:h-[450px] flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer"
                                >
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />

                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />

                                    {/* Text Bubble (mimicking the reference image) */}
                                    <div className="absolute bottom-6 left-6 right-6 bg-white p-4 rounded-xl shadow-lg transform transition-transform duration-300 group-hover:-translate-y-2">
                                        <p className="font-heading font-bold text-gray-900 text-sm mb-1 line-clamp-1">
                                            {product.name}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium text-gray-500">
                                                Best Seller
                                            </span>
                                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${product.isInStock !== false
                                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                                : "bg-rose-50 text-rose-700 border border-rose-100"
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${product.isInStock !== false ? "bg-emerald-500" : "bg-rose-500"
                                                    }`} />
                                                {product.isInStock !== false ? "In Stock" : "Out of Stock"}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </motion.div>
                    </div>
                </>
            )}
        </section>
    );
};

export default BestSellersMarquee;
