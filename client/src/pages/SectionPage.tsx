import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BreadcrumbNav from "@/components/ui/BreadcrumbNav";
import { fetchSections, fetchCategories, fetchSubcategories } from "@/services/api";
import { Section, Category, Subcategory } from "@/types/api";
import { Loader } from "@/components/ui/loader";

import { ImageOff } from "lucide-react";
import BrandMarquee from "@/components/home/BrandMarquee";

const SectionPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const [section, setSection] = useState<Section | null>(null);
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

                const currentSection = secs.find(s => s.slug === slug);
                setSection(currentSection || null);

                if (currentSection) {
                    const sectionCategories = cats.filter(c => c.sectionId === currentSection.sectionId);
                    setCategories(sectionCategories.sort((a, b) => a.order - b.order));
                    setSubcategories(subs);
                }
            } catch (error) {
                console.error("Failed to fetch section data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [slug]);

    const getSubcategoriesForCategory = (categoryId: string) => {
        return subcategories.filter(s => s.PK === `CATEGORY#${categoryId}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <Loader fullScreen />
                <Footer />
            </div>
        );
    }

    if (!section) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 container-custom py-12">
                    <h1 className="font-heading font-bold text-2xl">Section not found</h1>
                </main>
                <Footer />
            </div>
        );
    }

    const breadcrumbItems = [
        { label: section.name },
    ];

    return (
        <>
            <Helmet>
                <title>{section.name} - Dhanalakshmi Furnitures</title>
                <meta
                    name="description"
                    content={`Shop premium ${section.name} at Dhanalakshmi Furnitures. Best quality, affordable prices.`}
                />
            </Helmet>

            <div className="min-h-screen flex flex-col">
                <Header />

                <main className="flex-1 pt-16">
                    <div className="container-custom py-4 sm:py-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <h1 className="font-heading font-extrabold text-2xl sm:text-3xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 tracking-tight">
                                    {section.name}
                                </h1>
                                {section.description && (
                                    <p className="text-muted-foreground mt-1 text-sm sm:text-base max-w-2xl leading-relaxed">
                                        {section.description}
                                    </p>
                                )}
                            </motion.div>
                            <div className="shrink-0">
                                <BreadcrumbNav items={breadcrumbItems} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
                            {categories.map((category, index) => (
                                <motion.div
                                    key={category.categoryId}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Link
                                        to={`/category/${category.slug}`}
                                        className="block group h-full bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all"
                                    >
                                        <div className="aspect-square overflow-hidden bg-secondary relative">
                                            {category.image ? (
                                                <img
                                                    src={category.image}
                                                    alt={category.name}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center bg-secondary text-muted-foreground p-4">
                                                    <ImageOff className="w-12 h-12 mb-2 opacity-50" />
                                                    <span className="text-xs font-medium uppercase tracking-wider opacity-70">No Image Available</span>
                                                </div>
                                            )}
                                            {/* Subcategories Overlay */}
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-4 text-center">
                                                <div className="flex flex-wrap justify-center gap-2">
                                                    {getSubcategoriesForCategory(category.categoryId).slice(0, 4).map(sub => (
                                                        <span key={sub.subcategoryId} className="text-xs font-medium text-white bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/30">
                                                            {sub.name}
                                                        </span>
                                                    ))}
                                                    {getSubcategoriesForCategory(category.categoryId).length > 4 && (
                                                        <span className="text-xs font-medium text-white bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/30">
                                                            +{getSubcategoriesForCategory(category.categoryId).length - 4} more
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-4 text-center bg-[#BDE8F5]">
                                            <h3 className="font-heading font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                                                {category.name}
                                            </h3>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {categories.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">No categories found in this section.</p>
                            </div>
                        )}
                    </div>

                    {/* Brand Marquee for Home Appliances */}
                    {section && (section.slug === 'home-appliances' || section.name.toLowerCase() === 'home appliances') && (
                        <BrandMarquee />
                    )}
                </main>

                <Footer />
            </div>
        </>
    );
};

export default SectionPage;
