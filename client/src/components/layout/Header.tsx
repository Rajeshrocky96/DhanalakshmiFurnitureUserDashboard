import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, MapPin, ChevronDown, Search, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchCategories, fetchSubcategories, fetchSections, fetchProducts } from "@/services/api";
import { Section, Category, Subcategory, Product } from "@/types/api";



const Header = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [arrowLeft, setArrowLeft] = useState<number | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  const mapLink = import.meta.env.VITE_MAP_LINK || "#";
  const [sections, setSections] = useState<Section[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // Search State
  const [showSuggestions, setShowSuggestions] = useState(false);
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const [searchResults, setSearchResults] = useState<{
    categories: Category[];
    subcategories: (Subcategory & { parentSlug?: string })[];
    products: Product[];
  }>({ categories: [], subcategories: [], products: [] });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, subs, secs, prods] = await Promise.all([
          fetchCategories(),
          fetchSubcategories(),
          fetchSections(),
          fetchProducts()
        ]);
        setCategories(cats);
        setSubcategories(subs);
        setSections(secs);
        setProducts(prods);
      } catch (error) {
        console.error("Failed to fetch header data:", error);
      }
    };
    loadData();
  }, []);

  // Search Logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ categories: [], subcategories: [], products: [] });
      return;
    }
    const query = searchQuery.toLowerCase();

    const matchedCats = categories.filter(c => c.name.toLowerCase().includes(query)).slice(0, 3);

    const matchedSubs = subcategories
      .filter(s => s.name.toLowerCase().includes(query))
      .map(s => {
        const catId = s.PK.split('#')[1];
        const parentCat = categories.find(c => c.categoryId === catId);
        return { ...s, parentSlug: parentCat?.slug };
      })
      .filter(s => s.parentSlug)
      .slice(0, 3);

    const matchedProducts = products.filter(p => p.name.toLowerCase().includes(query)).slice(0, 5);

    setSearchResults({ categories: matchedCats, subcategories: matchedSubs as any, products: matchedProducts });
  }, [searchQuery, categories, subcategories, products]);

  // Close search on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutsideDesktop = desktopSearchRef.current && !desktopSearchRef.current.contains(event.target as Node);
      const isOutsideMobile = mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node);

      if (isOutsideDesktop && isOutsideMobile) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchNavigation = (url: string) => {
    navigate(url);
    setShowSuggestions(false);
    setSearchQuery("");
  };

  // --- Filtering Logic ---

  // 1. Get active subcategories for a category
  const getActiveSubcategories = (categoryId: string) => {
    return subcategories
      .filter(s => s.isActive && s.PK === `CATEGORY#${categoryId}`)
      .sort((a, b) => a.order - b.order);
  };

  // 2. Get active categories for a section (must have at least one active subcategory)
  const getActiveCategories = (sectionId: string) => {
    return categories
      .filter(c => {
        if (!c.isActive || c.sectionId !== sectionId) return false;
        const subs = getActiveSubcategories(c.categoryId);
        return subs.length > 0;
      })
      .sort((a, b) => a.order - b.order);
  };

  // 3. Get active sections (must have at least one active category)
  const activeSections = useMemo(() => {
    return sections
      .filter(s => {
        if (!s.isActive) return false;
        const cats = getActiveCategories(s.sectionId);
        return cats.length > 0;
      })
      .sort((a, b) => a.order - b.order);
  }, [sections, categories, subcategories]);


  const handleEnquireClick = () => {
    const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "917448856172";
    const message = encodeURIComponent("Hello, I have interested in your products. Can you please provide more details?");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-transparent transition-all duration-300">
      {/* Main Header Container */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">

          {/* Left Pill: Logo + Navigation */}
          <div className="flex items-center bg-white rounded-full px-2 py-1.5 sm:px-4 sm:py-2 shadow-lg gap-4 sm:gap-6 relative group/nav">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
                <img src="/ds-logo.png" alt="DS Logo" className="w-full h-full object-cover" />
              </div>
              <div className="hidden lg:block">
                <h1 className="font-heading font-bold text-base text-primary leading-tight">
                  Dhanalakshmi
                </h1>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav
              id="nav-scroll-container"
              className="hidden lg:flex items-center gap-6 overflow-x-auto no-scrollbar scrollbar-hide scroll-smooth"
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              {activeSections.map((section) => (
                <div
                  key={section.sectionId}
                  className="group/item h-full flex items-center py-1"
                  onMouseEnter={(e) => {
                    setIsDropdownOpen(true);
                    setHoveredCategory(section.slug);
                    const rect = e.currentTarget.getBoundingClientRect();
                    setArrowLeft(rect.left + rect.width / 2);
                  }}
                >
                  <Link
                    to={`/section/${section.slug}`}
                    className={`flex-shrink-0 text-sm font-medium transition-colors whitespace-nowrap inline-flex items-center gap-1 ${hoveredCategory === section.slug && isDropdownOpen
                      ? "text-primary"
                      : "text-gray-600 hover:text-primary"
                      }`}
                  >
                    {section.name}
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${hoveredCategory === section.slug && isDropdownOpen ? "rotate-180" : ""}`} />
                  </Link>
                </div>
              ))}
            </nav>
          </div>

          {/* Right Pill: Search + Actions */}
          <div className="flex items-center bg-white rounded-full px-2 py-1.5 sm:px-4 sm:py-2 shadow-lg gap-2 sm:gap-4">

            {/* Search Bar (Compact) */}
            <div ref={desktopSearchRef} className="hidden md:block relative w-48 lg:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full pl-9 pr-4 py-1.5 rounded-full border border-gray-200 bg-gray-100 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm"
              />

              {/* Search Suggestions Dropdown */}
              <AnimatePresence>
                {showSuggestions && searchQuery.trim().length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-2 w-[300px] lg:w-[400px] bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                  >
                    <div className="max-h-[70vh] overflow-y-auto py-2">
                      {/* No Results */}
                      {searchResults.categories.length === 0 && searchResults.subcategories.length === 0 && searchResults.products.length === 0 && (
                        <div className="px-4 py-3 text-sm text-gray-500 text-center">
                          No results found for "{searchQuery}"
                        </div>
                      )}

                      {/* Categories */}
                      {searchResults.categories.length > 0 && (
                        <div className="mb-2">
                          <h4 className="px-4 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/50">Categories</h4>
                          <ul>
                            {searchResults.categories.map(cat => (
                              <li key={cat.categoryId}>
                                <button
                                  onClick={() => handleSearchNavigation(`/category/${cat.slug}`)}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary flex items-center justify-between group"
                                >
                                  <span>{cat.name}</span>
                                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Subcategories */}
                      {searchResults.subcategories.length > 0 && (
                        <div className="mb-2">
                          <h4 className="px-4 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/50">Subcategories</h4>
                          <ul>
                            {searchResults.subcategories.map(sub => (
                              <li key={sub.subcategoryId}>
                                <button
                                  onClick={() => handleSearchNavigation(`/category/${sub.parentSlug}?subcategory=${encodeURIComponent(sub.slug)}`)}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary flex items-center justify-between group"
                                >
                                  <span>{sub.name}</span>
                                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Products */}
                      {searchResults.products.length > 0 && (
                        <div>
                          <h4 className="px-4 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/50">Products</h4>
                          <ul>
                            {searchResults.products.map(prod => (
                              <li key={prod.productId}>
                                <button
                                  onClick={() => handleSearchNavigation(`/product/${prod.slug}`)}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary flex items-center gap-3 group"
                                >
                                  <div className="w-8 h-8 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                                    {prod.images && prod.images[0] && (
                                      <img src={prod.images[0]} alt="" className="w-full h-full object-cover" />
                                    )}
                                  </div>
                                  <span className="truncate">{prod.name}</span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Enquire Button (Icon Only) */}
            <button
              onClick={handleEnquireClick}
              className="sm:hidden p-2 rounded-full hover:bg-gray-100 text-emerald-600"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </button>

            {/* Visit Showroom Link */}
            <a
              href={mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden xl:flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-primary transition-colors"
            >
              <div className="p-1.5 rounded-full bg-gray-100">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <span className="whitespace-nowrap">Visit</span>
            </a>

            {/* Enquire Button (Desktop) */}
            <button
              onClick={handleEnquireClick}
              className="hidden sm:inline-flex bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-5 rounded-full text-sm items-center gap-2 flex-shrink-0 transition-all shadow-md hover:shadow-lg"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              <span className="whitespace-nowrap font-semibold">Enquire Now</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-full hover:bg-gray-100 text-gray-600"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>


      {/* Mega Menu Dropdown */}
      <AnimatePresence>
        {isDropdownOpen && hoveredCategory && (
          <div className="absolute top-full left-0 w-full z-50">
            {/* Arrow - Positioned relative to the nav item */}
            <motion.div
              key="arrow"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="absolute -top-[6px] w-4 h-4 bg-white border-t border-l border-gray-200 rotate-45 transform -translate-x-1/2 z-51 shadow-[-2px_-2px_5px_rgba(0,0,0,0.05)]"
              style={{ left: arrowLeft ?? '50%' }}
            />

            {/* Menu Content */}
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="w-full bg-white border-b border-gray-200 shadow-xl"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <div className="w-full px-4 sm:px-6 lg:px-8 py-6 bg-white">
                {sections.find(s => s.slug === hoveredCategory) && (
                  <div className="flex gap-8 max-w-7xl mx-auto">
                    {/* Left Side: Section Image */}
                    <div className="w-56 flex-shrink-0">
                      <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-md relative group cursor-pointer">
                        <img
                          src={sections.find(s => s.slug === hoveredCategory)?.image}
                          alt={sections.find(s => s.slug === hoveredCategory)?.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h2 className="font-heading font-bold text-lg text-white mb-1 drop-shadow-md">
                            {sections.find(s => s.slug === hoveredCategory)?.name}
                          </h2>
                          <Link
                            to={`/section/${hoveredCategory}`}
                            className="text-white/90 text-xs font-medium hover:text-white hover:underline inline-flex items-center gap-1"
                          >
                            Shop All Collection <ChevronDown className="w-3 h-3 -rotate-90" />
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Right Side: Categories & Subcategories Grid */}
                    <div className="flex-1">
                      <div className="grid grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-8">
                        {getActiveCategories(sections.find(s => s.slug === hoveredCategory)!.sectionId).map((cat) => (
                          <div key={cat.categoryId} className="space-y-3">
                            {/* Category Title */}
                            <Link
                              to={`/category/${cat.slug}`}
                              className="block font-heading font-bold text-sm text-primary hover:text-primary/80 transition-colors border-b border-gray-100 pb-2 pl-2 border-l-4 border-primary"
                            >
                              {cat.name}
                            </Link>

                            {/* Subcategories List */}
                            <ul className="space-y-1.5">
                              {getActiveSubcategories(cat.categoryId).map((sub) => (
                                <li key={sub.subcategoryId}>
                                  <Link
                                    to={`/category/${cat.slug}?subcategory=${encodeURIComponent(sub.slug)}`}
                                    className="text-xs text-gray-500 hover:text-primary hover:translate-x-1 transition-all inline-block"
                                  >
                                    {sub.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/10 bg-primary overflow-hidden"
          >
            <nav className="w-full px-4 py-4 flex flex-col gap-2">
              <Link
                to="/"
                className="py-2 px-4 rounded-lg hover:bg-white/10 text-white transition-colors font-medium text-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>

              <div className="py-2 px-4">
                <p className="text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">Sections</p>
                <div className="flex flex-col gap-1 ml-2">
                  {activeSections.map((section) => (
                    <Link
                      key={section.sectionId}
                      to={`/section/${section.slug}`}
                      className="py-2 px-3 rounded-lg hover:bg-white/10 text-white transition-colors text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {section.name}
                    </Link>
                  ))}
                </div>
              </div>

              <button
                onClick={handleEnquireClick}
                className="bg-white text-primary font-bold text-center mt-4 py-3 rounded-lg text-sm shadow-lg w-full"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 inline mr-2">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Enquire Now
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header >
  );
};

export default Header;