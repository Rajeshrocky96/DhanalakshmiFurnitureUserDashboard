import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { LayoutGrid, List } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BreadcrumbNav from "@/components/ui/BreadcrumbNav";
import ProductCard from "@/components/product/ProductCard";
import CompareBar from "@/components/compare/CompareBar";
import { fetchProducts } from "@/services/api";
import { Product } from "@/types/api";

const ProductsPage = () => {
    const [searchParams] = useSearchParams();
    const filterType = searchParams.get("filter");
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const data = await fetchProducts();
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const { filteredProducts, title, description } = useMemo(() => {
        let filtered = products.filter(p => p.isActive);
        let pageTitle = "All Products";
        let pageDesc = "Browse our extensive collection of furniture and appliances.";

        switch (filterType) {
            case "new-arrivals":
                filtered = filtered.filter(p => p.isNewArrival);
                pageTitle = "New Arrivals";
                pageDesc = "Check out the latest additions to our collection.";
                break;
            case "best-sellers":
                filtered = filtered.filter(p => p.isBestSeller);
                pageTitle = "Best Sellers";
                pageDesc = "Our most popular products loved by customers.";
                break;
            case "special-offers":
                filtered = filtered.filter(p => p.isOnOffer);
                pageTitle = "Special Offers";
                pageDesc = "Grab these deals before they're gone.";
                break;
            case "trending":
                filtered = filtered.filter(p => p.isTrending);
                pageTitle = "Trending Items";
                pageDesc = "See what's popular right now.";
                break;
            case "recommended":
                filtered = filtered.filter(p => p.isRecommended);
                pageTitle = "Recommended For You";
                pageDesc = "Handpicked items we think you'll love.";
                break;
            default:
                break;
        }

        return { filteredProducts: filtered, title: pageTitle, description: pageDesc };
    }, [products, filterType]);

    const breadcrumbItems = [
        { label: title },
    ];

    return (
        <>
            <Helmet>
                <title>{title} - Dhanalakshmi Furnitures</title>
                <meta name="description" content={description} />
            </Helmet>

            <div className="min-h-screen flex flex-col">
                <Header />

                <main className="flex-1 pt-20">
                    <div className="container-custom py-4 sm:py-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <h1 className="font-heading font-extrabold text-2xl sm:text-3xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 tracking-tight">
                                    {title}
                                </h1>
                                <p className="text-muted-foreground mt-1 text-sm sm:text-base max-w-2xl leading-relaxed">
                                    {description}
                                </p>
                            </motion.div>
                            <div className="flex items-center gap-4 shrink-0">
                                <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}
                                        title="Grid View"
                                    >
                                        <LayoutGrid className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}
                                        title="List View"
                                    >
                                        <List className="w-4 h-4" />
                                    </button>
                                </div>
                                <BreadcrumbNav items={breadcrumbItems} />
                            </div>
                        </div>

                        {loading ? (
                            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'}`}>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                    <div key={i} className={`bg-secondary animate-pulse rounded-lg ${viewMode === 'grid' ? 'aspect-[3/4]' : 'h-48'}`}></div>
                                ))}
                            </div>
                        ) : (
                            <>
                                {filteredProducts.length > 0 ? (
                                    <div className={`gap-4 ${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'flex flex-col space-y-4'}`}>
                                        {filteredProducts.map((product, index) => (
                                            <motion.div
                                                key={product.productId}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <ProductCard product={product} layout={viewMode} />
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-muted-foreground">No products found for this category.</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </main>

                <Footer />
                <CompareBar />
            </div>
        </>
    );
};

export default ProductsPage;
