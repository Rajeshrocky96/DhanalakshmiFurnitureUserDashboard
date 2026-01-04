import { motion } from "framer-motion";

const brandsRow1 = [
    { name: "Brand 1", url: "https://pub-f7c37c896c85492887b796168745a96e.r2.dev/logo/1767455603791.jpg" },
    { name: "Brand 2", url: "https://pub-f7c37c896c85492887b796168745a96e.r2.dev/logo/1767455976389.jpg" },
    { name: "Brand 3", url: "https://pub-f7c37c896c85492887b796168745a96e.r2.dev/logo/1767455959351.jpg" },
    { name: "Brand 4", url: "https://pub-f7c37c896c85492887b796168745a96e.r2.dev/logo/1767455940206.jpg" },
    { name: "Brand 5", url: "https://pub-f7c37c896c85492887b796168745a96e.r2.dev/logo/1767455917925.jpg" },
    { name: "Brand 6", url: "https://pub-f7c37c896c85492887b796168745a96e.r2.dev/logo/1767455888244.jpg" },
    { name: "Brand 7", url: "https://pub-f7c37c896c85492887b796168745a96e.r2.dev/logo/1767455706788.jpg" },
    { name: "Brand 8", url: "https://pub-f7c37c896c85492887b796168745a96e.r2.dev/logo/1767455735364.jpg" },
];

const brandsRow2 = [
    { name: "Brand 9", url: "https://pub-f7c37c896c85492887b796168745a96e.r2.dev/logo/1767455687721.jpg" },
    { name: "Brand 10", url: "https://pub-f7c37c896c85492887b796168745a96e.r2.dev/logo/1767455653273.jpg" },
    { name: "Brand 11", url: "https://pub-f7c37c896c85492887b796168745a96e.r2.dev/logo/1767456236295.jpg" },
    { name: "Brand 12", url: "https://pub-f7c37c896c85492887b796168745a96e.r2.dev/logo/1767456181035.jpg" },
    { name: "Brand 13", url: "https://pub-f7c37c896c85492887b796168745a96e.r2.dev/logo/1767456156127.jpg" },
    { name: "Brand 14", url: "https://pub-f7c37c896c85492887b796168745a96e.r2.dev/logo/1767456135563.jpg" },
    { name: "Brand 15", url: "https://pub-f7c37c896c85492887b796168745a96e.r2.dev/logo/1767456109775.jpg" },
    { name: "Brand 16", url: "https://pub-f7c37c896c85492887b796168745a96e.r2.dev/logo/1767456040958.jpg" },
];

const BrandMarquee = () => {
    return (
        <section className="py-12 bg-gray-50 border-t border-gray-100 overflow-hidden">
            <div className="container-custom mb-8 text-center">
                <h3 className="font-heading font-bold text-2xl text-primary">Our Trusted Brands</h3>
                <div className="w-full h-0.5 bg-[#e8aa35] mt-4 mb-8 rounded-full" />
            </div>

            <div className="flex flex-col gap-8">
                {/* Row 1: Left to Right */}
                <div className="relative flex overflow-hidden">
                    <motion.div
                        className="flex gap-12 items-center whitespace-nowrap"
                        animate={{ x: ["-50%", "0%"] }}
                        transition={{
                            x: {
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: 50,
                                ease: "linear",
                            },
                        }}
                    >
                        {[...brandsRow1, ...brandsRow1, ...brandsRow1].map((brand, index) => (
                            <div key={`${brand.name}-${index}`} className="flex items-center justify-center min-w-[180px] h-32 transition-all duration-300 hover:scale-110">
                                {brand.url ? (
                                    <img
                                        src={brand.url}
                                        alt={brand.name}
                                        className="max-h-24 max-w-[160px] object-contain"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                        }}
                                    />
                                ) : null}
                                <span className={`font-bold text-gray-400 text-lg ${brand.url ? 'hidden' : ''}`}>{brand.name}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Row 2: Right to Left */}
                <div className="relative flex overflow-hidden">
                    <motion.div
                        className="flex gap-12 items-center whitespace-nowrap"
                        animate={{ x: ["0%", "-50%"] }} // Moving Left
                        transition={{
                            x: {
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: 50,
                                ease: "linear",
                            },
                        }}
                    >
                        {[...brandsRow2, ...brandsRow2, ...brandsRow2].map((brand, index) => (
                            <div key={`${brand.name}-${index}`} className="flex items-center justify-center min-w-[180px] h-32 transition-all duration-300 hover:scale-110">
                                {brand.url ? (
                                    <img
                                        src={brand.url}
                                        alt={brand.name}
                                        className="max-h-24 max-w-[160px] object-contain"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                        }}
                                    />
                                ) : null}
                                <span className={`font-bold text-gray-400 text-lg ${brand.url ? 'hidden' : ''}`}>{brand.name}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default BrandMarquee;
