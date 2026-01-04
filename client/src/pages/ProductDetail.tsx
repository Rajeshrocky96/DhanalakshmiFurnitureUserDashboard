import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Star, ChevronLeft, ChevronRight, Share2, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BreadcrumbNav from "@/components/ui/BreadcrumbNav";
import CompareBar from "@/components/compare/CompareBar";
import { Loader } from "@/components/ui/loader";

import { useToast } from "@/hooks/use-toast";
import { fetchProductBySlug, fetchCategories } from "@/services/api";
import { Product, Category } from "@/types/api";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>(); // id is actually slug now based on routes
  const [currentImage, setCurrentImage] = useState(0);

  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const productData = await fetchProductBySlug(id);
        setProduct(productData);

        // Fetch category to get name
        if (productData) {
          const categories = await fetchCategories();
          const foundCategory = categories.find(c => c.categoryId === productData.categoryId);
          setCategory(foundCategory || null);
        }
      } catch (error) {
        console.error("Failed to fetch product data:", error);
      } finally {
        setLoading(false);
      }
    };

    window.scrollTo(0, 0);
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <Loader fullScreen />
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container-custom py-12">
          <h1 className="font-heading font-bold text-2xl">Product not found</h1>
        </main>
        <Footer />
      </div>
    );
  }

  const handleEnquiry = () => {
    const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER;

    // Use the backend endpoint to serve the image
    // This converts Base64 to a serveable URL
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:30038';
    const imageLinkForMessage = `${apiUrl}/api/products/${id}/image`;

    const message = `Hello 👋\n\nI am interested in the following product:\n\n🛋️ Product: ${product.name}\n🔗 Product Link: ${window.location.href}\n🖼️ Image: ${imageLinkForMessage}\n\nPlease share price, availability, and more details.\n\nThank you.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.name,
          url: window.location.href,
        });
      } catch (err) {

      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Product link copied to clipboard",
      });
    }
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  // Determine parent category for breadcrumb
  const breadcrumbItems = [
    { label: category?.name || "Category", path: category ? `/category/${category.slug}` : "#" },
    { label: product.name },
  ];

  return (
    <>
      <Helmet>
        <title>{product.name} - Dhanalakshmi Furnitures</title>
        <meta name="description" content={product.name} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 bg-gray-50/30 pt-16">
          <div className="container-custom py-6">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-border/40 pb-4">
              <div className="flex items-center gap-2">
                <Link to={category ? `/category/${category.slug}` : "/products"} className="p-2 rounded-full hover:bg-secondary transition-colors md:hidden">
                  <ChevronLeft className="w-5 h-5" />
                </Link>
                <div className="hidden md:block">
                </div>
              </div>

              <div className="w-full md:w-auto flex justify-end">
                <BreadcrumbNav items={breadcrumbItems} />
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 pb-12">
              {/* Image Gallery */}
              <div className="flex gap-4 relative z-20 h-fit">
                {/* Thumbnails - Left Side */}
                <div className="hidden sm:flex flex-col gap-3 h-[400px] overflow-y-auto no-scrollbar py-1">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onMouseEnter={() => setCurrentImage(index)}
                      className={`w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${currentImage === index
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-transparent hover:border-primary/50 bg-white"
                        }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                {/* Main Image */}
                <div className="flex-1 relative">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white border border-border/50 shadow-sm cursor-crosshair group"
                    onMouseMove={(e) => {
                      const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
                      const x = ((e.clientX - left) / width) * 100;
                      const y = ((e.clientY - top) / height) * 100;
                      e.currentTarget.style.setProperty('--zoom-x', `${x}%`);
                      e.currentTarget.style.setProperty('--zoom-y', `${y}%`);
                    }}
                  >
                    <img
                      src={product.images[currentImage]}
                      alt={product.name}
                      className="w-full h-full object-contain p-6"
                    />

                    {/* Zoom Lens/Overlay */}
                    <div className="absolute inset-0 bg-transparent group-hover:bg-black/5 transition-colors pointer-events-none" />

                    {product.images.length > 1 && (
                      <>
                        <button
                          onClick={(e) => { e.stopPropagation(); prevImage(); }}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors z-10 sm:hidden shadow-md border border-gray-100"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); nextImage(); }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors z-10 sm:hidden shadow-md border border-gray-100"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}

                    {product.isBestSeller && (
                      <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 z-10 shadow-lg shadow-primary/20">
                        <Star className="w-3 h-3 fill-current" />
                        Best Seller
                      </div>
                    )}

                    {/* Zoom Result Portal */}
                    <div
                      className="hidden group-hover:block absolute top-0 left-[103%] w-[120%] h-[100%] bg-white border border-border rounded-2xl shadow-2xl z-50 overflow-hidden"
                      style={{
                        backgroundImage: `url(${product.images[currentImage]})`,
                        backgroundPosition: 'var(--zoom-x) var(--zoom-y)',
                        backgroundSize: '250%',
                        backgroundRepeat: 'no-repeat'
                      }}
                    />
                  </motion.div>

                  {/* Mobile Thumbnails (Horizontal) */}
                  <div className="flex sm:hidden gap-3 mt-4 overflow-x-auto pb-2 no-scrollbar">
                    {product.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImage(index)}
                        className={`w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${currentImage === index
                          ? "border-primary"
                          : "border-transparent hover:border-primary/50 bg-white"
                          }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="flex flex-col pt-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-gray-900 leading-tight mb-4">
                    {product.name}
                  </h1>

                  {/* Stock Status */}
                  <div className="flex items-center gap-3 mb-6">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${(product.isInStock ?? true)
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                      : "bg-red-100 text-red-700 border border-red-200"
                      }`}>
                      {(product.isInStock ?? true) ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>

                  {/* Description */}
                  <div className="mb-8">
                    <h3 className="font-heading font-semibold text-base text-gray-900 mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {product.description || product.offerText || "Experience premium quality and comfort with this product. Designed to enhance your living space with style and durability."}
                    </p>
                  </div>

                  {/* Specifications */}
                  <div className="mb-8">
                    <h3 className="font-heading font-semibold text-base text-gray-900 mb-3">Specifications</h3>
                    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                        {product.specs && Object.entries(product.specs).map(([key, value]) => {
                          const displayValue = typeof value === 'object' && value !== null && 'value' in value ? (value as any).value : value;
                          if (!displayValue) return null;
                          return (
                            <div key={key} className="flex flex-col border-b border-gray-50 last:border-0 pb-2 last:pb-0">
                              <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">{key}</span>
                              <span className="text-sm font-semibold text-gray-800">{displayValue}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Custom Order Note */}
                  {product.isCustomOrder && (
                    <div className="mb-8 p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg h-fit">
                        <MessageCircle className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-blue-900 mb-1">Customization Available</h4>
                        <p className="text-xs text-blue-700">
                          This product can be customized to your specific requirements. Contact us for more details.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-auto">
                    <button
                      onClick={handleEnquiry}
                      className="flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-green-500/25 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Enquire on WhatsApp
                    </button>

                    <button
                      onClick={handleShare}
                      className="flex-none px-4 py-3.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Share2 className="w-5 h-5" />
                      <span className="hidden sm:inline">Share</span>
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
        <CompareBar />

        {/* Sticky Enquire Button - Mobile */}
        <div className="fixed bottom-0 left-0 right-0 p-4 lg:hidden bg-white border-t border-gray-100 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <button
            onClick={handleEnquiry}
            className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 text-base"
          >
            <MessageCircle className="w-5 h-5" />
            Enquire on WhatsApp
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
