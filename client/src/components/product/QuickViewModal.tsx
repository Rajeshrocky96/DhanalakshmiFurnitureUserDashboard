import { useState } from "react";
import { Link } from "react-router-dom";
import { X, ChevronLeft, ChevronRight, MessageCircle, ImageOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/types/api";

interface QuickViewModalProps {
    product: Product;
    onClose: () => void;
}
const QuickViewModal = ({ product, onClose }: QuickViewModalProps) => {
    const [currentImage, setCurrentImage] = useState(0);

    const handleEnquiry = () => {
        const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "917448856172";

        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:30038';
        const imageLinkForMessage = `${apiUrl}/api/products/${product.slug || product.productId}/image`;

        const message = `Hello 👋\n\nI am interested in the following product:\n\n🛋️ Product: ${product.name}\n🔗 Product Link: ${window.location.origin}/product/${product.slug}\n🖼️ Image: ${imageLinkForMessage}\n\nPlease share price, availability, and more details.\n\nThank you.`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, "_blank");
    };

    const nextImage = () => {
        setCurrentImage((prev) => (prev + 1) % product.images.length);
    };

    const prevImage = () => {
        setCurrentImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="quick-view-overlay"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-card rounded-xl max-w-2xl w-full overflow-hidden shadow-elevated m-4"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-3 border-b border-border">
                        <h2 className="font-heading font-semibold text-base">Quick View</h2>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-full hover:bg-secondary transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 p-4">
                        {/* Image Gallery */}
                        <div className="space-y-3">
                            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-secondary">
                                {product.images && product.images[currentImage] ? (
                                    <img
                                        src={product.images[currentImage]}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                                        <ImageOff className="w-12 h-12 mb-2 opacity-50" />
                                        <span className="text-xs font-medium uppercase tracking-wider opacity-70">No Image Available</span>
                                    </div>
                                )}

                                {product.images.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Thumbnails */}
                            <div className="flex gap-1.5 justify-center">
                                {product.images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImage(index)}
                                        className={`w-10 h-10 rounded-md overflow-hidden cursor-pointer border-2 transition-all duration-200 ${currentImage === index ? 'border-primary' : 'border-transparent'}`}
                                    >
                                        {img ? (
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-secondary text-muted-foreground">
                                                <ImageOff className="w-4 h-4 opacity-50" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-col">
                            <h3 className="font-heading font-bold text-lg text-[#FA6202]">
                                {product.name}
                            </h3>

                            <div className="flex items-center gap-2 mt-2">
                                <div className={`w-2 h-2 rounded-full ${product.isInStock ? 'bg-green-500' : 'bg-red-500'}`} />
                                <span className={`text-xs font-medium ${product.isInStock ? 'text-green-600' : 'text-red-600'}`}>
                                    {product.isInStock ? 'In Stock' : 'Out of Stock'}
                                </span>
                            </div>

                            <div className="mt-4 space-y-2">
                                {Object.entries(product.specs || {}).slice(0, 3).map(([key, val]) => {
                                    const value = typeof val === 'string' ? val : (val as any).value;
                                    if (!value) return null;
                                    return (
                                        <div
                                            key={key}
                                            className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/30 hover:bg-secondary transition-all duration-300 group cursor-default border border-transparent hover:border-border/50"
                                        >
                                            <span className="text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors capitalize">
                                                {key.replace(/([A-Z])/g, ' $1').trim()}
                                            </span>
                                            <span className="text-xs font-semibold text-foreground group-hover:scale-105 transition-transform origin-right">
                                                {value}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-auto pt-4 space-y-2">
                                <button
                                    onClick={handleEnquiry}
                                    className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold py-2 rounded-lg shadow-md flex items-center justify-center gap-2 text-sm transition-colors"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    Enquire on WhatsApp
                                </button>
                                <Link
                                    to={`/product/${product.slug}`}
                                    className="btn-outline w-full text-center block text-sm py-2"
                                    onClick={onClose}
                                >
                                    View Full Details
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default QuickViewModal;
