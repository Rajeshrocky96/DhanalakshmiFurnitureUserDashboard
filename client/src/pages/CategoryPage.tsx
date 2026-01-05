import { useState, useMemo, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Filter, X, ChevronDown, LayoutGrid, List } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BreadcrumbNav from "@/components/ui/BreadcrumbNav";
import ProductCard from "@/components/product/ProductCard";
import CompareBar from "@/components/compare/CompareBar";
import { fetchCategories, fetchSubcategories, fetchProducts, fetchBanners } from "@/services/api";
import { Category, Subcategory, Product, Banner } from "@/types/api";
import BannerSlider from "@/components/ui/BannerSlider";
import { useBannerNavigation } from "@/hooks/useBannerNavigation";
import { Loader } from "@/components/ui/loader";

const getSpecValue = (val: any): string => {
  if (!val) return "";
  if (typeof val === 'string') return val;
  if (typeof val === 'object' && val !== null && 'value' in val) return val.value;
  return "";
};

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { handleBannerClick } = useBannerNavigation();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [allBanners, setAllBanners] = useState<Banner[]>([]);
  const [displayedBanners, setDisplayedBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [filters, setFilters] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, subs, prods, bannersData] = await Promise.all([
          fetchCategories(),
          fetchSubcategories(),
          fetchProducts(),
          fetchBanners()
        ]);
        const currentCategory = cats.find(c => c.slug === slug || c.categoryId === slug);
        setCategory(currentCategory || null);

        if (currentCategory) {
          const categorySubs = subs.filter(s => s.PK === `CATEGORY#${currentCategory.categoryId}`);
          setSubcategories(categorySubs);
          setAllBanners(bannersData);
        }
        setProducts(prods);
      } catch (error) {
        console.error("Failed to fetch category data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [slug]);

  // Filter banners when category or subcategory changes
  useEffect(() => {
    if (!category) return;

    let filtered = [];
    if (selectedSubcategory) {
      // Show SUBCATEGORY_TOP banners
      const sub = subcategories.find(s => s.slug === selectedSubcategory || s.subcategoryId === selectedSubcategory);

      filtered = allBanners.filter(b =>
        b.isActive && (
          (b.position === 'SUBCATEGORY_TOP' && (
            (sub && b.subcategoryId === sub.subcategoryId) ||
            b.redirectValue === selectedSubcategory ||
            (sub && b.redirectValue === sub.subcategoryId)
          )) ||
          (b.position === 'CATEGORY_TOP' && b.redirectType === 'SUBCATEGORY' && (
            b.redirectValue === selectedSubcategory ||
            (sub && b.redirectValue === sub.subcategoryId)
          ))
        )
      );
    } else {
      // Show CATEGORY_TOP banners
      filtered = allBanners.filter(b =>
        b.position === 'CATEGORY_TOP' &&
        b.isActive &&
        (b.categoryId === category.categoryId || b.redirectValue === category.categoryId || b.redirectValue === category.slug)
      );
    }

    setDisplayedBanners(filtered.sort((a, b) => a.order - b.order));
  }, [category, selectedSubcategory, allBanners, subcategories]);

  useEffect(() => {
    const subcategoryParam = searchParams.get("subcategory");

    if (subcategoryParam) {
      setSelectedSubcategory(subcategoryParam);
    } else {
      setSelectedSubcategory(null);
    }
  }, [searchParams]);

  // Get products for this category
  const categoryProducts = useMemo(() => {
    if (!category) return [];
    return products.filter((p) =>
      p.categoryId === category.categoryId
    );
  }, [category, products]);

  // Extract filter options from products dynamically
  const filterOptions = useMemo(() => {
    const options: Record<string, Set<string>> = {};

    categoryProducts.forEach((p) => {
      if (p.specs) {
        Object.entries(p.specs).forEach(([key, val]) => {
          const value = getSpecValue(val);
          if (value) {
            // Capitalize key for display
            const displayKey = key.charAt(0).toUpperCase() + key.slice(1);
            if (!options[displayKey]) {
              options[displayKey] = new Set();
            }
            options[displayKey].add(value);
          }
        });
      }
    });

    // Convert Sets to Arrays and sort
    const result: Record<string, string[]> = {};
    Object.entries(options).forEach(([key, values]) => {
      result[key] = Array.from(values).sort();
    });

    return result;
  }, [categoryProducts]);

  // Apply filters
  const filteredProducts = useMemo(() => {
    return categoryProducts.filter((product) => {
      if (selectedSubcategory) {
        const sub = subcategories.find(s => s.slug === selectedSubcategory || s.subcategoryId === selectedSubcategory);
        if (sub && product.subcategoryId !== sub.subcategoryId) return false;
        // Fallback if sub not found but slug matches (less likely with ID check)
        if (!sub && product.slug !== selectedSubcategory) return false;
      }

      // Dynamic spec filtering
      for (const [key, selectedValues] of Object.entries(filters)) {
        if (selectedValues.length > 0) {
          // We need to find the matching spec key in the product (case-insensitive check might be safer)
          const productSpecKey = Object.keys(product.specs || {}).find(k => k.toLowerCase() === key.toLowerCase());

          if (!productSpecKey) return false; // Product doesn't have this spec

          const productValue = getSpecValue(product.specs![productSpecKey]);
          if (!productValue || !selectedValues.includes(productValue)) {
            return false;
          }
        }
      }

      return true;
    });
  }, [categoryProducts, filters, selectedSubcategory, subcategories]);

  const toggleFilter = (type: string, value: string) => {
    setFilters((prev) => {
      const current = prev[type] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];

      // Clean up empty filter arrays
      if (updated.length === 0) {
        const { [type]: _, ...rest } = prev;
        return rest;
      }

      return { ...prev, [type]: updated };
    });
  };

  const clearFilters = () => {
    setFilters({});
  };

  const activeFiltersCount = Object.values(filters).flat().length;

  const breadcrumbItems = [
    { label: category?.name || slug || "" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <Loader fullScreen />
        <Footer />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container-custom py-12">
          <h1 className="font-heading font-bold text-2xl">Category not found</h1>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{category.name} - Dhanalakshmi Furnitures</title>
        <meta
          name="description"
          content={`Shop premium ${category.name} at Dhanalakshmi Furnitures. Best quality, affordable prices. Enquire now!`}
        />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 pt-16">
          <div className="container-custom py-4 sm:py-6">

            {/* Category Header with Banners */}
            <div className="mb-4">
              {displayedBanners.length > 0 ? (
                <>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <h1 className="font-heading font-extrabold text-2xl sm:text-3xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 tracking-tight">
                        {category?.name}
                      </h1>
                    </motion.div>
                    <div className="shrink-0">
                      <BreadcrumbNav items={breadcrumbItems} />
                    </div>
                  </div>
                  {displayedBanners.length === 2 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {displayedBanners.map((banner) => (
                        <div
                          key={banner.bannerId}
                          className="relative w-full overflow-hidden rounded-xl shadow-lg group aspect-[16/9] md:aspect-[21/9] cursor-pointer"
                          onClick={() => handleBannerClick(banner)}
                        >
                          <img
                            src={banner.image}
                            alt={banner.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/0 hover:bg-black/5 transition-colors duration-300" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mb-4">
                      <BannerSlider banners={displayedBanners} aspectRatio="aspect-[2.5/1] sm:aspect-[4/1]" />
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h1 className="font-heading font-extrabold text-2xl sm:text-3xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 tracking-tight">
                      {category?.name}
                    </h1>
                  </motion.div>
                  <div className="shrink-0">
                    <BreadcrumbNav items={breadcrumbItems} />
                  </div>
                </div>
              )}


            </div>

            {/* Controls Bar: Subcategories + View Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex-1 min-w-0">
                {subcategories.length > 0 && filteredProducts.length > 0 && (
                  <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedSubcategory(null);
                        const newParams = new URLSearchParams(searchParams);
                        newParams.delete("subcategory");
                        setSearchParams(newParams);
                      }}
                      className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${selectedSubcategory === null
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        }`}
                    >
                      All
                    </motion.button>
                    {subcategories.map((sub) => {
                      const isSelected = selectedSubcategory === sub.slug || selectedSubcategory === sub.subcategoryId;
                      return (
                        <motion.button
                          key={sub.subcategoryId}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            const newValue = isSelected ? null : sub.slug;
                            setSelectedSubcategory(newValue);

                            const newParams = new URLSearchParams(searchParams);
                            if (newValue) {
                              newParams.set("subcategory", newValue);
                            } else {
                              newParams.delete("subcategory");
                            }
                            setSearchParams(newParams);
                          }}
                          className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            }`}
                        >
                          {sub.name}
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* View Toggle */}
              {filteredProducts.length > 0 && (
                <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1 flex-shrink-0 ml-auto sm:ml-0">
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
              )}
            </div>

            <div className="flex gap-8">
              {/* Filters Sidebar - Desktop */}
              {filteredProducts.length > 0 && (
                <aside className="hidden lg:block w-64 flex-shrink-0">
                  <div className="filter-section sticky top-24">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-heading font-semibold text-lg">Filters</h3>
                      {activeFiltersCount > 0 && (
                        <button
                          onClick={clearFilters}
                          className="text-sm text-primary hover:underline"
                        >
                          Clear all
                        </button>
                      )}
                    </div>

                    {Object.entries(filterOptions).map(([key, options]) => (
                      <FilterSection
                        key={key}
                        title={key}
                        options={options}
                        selected={filters[key] || []}
                        onToggle={(value) => toggleFilter(key, value)}
                      />
                    ))}
                  </div>
                </aside>
              )}

              {/* Products Grid */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  {/* Mobile Filter Button */}
                  {filteredProducts.length > 0 && (
                    <button
                      onClick={() => setShowFilters(true)}
                      className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-secondary transition-colors"
                    >
                      <Filter className="w-4 h-4" />
                      Filters
                      {activeFiltersCount > 0 && (
                        <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                          {activeFiltersCount}
                        </span>
                      )}
                    </button>
                  )}

                  {/* View Toggle - Moved to top */}
                </div>

                {/* Products */}
                <motion.div layout className={`gap-2 sm:gap-6 pb-12 ${viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3' : 'flex flex-col space-y-4'}`}>
                  <AnimatePresence>
                    {filteredProducts.map((product, index) => (
                      <motion.div
                        layout
                        key={product.productId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <ProductCard product={product} layout={viewMode} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No products match your filters.</p>
                    <button
                      onClick={clearFilters}
                      className="mt-4 text-primary hover:underline"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer />
        <CompareBar />

        {/* Mobile Filters Modal */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 lg:hidden"
              style={{ background: "hsla(222, 47%, 11%, 0.6)" }}
              onClick={() => setShowFilters(false)}
            >
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.3 }}
                className="absolute left-0 top-0 bottom-0 w-80 max-w-full bg-background overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h3 className="font-heading font-semibold text-lg">Filters</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 rounded-lg hover:bg-secondary"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-4">
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-primary hover:underline mb-4"
                    >
                      Clear all filters
                    </button>
                  )}

                  {Object.entries(filterOptions).map(([key, options]) => (
                    <FilterSection
                      key={key}
                      title={key}
                      options={options}
                      selected={filters[key] || []}
                      onToggle={(value) => toggleFilter(key, value)}
                    />
                  ))}
                </div>

                <div className="p-4 border-t border-border">
                  <button
                    onClick={() => setShowFilters(false)}
                    className="btn-primary w-full"
                  >
                    Apply Filters ({filteredProducts.length} products)
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

// Filter Section Component
const FilterSection = ({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(true);

  if (options.length === 0) return null;

  return (
    <div className="mb-2 last:mb-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left py-2 px-2 hover:bg-secondary/50 rounded-lg transition-colors group"
      >
        <span className="font-semibold text-foreground text-sm uppercase tracking-wide group-hover:text-primary transition-colors">{title}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-1 pb-2 px-2 space-y-1">
              {options.map((option) => {
                const isSelected = selected.includes(option);
                return (
                  <label
                    key={option}
                    className={`flex items-center gap-3 cursor-pointer group p-2 transition-all duration-200 ${isSelected ? "bg-primary/5" : "hover:bg-secondary/50"
                      }`}
                  >
                    <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${isSelected ? "bg-primary border-primary" : "border-muted-foreground/40 group-hover:border-primary"
                      }`}>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 bg-primary-foreground"
                        />
                      )}
                    </div>
                    <span className={`text-sm transition-colors ${isSelected ? "text-foreground font-medium" : "text-muted-foreground group-hover:text-foreground"
                      }`}>
                      {option}
                    </span>
                    {/* Hidden checkbox for accessibility */}
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggle(option)}
                      className="hidden"
                    />
                  </label>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryPage;
