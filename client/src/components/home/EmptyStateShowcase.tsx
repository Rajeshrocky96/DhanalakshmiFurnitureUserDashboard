import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fetchSections } from "@/services/api";
import { Section } from "@/types/api";

const EmptyStateShowcase = () => {
    const [sections, setSections] = useState<Section[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSections = async () => {
            try {
                const data = await fetchSections();
                setSections(data.filter(s => s.isActive).sort((a, b) => a.order - b.order));
            } catch (error) {
                console.error("Failed to fetch sections:", error);
            } finally {
                setLoading(false);
            }
        };
        loadSections();
    }, []);

    if (loading) return null;

    if (sections.length === 0) {
        return (
            <div className="py-20 text-center bg-background">
                <h2 className="text-2xl font-bold mb-4 text-primary">Coming Soon</h2>
                <p className="text-muted-foreground">We are updating our catalog. Please check back later.</p>
            </div>
        );
    }

    return (
        <section className="py-16 bg-background">
            <div className="container-custom">
                <div className="text-center mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="font-heading font-bold text-3xl sm:text-4xl text-primary mb-4"
                    >
                        Explore Our Collections
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground max-w-2xl mx-auto"
                    >
                        Discover our wide range of premium furniture and home appliances.
                        Browse by category to find exactly what you need.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sections.map((section, index) => (
                        <motion.div
                            key={section.sectionId}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 + 0.2 }}
                            className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-lg"
                        >
                            <Link to={`/section/${section.slug}`} className="block w-full h-full">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500 z-10" />
                                <img
                                    src={section.image}
                                    alt={section.name}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />

                                <div className="absolute inset-0 z-20 flex flex-col justify-end p-8">
                                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <h3 className="text-2xl font-bold text-white mb-2">{section.name}</h3>
                                        <p className="text-white/80 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-2">
                                            {section.description || `Explore our premium collection of ${section.name.toLowerCase()}.`}
                                        </p>
                                        <span className="inline-flex items-center gap-2 text-white font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                            Shop Now <ArrowRight className="w-4 h-4" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default EmptyStateShowcase;
