

const TrustBadges = () => {
    return (
        <section className="py-12 bg-gray-50 border-t border-gray-100">
            <div className="container-custom">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Card 1: EMI & Payments */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden group hover:shadow-md transition-shadow duration-300">
                        {/* Left: Easy EMI */}
                        <div className="flex flex-col items-center sm:items-start z-10">
                            <h3 className="text-4xl font-black text-primary leading-none tracking-tighter">
                                EASY
                            </h3>
                            <h3 className="text-5xl font-black text-primary leading-none tracking-tighter mb-1">
                                EMI
                            </h3>
                            <div className="h-1 w-full bg-gray-800 rounded-full mb-1"></div>
                            <p className="text-xs font-bold text-gray-800 tracking-widest uppercase">
                                PAY THROUGH
                            </p>
                        </div>

                        {/* Divider for mobile */}
                        <div className="w-full h-px bg-gray-100 sm:hidden"></div>

                        {/* Right: Payment Options */}
                        <div className="flex flex-col items-center sm:items-end gap-4 z-10 flex-1">
                            <div className="bg-primary text-white px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wide shadow-primary/20 shadow-lg">
                                UPI & Buy Now Pay Later
                            </div>
                            <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-end">
                                <img src="/UPI.jpeg" alt="UPI Payments" className="h-20 object-contain" />
                            </div>
                        </div>

                        {/* Decorative Curve */}
                        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-primary/5 to-transparent skew-x-12 opacity-50 pointer-events-none" />
                    </div>

                    {/* Card 2: Warranty Offer */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden group hover:shadow-md transition-shadow duration-300">

                        {/* Left: Offer Pill */}
                        <div className="flex flex-col items-center sm:items-start gap-3 z-10 flex-1">
                            <div className="bg-primary text-white px-6 py-3 rounded-full font-bold text-lg uppercase tracking-wide shadow-primary/20 shadow-lg w-full sm:w-auto text-center">
                                Special Offers
                            </div>
                            <p className="text-primary font-bold text-sm uppercase tracking-wider">
                                On Premium Furniture
                            </p>
                        </div>

                        {/* Divider for mobile */}
                        <div className="w-full h-px bg-gray-100 sm:hidden"></div>

                        {/* Right: 5 Years Badge */}
                        <div className="flex flex-col items-center z-10">
                            <div className="flex items-baseline">
                                <span className="text-5xl font-black text-primary tracking-tighter">BEST</span>
                            </div>
                            <div className="h-1 w-full bg-primary rounded-full mb-1"></div>
                            <p className="text-xs font-bold text-gray-800 tracking-widest uppercase text-center">
                                Quality<br />Assurance
                            </p>
                        </div>

                        {/* Decorative Curve */}
                        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-primary/5 to-transparent -skew-x-12 opacity-50 pointer-events-none" />
                    </div>

                </div>
            </div>
        </section>
    );
};

export default TrustBadges;
