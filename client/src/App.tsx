import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CompareProvider } from "@/context/CompareContext";
import Index from "./pages/Index";
import ProductsPage from "./pages/ProductsPage";
import SectionPage from "./pages/SectionPage";
import CategoryPage from "./pages/CategoryPage";
import ProductDetail from "./pages/ProductDetail";
import ComparePage from "./pages/ComparePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/section/:slug" element={<SectionPage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/category/:category/product/:id" element={<ProductDetail />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <CompareProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </CompareProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
