import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSlider from "@/components/home/HeroSlider";
import CategoryCircles from "@/components/home/CategoryCircles";
import OfferBanners from "@/components/home/OfferBanners";
import CompareBar from "@/components/compare/CompareBar";
import ProductSection from "@/components/home/ProductSection";
import ProductPromo from "@/components/home/ProductPromo";
import MiddleBanners from "@/components/home/MiddleBanners";
import BottomBanners from "@/components/home/BottomBanners";
import EmptyStateShowcase from "@/components/home/EmptyStateShowcase";
import TrendingShowcase from "@/components/home/TrendingShowcase";
import ShopByRoom from "@/components/home/ShopByRoom";
import RecommendedShowcase from "@/components/home/RecommendedShowcase";
import TrustBadges from "@/components/home/TrustBadges";
import BrandMarquee from "@/components/home/BrandMarquee";
import BestSellersMarquee from "@/components/home/BestSellersMarquee";
import FloatingEnquiry from "@/components/home/FloatingEnquiry";
import { fetchProducts } from "@/services/api";
import { Product } from "@/types/api";

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const newArrivals = products.filter(p => p.isNewArrival && p.isActive);
  const trendingItems = products.filter(p => p.isTrending && p.isActive);
  const bestSellers = products.filter(p => p.isBestSeller && p.isActive);
  const recommendedItems = products.filter(p => p.isRecommended && p.isActive);
  const specialOffers = products.filter(p => p.isOnOffer && p.isActive);

  return (
    <>
      <Helmet>
        <title>Dhanalakshmi Furnitures - Premium Furniture & Home Appliances</title>
        <meta
          name="description"
          content="Discover premium furniture and home appliances at Dhanalakshmi Furnitures. Shop wooden cots, sofas, mattresses, fans, fridges and more. Quality products at affordable prices."
        />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-grow">
          <HeroSlider />

          {!loading && products.length === 0 && <EmptyStateShowcase />}

          <ProductSection
            title="New Arrivals"
            subtitle="Latest additions to our collection"
            products={newArrivals}
            viewAllLink="/products?filter=new-arrivals"
            loading={loading}
          />

          <div className="mb-8">
            <MiddleBanners />
          </div>

          <TrendingShowcase products={trendingItems} loading={loading} />

          {(loading || products.length > 0) && <CategoryCircles />}

          <OfferBanners />

          <BestSellersMarquee products={bestSellers} loading={loading} />

          <ShopByRoom products={products} />

          <RecommendedShowcase products={recommendedItems} />

          <BottomBanners />

          <ProductSection
            title="Special Offers"
            subtitle="Limited time deals"
            products={specialOffers}
            viewAllLink="/products?filter=special-offers"
            loading={loading}
            showBadge={true}
          />

          <ProductPromo />

          <BrandMarquee />

          <TrustBadges />
        </main>

        <FloatingEnquiry />

        <Footer />
        <CompareBar />
      </div>
    </>
  );
};

export default Index;
