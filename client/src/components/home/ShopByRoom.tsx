import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Product, Section, Category, Subcategory } from '@/types/api';
import { Link } from 'react-router-dom';
import { fetchSections, fetchCategories, fetchSubcategories } from '@/services/api';

interface ShopByRoomProps {
    products: Product[];
}

const sectionNameMapping: Record<string, string> = {
    "Furniture": "Dining Room",
    "Bedding": "Bed Room",
    "Kitchen Appliances": "Kitchen Room",
    "Home Appliances": "Living Room"
};

const ShopByRoom = ({ products }: ShopByRoomProps) => {
    const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
    const [sections, setSections] = useState<Section[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [secs, cats, subs] = await Promise.all([
                    fetchSections(),
                    fetchCategories(),
                    fetchSubcategories()
                ]);
                // Filter active sections and sort by order
                const activeSections = secs
                    .filter(s => s.isActive)
                    .sort((a, b) => a.order - b.order);

                setSections(activeSections);
                setCategories(cats);
                setSubcategories(subs);

                if (activeSections.length > 0) {
                    setActiveSectionId(activeSections[0].sectionId);
                }
            } catch (error) {
                console.error("Failed to fetch shop by room data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const activeSection = useMemo(() =>
        sections.find(s => s.sectionId === activeSectionId) || sections[0],
        [sections, activeSectionId]
    );

    // Get categories for the active section
    const sectionCategories = useMemo(() => {
        if (!activeSection) return [];
        return categories
            .filter(c => c.sectionId === activeSection.sectionId && c.isActive)
            .sort((a, b) => a.order - b.order);
    }, [activeSection, categories]);

    // Get subcategories for a specific category
    const getSubcategories = (categoryId: string) => {
        return subcategories
            .filter(s => s.PK === `CATEGORY#${categoryId}` && s.isActive)
            .sort((a, b) => a.order - b.order);
    };

    // Filter products that belong to the active section
    const filteredProducts = useMemo(() => {
        if (!products || !activeSection || sectionCategories.length === 0) return [];

        const categoryIds = new Set(sectionCategories.map(c => c.categoryId));

        return products.filter(p => categoryIds.has(p.categoryId)).slice(0, 4);
    }, [products, activeSection, sectionCategories]);

    // Find a representative image for the room
    const roomImage = useMemo(() => {
        if (activeSection?.image) return activeSection.image;
        if (filteredProducts.length > 0 && filteredProducts[0].images?.length > 0) {
            return filteredProducts[0].images[0];
        }
        return null;
    }, [activeSection, filteredProducts]);

    if (loading) return <div className="py-16 bg-white container-custom animate-pulse h-[600px] bg-gray-50 rounded-xl" />;
    if (sections.length === 0) return null;

    return (
        <section className="py-8 bg-[#B2F5EA]">
            <div className="container-custom">
                <h2 className="font-heading font-bold text-2xl mb-8 text-primary text-center">Shop By Room</h2>
                <div className="w-full h-0.5 bg-[#e8aa35] mb-8 rounded-full" />

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
                    {/* Left: Room List */}
                    <div className="w-full lg:w-1/3 flex flex-col">
                        {sections.map((section, index) => (
                            <button
                                key={section.sectionId}
                                onClick={() => setActiveSectionId(section.sectionId)}
                                className={`group flex items-center justify-between py-6 border-b border-gray-100 transition-all duration-300 ${activeSectionId === section.sectionId ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                                    }`}
                            >
                                <div className="flex items-baseline gap-6">
                                    <span className={`font-mono text-sm ${activeSectionId === section.sectionId ? 'text-primary font-bold' : 'text-gray-400'}`}>
                                        {(index + 1).toString().padStart(2, '0')}
                                    </span>
                                    <span className={`font-heading text-xl ${activeSectionId === section.sectionId ? 'text-gray-900 font-bold' : 'text-gray-600'}`}>
                                        {sectionNameMapping[section.name] || section.name}
                                    </span>
                                </div>
                                <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${activeSectionId === section.sectionId ? 'text-primary translate-x-0' : 'text-gray-300 -translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'
                                    }`} />
                            </button>
                        ))}
                    </div>

                    {/* Right: Content Display */}
                    <div className="w-full lg:w-2/3">
                        <AnimatePresence mode="wait">
                            {activeSection && (
                                <motion.div
                                    key={activeSection.sectionId}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.4 }}
                                    className="h-full"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                                        {/* Room Image / Featured Product */}
                                        <div className="relative rounded-2xl overflow-hidden h-[400px] md:h-[500px] bg-gray-100 group">
                                            {roomImage ? (
                                                <img src={roomImage} alt={sectionNameMapping[activeSection.name] || activeSection.name} className="w-full h-full object-contain p-6 transition-transform duration-700 group-hover:scale-105" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                                                    <span className="text-sm">Select a room to view details</span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                                                <h3 className="text-white font-heading font-bold text-3xl mb-2">{sectionNameMapping[activeSection.name] || activeSection.name}</h3>
                                                <p className="text-white/80 text-sm mb-4">{activeSection.description || `Explore our collection for your ${(sectionNameMapping[activeSection.name] || activeSection.name).toLowerCase()}`}</p>
                                                <Link to={`/section/${activeSection.slug}`} className="inline-flex items-center gap-2 text-white font-medium hover:underline">
                                                    View All Products <ArrowRight className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>

                                        {/* Items List & Products */}
                                        <div className="flex flex-col gap-4 h-[400px] md:h-[500px]">
                                            {/* Groups List (Categories & Subcategories) */}
                                            <div className="space-y-6 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                                                {sectionCategories.map((category) => {
                                                    const subs = getSubcategories(category.categoryId);
                                                    if (subs.length === 0) return null;

                                                    return (
                                                        <div key={category.categoryId}>
                                                            <h4 className="font-bold text-gray-900 mb-3 text-xs uppercase tracking-wider border-b border-gray-100 pb-2">
                                                                {category.name}
                                                            </h4>
                                                            <ul className="space-y-2.5">
                                                                {subs.map((sub) => (
                                                                    <li key={sub.subcategoryId}>
                                                                        <Link
                                                                            to={`/category/${category.slug}?subcategory=${sub.slug}`}
                                                                            className="text-gray-600 hover:text-primary transition-colors text-sm flex items-center gap-2 group/link"
                                                                        >
                                                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover/link:bg-primary transition-colors"></span>
                                                                            {sub.name}
                                                                        </Link>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    );
                                                })}
                                                {sectionCategories.length === 0 && (
                                                    <p className="text-gray-400 text-sm italic">No categories found.</p>
                                                )}
                                            </div>

                                            {/* Mini Product Grid (Top 2 matches) */}
                                            {filteredProducts.length > 0 && (
                                                <div className="pt-4 border-t border-gray-100 flex-shrink-0">
                                                    <h4 className="font-bold text-gray-900 mb-4 text-xs uppercase tracking-wider">Top Picks</h4>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        {filteredProducts.slice(0, 2).map(product => (
                                                            <Link key={product.productId} to={`/product/${product.slug}`} className="group/prod block">
                                                                <div className="aspect-square rounded-lg overflow-hidden bg-gray-50 mb-2 border border-gray-100">
                                                                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover/prod:scale-105 transition-transform duration-500" />
                                                                </div>
                                                                <h5 className="text-xs font-medium text-gray-900 line-clamp-2 group-hover/prod:text-primary transition-colors">{product.name}</h5>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ShopByRoom;
