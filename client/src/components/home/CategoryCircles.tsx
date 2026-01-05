import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fetchSections, fetchCategories } from "@/services/api";
import { Section, Category } from "@/types/api";

const CategoryCircles = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [sectionsData, categoriesData] = await Promise.all([
          fetchSections(),
          fetchCategories()
        ]);

        // Sort sections by order
        const sortedSections = sectionsData
          .filter(s => s.isActive)
          .sort((a, b) => a.order - b.order);

        setSections(sortedSections);
        setCategories(categoriesData.filter(c => c.isActive));

        if (sortedSections.length > 0) {
          setActiveSectionId(sortedSections[0].sectionId);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return null;
  }

  const activeCategories = categories
    .filter(c => c.sectionId === activeSectionId)
    .sort((a, b) => a.order - b.order);

  return (
    <section className="py-12 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h2 className="font-heading font-bold text-2xl text-primary">
            Shop by Category
          </h2>
        </div>

        {/* Section Circles (Tabs) */}
        <div className="flex flex-nowrap overflow-x-auto sm:flex-wrap justify-start sm:justify-center gap-3 sm:gap-10 mb-6 py-2 sm:py-4 px-4 sm:px-0 no-scrollbar snap-x">
          {sections.map((section, index) => (
            <motion.div
              key={section.sectionId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <button
                onClick={() => setActiveSectionId(section.sectionId)}
                className="flex flex-col items-center gap-3 group outline-none"
              >
                <div className={`relative w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden shadow-md border-2 transition-all duration-300 group-hover:shadow-xl ${activeSectionId === section.sectionId
                  ? 'border-primary ring-2 sm:ring-4 ring-primary/20 scale-105 sm:scale-110'
                  : 'border-transparent bg-white group-hover:border-primary/50'
                  }`}>
                  {section.image ? (
                    <img
                      src={section.image}
                      alt={section.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white p-2">
                      <img
                        src="/ds-logo.png"
                        alt={section.name}
                        className="w-full h-full object-contain opacity-80"
                      />
                    </div>
                  )}
                  <div className={`absolute inset-0 transition-colors duration-300 ${activeSectionId === section.sectionId ? 'bg-transparent' : 'bg-black/10 group-hover:bg-transparent'
                    }`} />
                </div>
                <span className={`font-medium text-xs sm:text-base transition-colors text-center max-w-[80px] sm:max-w-none leading-tight ${activeSectionId === section.sectionId ? 'text-primary font-bold' : 'text-gray-600 group-hover:text-primary'
                  }`}>
                  {section.name}
                </span>
              </button>
            </motion.div>
          ))}
        </div>

        <div className="w-full h-0.5 bg-[#e8aa35] mb-8 rounded-full" />

        {/* Categories Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSectionId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6"
          >
            {activeCategories.map((category) => (
              <Link
                key={category.categoryId}
                to={`/category/${category.slug}`}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
              >
                <div className="aspect-[4/3] overflow-hidden bg-gray-100 relative">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white p-4">
                      <img
                        src="/ds-logo.png"
                        alt={category.name}
                        className="w-full h-full object-contain opacity-80"
                      />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                </div>
                <div className="p-2 sm:p-3 flex items-center justify-between gap-2 bg-[#FFF5E5]">
                  <h3 className="font-bold text-primary transition-colors line-clamp-1 text-left text-xs sm:text-base">
                    {category.name}
                  </h3>
                  <div className="flex items-center text-[10px] sm:text-xs text-primary font-medium whitespace-nowrap">
                    <span className="hidden sm:inline">Explore</span> <ArrowRight className="w-3 h-3 ml-0 sm:ml-1" />
                  </div>
                </div>
              </Link>
            ))}

            {activeCategories.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-400">
                No categories found in this section.
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default CategoryCircles;
