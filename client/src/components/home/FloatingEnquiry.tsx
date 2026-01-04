import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Phone } from "lucide-react";
import { fetchSections } from "@/services/api";
import { Section } from "@/types/api";

const FloatingEnquiry = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showBubble, setShowBubble] = useState(true);
    const [sections, setSections] = useState<Section[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        message: ""
    });

    useEffect(() => {
        const loadSections = async () => {
            try {
                const data = await fetchSections();
                const activeSections = data.filter(s => s.isActive && s.image);
                setSections(activeSections);
            } catch (error) {
                console.error("Failed to load sections for floating button", error);
            }
        };
        loadSections();
    }, []);

    useEffect(() => {
        if (sections.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentImageIndex(prev => (prev + 1) % sections.length);
        }, 3000);
        return () => clearInterval(timer);
    }, [sections.length]);

    const handleWhatsApp = () => {
        const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "917448856172";
        const message = encodeURIComponent("Hello, I have interested in your products. Can you please provide more details?");
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
    };

    const handleSubmitEnquiry = (e: React.FormEvent) => {
        e.preventDefault();

        const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "917448856172";
        const text = `*New Enquiry*\n\n*Name:* ${formData.name}\n*Phone:* ${formData.phone}\n*Message:* ${formData.message}`;
        const encodedMessage = encodeURIComponent(text);

        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");

        setShowForm(false);
        setIsOpen(false);
        setFormData({ name: "", phone: "", message: "" });
    };

    return (
        <>
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
                {/* Message Bubble */}
                <AnimatePresence>
                    {showBubble && !isOpen && !showForm && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.9 }}
                            className="bg-white p-3 rounded-2xl shadow-xl border border-gray-100 relative"
                        >
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowBubble(false);
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow-md hover:bg-red-600 transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                            <p className="text-xs font-medium text-gray-800 leading-relaxed whitespace-nowrap">
                                Need live assistance? We are here!
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Button */}
                {/* Main Button */}
                <div className="relative">
                    {!isOpen && (
                        <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping duration-1000" />
                    )}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsOpen(!isOpen)}
                        className="relative w-20 h-20 rounded-full shadow-2xl overflow-hidden border-4 border-white group z-10"
                    >
                        <div className="absolute inset-0 bg-primary/10" />
                        {sections.length > 0 ? (
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={currentImageIndex}
                                    src={sections[currentImageIndex].image}
                                    alt="Section"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="w-full h-full object-cover"
                                />
                            </AnimatePresence>
                        ) : (
                            <div className="w-full h-full bg-primary flex items-center justify-center text-white">
                                <MessageCircle className="w-8 h-8" />
                            </div>
                        )}

                        {/* Overlay Icon when Open */}
                        {isOpen && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white backdrop-blur-sm">
                                <X className="w-8 h-8" />
                            </div>
                        )}
                    </motion.button>
                </div>

                {/* Menu Options */}
                <AnimatePresence>
                    {isOpen && (
                        <div className="absolute bottom-28 right-0 flex flex-col gap-3 items-end">
                            <motion.button
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ delay: 0.1 }}
                                onClick={handleWhatsApp}
                                className="flex items-center gap-2 bg-[#25D366] text-white px-3 py-2 rounded-full shadow-lg hover:bg-[#20bd5a] transition-colors whitespace-nowrap font-medium text-sm"
                            >
                                Chat on WhatsApp
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                            </motion.button>

                            <motion.button
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onClick={() => {
                                    const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "917448856172";
                                    window.open(`https://wa.me/${phoneNumber}`, "_blank");
                                }}
                                className="flex items-center gap-2 bg-primary text-white px-3 py-2 rounded-full shadow-lg hover:bg-primary/90 transition-colors whitespace-nowrap font-medium text-sm"
                            >
                                Call on WhatsApp <Phone className="w-4 h-4" />
                            </motion.button>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Enquiry Modal */}
            <AnimatePresence>
                {showForm && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                        >
                            <div className="p-6 bg-primary text-white flex justify-between items-center">
                                <h3 className="font-heading font-bold text-xl">Send Enquiry</h3>
                                <button onClick={() => setShowForm(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmitEnquiry} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Your Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        required
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="Your Phone Number"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                    <textarea
                                        required
                                        rows={4}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                                        value={formData.message}
                                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                                        placeholder="How can we help you?"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25"
                                >
                                    Send Message
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default FloatingEnquiry;
