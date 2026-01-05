import { useState } from "react";
import { Link } from "react-router-dom";
import { GitCompare, Percent, TrendingDown, Sparkles, Eye, Share2, ImageOff } from "lucide-react";
import { motion } from "framer-motion";
import { Product } from "@/types/api";
import { useCompare } from "@/context/CompareContext";
import { useToast } from "@/hooks/use-toast";
import QuickViewModal from "./QuickViewModal";

interface ProductCardProps {
  product: Product;
  showBadge?: boolean;
  layout?: 'grid' | 'list';
}

const ProductCard = ({ product, showBadge = false, layout = 'grid' }: ProductCardProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showQuickView, setShowQuickView] = useState(false);
  const { addToCompare, removeFromCompare, isInCompare, canCompare } = useCompare();
  const { toast } = useToast();

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInCompare(product.productId)) {
      removeFromCompare(product.productId);
      toast({
        title: "Removed from compare",
        description: `${product.name} removed from compare list`,
      });
      return;
    }

    // Assuming subcategoryId is enough for comparison check for now
    if (!canCompare(product.subcategoryId)) {
      toast({
        title: "Cannot compare",
        description: "You can only compare products from the same category",
        variant: "destructive",
      });
      return;
    }

    const success = addToCompare({
      id: product.productId,
      name: product.name,
      image: product.images[0],
      category: product.subcategoryId,
    });

    if (success) {
      toast({
        title: "Added to compare",
        description: `${product.name} added to compare list`,
      });
    } else {
      toast({
        title: "Compare limit reached",
        description: "You can compare up to 4 products",
        variant: "destructive",
      });
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };

  // Determine badge type based on product properties
  const getBadge = () => {
    // if (product.isBestSeller) {
    //   return {
    //     label: "Best Seller",
    //     icon: Star,
    //     className: "bg-primary text-primary-foreground"
    //   };
    // }
    if (product.isOnOffer) {
      return {
        label: product.offerText || "Offer",
        icon: Percent,
        className: "bg-destructive text-destructive-foreground"
      };
    }
    if (product.isNewArrival) {
      return {
        label: "New Arrival",
        icon: Sparkles,
        className: "bg-secondary text-secondary-foreground border border-border"
      };
    }
    if (product.isTrending) {
      return {
        label: "Trending",
        icon: TrendingDown,
        className: "bg-accent text-accent-foreground"
      };
    }
    return null;
  };

  const badge = getBadge();
  const BadgeIcon = badge?.icon;

  if (layout === 'list') {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-product group border border-border/50 shadow-md hover:shadow-lg hover:border-primary flex flex-row h-auto sm:h-[220px] overflow-hidden bg-white"
        >
          {/* Main Image Section */}
          <div className="w-32 sm:w-1/3 md:w-1/4 min-w-[120px] sm:min-w-[200px] relative bg-secondary">
            <Link to={`/product/${product.slug}`} className="block w-full h-full aspect-[4/3] sm:aspect-auto">
              {product.images && product.images[selectedImage] ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground p-4">
                  <ImageOff className="w-8 h-8 sm:w-12 sm:h-12 mb-2 opacity-50" />
                  <span className="text-[8px] sm:text-[10px] font-medium uppercase tracking-wider opacity-70 text-center">No Image</span>
                </div>
              )}
            </Link>

            {/* Product Badge */}
            {showBadge && badge && BadgeIcon && (
              <div className={`absolute top-2 left-2 sm:top-3 sm:left-3 text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full flex items-center gap-1 ${badge.className}`}>
                <BadgeIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
                <span className="hidden sm:inline">{badge.label}</span>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1 flex flex-col justify-between p-3 sm:p-6 bg-[#FFF5EA]/50">
            <div>
              <div className="flex justify-between items-start mb-2">
                <Link to={`/product/${product.slug}`} className="group/title">
                  <h3 className="font-heading font-bold text-lg sm:text-xl text-[#FA6202] group-hover/title:text-primary transition-colors mb-1">
                    {product.name}
                  </h3>
                </Link>
                {/* Stock Status */}
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0 ${product.isInStock !== false
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                  : "bg-rose-50 text-rose-700 border border-rose-100"
                  }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${product.isInStock !== false ? "bg-emerald-500" : "bg-rose-500"
                    }`} />
                  {product.isInStock !== false ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4 hidden sm:block">
                {product.description || "Experience premium quality and comfort with this product."}
              </p>

              {/* Specs */}
              <div className="flex flex-wrap gap-2 mb-4 hidden sm:flex">
                {Object.entries(product.specs || {}).slice(0, 3).map(([, val], idx) => {
                  const value = typeof val === 'object' && val !== null && 'value' in val ? (val as any).value : val;
                  return (
                    <span key={idx} className="text-xs bg-white px-2 py-1 rounded border border-gray-100 text-gray-600">
                      {value}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 hidden sm:flex">
              {/* Thumbnails */}
              <div className="flex gap-2">
                {product.images.slice(0, 4).map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-10 h-10 rounded-md overflow-hidden cursor-pointer border-2 transition-all duration-200 ${selectedImage === index ? 'border-primary' : 'border-transparent'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={handleQuickView}
                  className="px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary hover:border-primary/30 transition-colors flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Quick View
                </button>
                <button
                  onClick={handleCompare}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors flex items-center gap-2 ${isInCompare(product.productId)
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-primary hover:border-primary/30'
                    }`}
                >
                  <GitCompare className="w-4 h-4" />
                  Compare
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick View Modal */}
        {showQuickView && (
          <QuickViewModal
            product={product}
            onClose={() => setShowQuickView(false)}
          />
        )}
      </>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-product group border border-border/50 shadow-md hover:shadow-lg hover:border-primary"
      >
        {/* Main Image */}
        <Link to={`/product/${product.slug}`} className="block relative aspect-[4/3] overflow-hidden bg-secondary">
          {product.images && product.images[selectedImage] ? (
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground p-4">
              <ImageOff className="w-12 h-12 mb-2 opacity-50" />
              <span className="text-[10px] font-medium uppercase tracking-wider opacity-70">No Image Available</span>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Action Buttons - Bottom Center */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 translate-y-0 sm:translate-y-8 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 transition-all duration-500 ease-out z-10 flex gap-3">
            <button
              onClick={handleQuickView}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-white/50 text-gray-700 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all duration-300 sm:hover:scale-110 relative group/icon"
            >
              <Eye className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.5]" />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/90 text-white text-[10px] font-medium px-2 py-1 rounded-md opacity-0 group-hover/icon:opacity-100 transition-all duration-200 translate-y-2 group-hover/icon:translate-y-0 whitespace-nowrap pointer-events-none shadow-lg hidden sm:block">
                Quick View
                <svg className="absolute text-black/90 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0" /></svg>
              </span>
            </button>

            <button
              onClick={handleCompare}
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full backdrop-blur-md shadow-md border border-white/50 flex items-center justify-center transition-all duration-300 sm:hover:scale-110 relative group/icon ${isInCompare(product.productId)
                ? 'bg-primary text-white border-primary'
                : 'bg-white/90 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200'
                }`}
            >
              <GitCompare className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.5]" />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/90 text-white text-[10px] font-medium px-2 py-1 rounded-md opacity-0 group-hover/icon:opacity-100 transition-all duration-200 translate-y-2 group-hover/icon:translate-y-0 whitespace-nowrap pointer-events-none shadow-lg hidden sm:block">
                Compare
                <svg className="absolute text-black/90 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0" /></svg>
              </span>
            </button>
          </div>

          {/* Share Icon - Top Right with Reveal Effect */}
          <div className="absolute top-3 right-3 z-10">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (navigator.share) {
                  navigator.share({
                    title: product.name,
                    url: window.location.href + `/product/${product.slug}`
                  }).catch(() => { });
                } else {
                  navigator.clipboard.writeText(window.location.origin + `/product/${product.slug}`);
                  toast({ title: "Link copied", description: "Product link copied to clipboard" });
                }
              }}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-white/50 text-gray-700 flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 translate-x-0 sm:translate-x-4 sm:group-hover:translate-x-0 transition-all duration-500 ease-out hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 hover:shadow-md"
              title="Share"
            >
              <Share2 className="w-4 h-4 stroke-[1.5]" />
            </button>
          </div>

          {/* Product Badge */}
          {showBadge && badge && BadgeIcon && (
            <div className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 ${badge.className}`}>
              <BadgeIcon className="w-3 h-3 fill-current" />
              {badge.label}
            </div>
          )}
        </Link>

        <div className="bg-[#FFF5EA]">
          {/* Thumbnail Images & Stock Status */}
          <div className="flex items-center justify-between p-1.5 border-t border-border">
            <div className="flex gap-1">
              {product.images.slice(0, 4).map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-8 h-8 rounded-md overflow-hidden cursor-pointer border-2 transition-all duration-200 ${selectedImage === index ? 'border-primary' : 'border-transparent'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Stock Status */}
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${product.isInStock !== false
              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
              : "bg-rose-50 text-rose-700 border border-rose-100"
              }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${product.isInStock !== false ? "bg-emerald-500" : "bg-rose-500"
                }`} />
              {product.isInStock !== false ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          {/* Product Info */}
          <div className="p-2 pt-0">
            <Link to={`/product/${product.slug}`} className="flex items-center justify-between gap-2 group/title">
              <h3 className="font-heading font-semibold text-xs sm:text-sm text-[#FA6202] truncate group-hover/title:text-primary transition-colors" title={product.name}>
                {product.name}
              </h3>
              {/* Displaying first spec as short info if available */}
              <p className="text-[10px] text-muted-foreground truncate shrink-0 max-w-[40%]">
                {(() => {
                  const firstSpec = Object.values(product.specs || {})[0];
                  if (!firstSpec) return "";
                  if (typeof firstSpec === 'string') return firstSpec;
                  if (typeof firstSpec === 'object' && firstSpec !== null && 'value' in firstSpec) return (firstSpec as any).value;
                  return "";
                })()}
              </p>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Quick View Modal */}
      {showQuickView && (
        <QuickViewModal
          product={product}
          onClose={() => setShowQuickView(false)}
        />
      )}
    </>
  );
};

export default ProductCard;
