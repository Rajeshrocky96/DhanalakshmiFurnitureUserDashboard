import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Product } from "@/types/api";

interface TrendingShowcaseProps {
    products: Product[];
    loading?: boolean;
}

const TrendingShowcase = ({ products, loading }: TrendingShowcaseProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    // Auto-advance
    useEffect(() => {
        if (products.length <= 1) return;
        const timer = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(timer);
    }, [currentIndex, products.length]);

    const nextSlide = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % products.length);
    };

    const prevSlide = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
    };

    if (loading) return <div className="h-[600px] bg-gray-50 animate-pulse" />;
    if (!products || products.length === 0) return null;

    const currentProduct = products[currentIndex];

    // Calculate indices for the stack
    const prevIndex = (currentIndex - 1 + products.length) % products.length;
    const nextIndex = (currentIndex + 1) % products.length;

    return (
        <section className="py-8 bg-gray-900 overflow-hidden relative">
            <div className="container-custom relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 min-h-[500px]">

                    {/* Left Side: Content */}
                    <div className="w-full lg:w-1/3 flex flex-col justify-center items-center text-center z-20 order-2 lg:order-1">
                        {/* Mobile Navigation Arrows */}
                        <div className="flex lg:hidden gap-4 mb-6">
                            <button
                                onClick={prevSlide}
                                className="w-12 h-12 rounded-full border border-gray-700 flex items-center justify-center bg-gray-800 hover:bg-gray-700 shadow-sm transition-all text-gray-300"
                                aria-label="Previous Item"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="w-12 h-12 rounded-full border border-gray-700 flex items-center justify-center bg-gray-800 hover:bg-gray-700 shadow-sm transition-all text-gray-300"
                                aria-label="Next Item"
                            >
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="mb-6 w-full"
                        >

                            <h2 className="font-heading font-bold text-2xl sm:text-3xl mb-4 text-white">
                                Trending Favorites & Essentials
                            </h2>
                            <p className="text-gray-300 mb-6 max-w-md mx-auto lg:mx-0">
                                Discover the most popular picks that everyone is talking about.
                            </p>
                            <div className="w-full h-0.5 bg-[#e8aa35] mb-8 rounded-full" />
                            <h2 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-4">
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={currentProduct.productId}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.4 }}
                                        className="block"
                                    >
                                        {currentProduct.name}
                                    </motion.span>
                                </AnimatePresence>
                            </h2>
                        </motion.div>

                        <div className="mb-8 max-w-md">
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={currentProduct.productId}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4, delay: 0.1 }}
                                    className="text-lg text-gray-400 leading-relaxed"
                                >
                                    {currentProduct.description || "Experience premium quality and comfort. Designed to enhance your living space with style and durability."}
                                </motion.p>
                            </AnimatePresence>
                        </div>

                        <div className="flex items-center gap-6">
                            <Link to={`/product/${currentProduct.slug || currentProduct.productId}`}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-full font-bold text-sm tracking-wide flex items-center gap-2 hover:from-primary hover:to-primary/80 transition-all shadow-lg hover:shadow-primary/25"
                                >
                                    Explore More
                                    <ArrowRight className="w-4 h-4" />
                                </motion.button>
                            </Link>

                            <div className="hidden lg:flex gap-3">
                                <button
                                    onClick={prevSlide}
                                    className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-white hover:shadow-md hover:border-primary/20 transition-all text-gray-600 hover:text-primary"
                                    aria-label="Previous Item"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-white hover:shadow-md hover:border-primary/20 transition-all text-gray-600 hover:text-primary"
                                    aria-label="Next Item"
                                >
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Horizontal Image Stack */}
                    <div className="w-full lg:w-2/3 h-[400px] md:h-[500px] relative flex items-center justify-center order-1 lg:order-2 perspective-1000">

                        {/* Background Text Decoration */}


                        {/* Previous Product (Left) */}
                        {products.length > 1 && (
                            <motion.div
                                className="absolute left-0 lg:-left-20 w-[260px] h-[260px] opacity-40 blur-[1px] z-10 cursor-pointer hidden sm:block"
                                animate={{
                                    x: -50,
                                    scale: 0.6,
                                    opacity: 0.3
                                }}
                                whileHover={{ scale: 0.65, opacity: 0.5, x: -40 }}
                                onClick={prevSlide}
                            >
                                <img
                                    src={products[prevIndex].images[0]}
                                    alt={products[prevIndex].name}
                                    className="w-full h-full object-contain drop-shadow-xl"
                                />
                            </motion.div>
                        )}

                        {/* Current Product (Center) */}
                        <AnimatePresence mode="popLayout" custom={direction}>
                            <motion.div
                                key={currentProduct.productId}
                                custom={direction}
                                initial={{ opacity: 0, x: direction > 0 ? 200 : -200, scale: 0.8 }}
                                animate={{
                                    opacity: 1,
                                    x: 0,
                                    scale: 1,
                                    y: [0, -10, 0] // Floating animation
                                }}
                                exit={{ opacity: 0, x: direction > 0 ? -200 : 200, scale: 0.8, transition: { duration: 0.3 } }}
                                transition={{
                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.2 },
                                    scale: { duration: 0.2 },
                                    y: { duration: 4, repeat: Infinity, ease: "easeInOut" } // Floating transition
                                }}
                                className="relative z-20 w-full h-[400px] md:h-[500px] flex items-center justify-center"
                            >
                                <div className="relative w-full h-full p-4 flex items-center justify-center">
                                    {/* White Circle Background for Image */}
                                    <div className="absolute w-[300px] h-[300px] md:w-[450px] md:h-[450px] bg-white rounded-3xl shadow-2xl z-0" />

                                    <img
                                        src={currentProduct.images[0]}
                                        alt={currentProduct.name}
                                        className="relative z-10 h-[200px] w-[200px] md:h-[320px] md:w-[320px] object-contain drop-shadow-xl filter mx-auto"
                                    />
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Next Product (Right) */}
                        {products.length > 1 && (
                            <motion.div
                                className="absolute right-0 lg:-right-20 w-[260px] h-[260px] opacity-40 blur-[1px] z-10 cursor-pointer hidden sm:block"
                                animate={{
                                    x: 50,
                                    scale: 0.6,
                                    opacity: 0.3
                                }}
                                whileHover={{ scale: 0.65, opacity: 0.5, x: 40 }}
                                onClick={nextSlide}
                            >
                                <img
                                    src={products[nextIndex].images[0]}
                                    alt={products[nextIndex].name}
                                    className="w-full h-full object-contain drop-shadow-xl"
                                />
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </section >


    );
};

export default TrendingShowcase;
