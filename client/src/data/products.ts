import { Product, Banner } from "@/types/product";



export const banners: Banner[] = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1920&h=800&fit=crop",
    title: "Festival Furniture Sale",
    subtitle: "Transform your living space with premium furniture",
    discount: "Up to 60% OFF",
    categoryLink: "/category/sofa",
    ctaText: "View Collection",
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1920&h=800&fit=crop",
    title: "Bedroom Essentials",
    subtitle: "Comfort meets elegance in our exclusive range",
    discount: "Flat 40% OFF",
    categoryLink: "/category/wooden-cot",
    ctaText: "Shop Now",
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=800&fit=crop",
    title: "Home Appliances",
    subtitle: "Modern appliances for modern homes",
    discount: "Special Offers",
    categoryLink: "/category/fridge",
    ctaText: "Explore Deals",
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1920&h=800&fit=crop",
    title: "Dining Collection",
    subtitle: "Create memorable family moments",
    discount: "Starting ₹15,999",
    categoryLink: "/category/dining-table",
    ctaText: "View Range",
  },
];

export const offerBanners: Banner[] = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop",
    title: "Living Room Sale",
    subtitle: "Up to 40% off on Sofas",
    discount: "40% OFF",
    categoryLink: "/category/sofa",
    ctaText: "Shop Now"
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop",
    title: "Bedroom Essentials",
    subtitle: "Premium Cots & Mattresses",
    discount: "30% OFF",
    categoryLink: "/category/wooden-cot",
    ctaText: "Explore"
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&h=600&fit=crop",
    title: "Dining Sets",
    subtitle: "Elegant Dining Tables",
    discount: "25% OFF",
    categoryLink: "/category/dining-table",
    ctaText: "View Offers"
  }
];

export const products: Product[] = [
  // Wooden Cot
  {
    id: "cot-1",
    name: "Royal Teak Wood King Cot",
    category: "Wooden Cot",
    subcategory: "Teak Wooden Cot",
    brand: "Dhanalakshmi",
    price: 35000,
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=800&fit=crop"
    ],
    shortInfo: "Premium teak wood king size cot with intricate carving",
    description: "Handcrafted from genuine teak wood, this king size cot features a traditional design with modern durability. Available in sizes 3*6¼, 4*6¼, 5*6¼, 6*6¼. Custom sizes available on order.",
    specifications: {
      material: "Teak Wood",
      size: "King (6*6¼)",
      warranty: "10 Years",
      type: "Storage Cot",
      finish: "Melamine Polish"
    },
    reviews: {
      rating: 4.8,
      count: 124,
      summary: "Customers love the sturdy build and elegant finish."
    },
    customOrderNote: "Custom sizes available on order basis",
    isBestSeller: true
  },
  {
    id: "cot-2",
    name: "Classic Wooden Queen Cot",
    category: "Wooden Cot",
    subcategory: "Wooden Cot",
    brand: "Dhanalakshmi",
    price: 18000,
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=800&fit=crop"
    ],
    shortInfo: "Sturdy wooden cot for everyday comfort",
    description: "A durable wooden cot made from high-quality treated wood. Perfect for any bedroom. Available in standard sizes.",
    specifications: {
      material: "Treated Wood",
      size: "Queen (5*6¼)",
      warranty: "5 Years",
      type: "Non-Storage"
    },
    reviews: {
      rating: 4.5,
      count: 89,
      summary: "Great value for money."
    }
  },

  // Wooden Beero
  {
    id: "beero-1",
    name: "Teak Wood Beero 6.5ft",
    category: "Wooden Beero",
    subcategory: "Teak Wooden Beero",
    brand: "Dhanalakshmi",
    price: 45000,
    images: [
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&h=800&fit=crop"
    ],
    shortInfo: "Spacious teak wood cupboard",
    description: "6.5 feet tall teak wood beero with ample storage space. Features multiple shelves and a locker.",
    specifications: {
      material: "Teak Wood",
      size: "6.5 Feet",
      warranty: "10 Years",
      type: "2 Door"
    },
    reviews: {
      rating: 4.9,
      count: 45,
      summary: "Excellent quality and finish."
    }
  },
  {
    id: "beero-2",
    name: "N/p Beero 3 Door",
    category: "Wooden Beero",
    subcategory: "N/p Beero",
    brand: "Dhanalakshmi",
    price: 25000,
    images: [
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&h=800&fit=crop"
    ],
    shortInfo: "Modern 3 door wardrobe",
    description: "Stylish N/p beero with 3 doors. Available in 1, 2, 3, 4 door configurations and custom sizes.",
    specifications: {
      material: "Engineered Wood",
      size: "6.5 Feet",
      warranty: "3 Years",
      type: "3 Door"
    },
    reviews: {
      rating: 4.2,
      count: 30,
      summary: "Good storage capacity."
    },
    customOrderNote: "Customised beero available on order basis"
  },

  // Fan
  {
    id: "fan-1",
    name: "Crompton High Speed Ceiling Fan",
    category: "Fan",
    subcategory: "Ceiling Fan",
    brand: "Crompton",
    price: 2500,
    images: [
      "https://images.unsplash.com/photo-1615873968403-89e068629265?w=800&h=800&fit=crop"
    ],
    shortInfo: "High speed energy efficient fan",
    description: "Crompton ceiling fan with anti-dust technology and high air delivery.",
    specifications: {
      type: "Ceiling Fan",
      warranty: "2 Years",
      color: "White",
      speed: "380 RPM"
    },
    reviews: {
      rating: 4.6,
      count: 200,
      summary: "Very silent and powerful."
    }
  },
  {
    id: "fan-2",
    name: "Orient Table Fan",
    category: "Fan",
    subcategory: "Table Fan",
    brand: "Orient",
    price: 1800,
    images: [
      "https://images.unsplash.com/photo-1615873968403-89e068629265?w=800&h=800&fit=crop"
    ],
    shortInfo: "Portable high speed table fan",
    description: "Orient table fan with oscillation control and 3 speed settings.",
    specifications: {
      type: "Table Fan",
      warranty: "2 Years",
      color: "Blue"
    },
    reviews: {
      rating: 4.3,
      count: 50,
      summary: "Good for small rooms."
    }
  },

  // Mixer
  {
    id: "mixer-1",
    name: "Preethi Zodiac Mixer Grinder",
    category: "Mixer",
    subcategory: "Mixer Grinder",
    brand: "Preethi",
    price: 8500,
    images: [
      "https://images.unsplash.com/photo-1585235954211-1437759e98d9?w=800&h=800&fit=crop"
    ],
    shortInfo: "750W mixer with juicer jar",
    description: "Preethi Zodiac mixer grinder with 5 jars including master chef jar.",
    specifications: {
      power: "750W",
      warranty: "5 Years",
      jars: "5"
    },
    reviews: {
      rating: 4.7,
      count: 300,
      summary: "Best mixer in the market."
    },
    isBestSeller: true
  },

  // Grinder
  {
    id: "grinder-1",
    name: "Ultra Wet Grinder",
    category: "Grinder",
    subcategory: "Wet Grinder",
    brand: "Ultra",
    price: 6500,
    images: [
      "https://images.unsplash.com/photo-1585235954211-1437759e98d9?w=800&h=800&fit=crop"
    ],
    shortInfo: "2L wet grinder with conical stones",
    description: "Ultra wet grinder for perfect idli and dosa batter. Durable and efficient.",
    specifications: {
      capacity: "2 Litres",
      warranty: "5 Years",
      type: "Table Top"
    },
    reviews: {
      rating: 4.8,
      count: 150,
      summary: "Very smooth grinding."
    }
  },

  // Fridge
  {
    id: "fridge-1",
    name: "LG Double Door Refrigerator",
    category: "Fridge",
    subcategory: "Double Door",
    brand: "LG",
    price: 32000,
    images: [
      "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&h=800&fit=crop"
    ],
    shortInfo: "260L frost free refrigerator",
    description: "LG double door fridge with smart inverter compressor and convertible modes.",
    specifications: {
      capacity: "260L",
      warranty: "1 Year on Product, 10 on Compressor",
      rating: "3 Star"
    },
    reviews: {
      rating: 4.6,
      count: 120,
      summary: "Spacious and energy efficient."
    }
  },

  // Washing Machine
  {
    id: "wm-1",
    name: "Samsung Front Load Washing Machine",
    category: "Washing Machine",
    subcategory: "Front Load",
    brand: "Samsung",
    price: 35000,
    images: [
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&h=800&fit=crop"
    ],
    shortInfo: "8kg fully automatic front load",
    description: "Samsung washing machine with Eco Bubble technology and hygiene steam.",
    specifications: {
      capacity: "8kg",
      warranty: "3 Years",
      type: "Fully Automatic"
    },
    reviews: {
      rating: 4.7,
      count: 90,
      summary: "Excellent wash quality."
    }
  },

  // Ironbox
  {
    id: "iron-1",
    name: "Bajaj Dry Iron",
    category: "Ironbox",
    subcategory: "Dry Iron",
    brand: "Bajaj",
    price: 800,
    images: [
      "https://images.unsplash.com/photo-1544281163-57689c5df684?w=800&h=800&fit=crop"
    ],
    shortInfo: "Lightweight dry iron",
    description: "Bajaj dry iron with non-stick coating and thermal fuse safety.",
    specifications: {
      power: "1000W",
      warranty: "2 Years",
      type: "Dry"
    },
    reviews: {
      rating: 4.4,
      count: 60,
      summary: "Good for daily use."
    }
  },

  // Steel Beero
  {
    id: "steel-beero-1",
    name: "Godrej Steel Almirah",
    category: "Steel Beero",
    subcategory: "2 Door",
    brand: "Godrej",
    price: 15000,
    images: [
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&h=800&fit=crop"
    ],
    shortInfo: "Classic steel cupboard",
    description: "Godrej steel almirah with locker and tie bar. Rust resistant.",
    specifications: {
      material: "Steel",
      size: "6.5 Feet",
      warranty: "1 Year",
      type: "2 Door"
    },
    reviews: {
      rating: 4.5,
      count: 80,
      summary: "Very strong and secure."
    }
  },

  // Steel Cot
  {
    id: "steel-cot-1",
    name: "Heavy Duty Steel Cot",
    category: "Steel Cot",
    subcategory: "Steel Cot",
    brand: "Dhanalakshmi",
    price: 8000,
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=800&fit=crop"
    ],
    shortInfo: "Durable steel cot",
    description: "Heavy duty steel cot available in sizes 3*6, 4*6. Various designs and weights available.",
    specifications: {
      material: "Steel",
      size: "4*6",
      warranty: "5 Years",
      type: "Double"
    },
    reviews: {
      rating: 4.3,
      count: 40,
      summary: "Long lasting and affordable."
    }
  },

  // Mattress
  {
    id: "mattress-1",
    name: "Kurlon Coir Mattress",
    category: "Mattress",
    subcategory: "Cotton Mattress",
    brand: "Kurlon",
    price: 8000,
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=800&fit=crop"
    ],
    shortInfo: "Comfortable coir mattress",
    description: "Kurlon mattress with advanced coir technology for back support.",
    specifications: {
      material: "Coir",
      size: "Queen",
      warranty: "2 Years",
      thickness: "5 inch"
    },
    reviews: {
      rating: 4.4,
      count: 70,
      summary: "Good back support."
    }
  },

  // Wooden Sofa
  {
    id: "wooden-sofa-1",
    name: "Teak Wood 3 Seater Sofa",
    category: "Wooden Sofa",
    subcategory: "3 Seater",
    brand: "Dhanalakshmi",
    price: 25000,
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop"
    ],
    shortInfo: "Elegant wooden sofa",
    description: "Handcrafted teak wood sofa with premium fabric upholstery.",
    specifications: {
      material: "Teak Wood",
      capacity: "3 Seater",
      warranty: "5 Years",
      fabric: "Jute"
    },
    reviews: {
      rating: 4.7,
      count: 35,
      summary: "Looks very royal."
    }
  },

  // Cushion Sofa
  {
    id: "cushion-sofa-1",
    name: "L Shape Corner Sofa",
    category: "Cushion Sofa",
    subcategory: "Corner Sofa Set",
    brand: "Dhanalakshmi",
    price: 45000,
    images: [
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&h=800&fit=crop"
    ],
    shortInfo: "Modern corner sofa set",
    description: "Luxurious L-shaped corner sofa with high density foam.",
    specifications: {
      material: "Fabric",
      capacity: "5 Seater",
      warranty: "3 Years",
      type: "L Shape"
    },
    reviews: {
      rating: 4.6,
      count: 55,
      summary: "Very comfortable."
    },
    isBestSeller: true
  },

  // Dining Table
  {
    id: "dining-1",
    name: "6 Seater Glass Top Dining",
    category: "Dining Table",
    subcategory: "Glass",
    brand: "Dhanalakshmi",
    price: 28000,
    images: [
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&h=800&fit=crop"
    ],
    shortInfo: "Modern glass dining table",
    description: "Tempered glass top dining table with 6 leatherette chairs.",
    specifications: {
      material: "Glass & Wood",
      capacity: "6 Seater",
      warranty: "2 Years",
      shape: "Rectangle"
    },
    reviews: {
      rating: 4.5,
      count: 40,
      summary: "Stylish and easy to clean."
    }
  },

  // Office Table
  {
    id: "office-1",
    name: "Executive Office Desk",
    category: "Office Tables",
    subcategory: "Office Table",
    brand: "Dhanalakshmi",
    price: 12000,
    images: [
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&h=800&fit=crop"
    ],
    shortInfo: "Spacious office table",
    description: "Executive desk with 3 drawers and ample leg room. Size 4*2.",
    specifications: {
      material: "Engineered Wood",
      size: "4*2",
      warranty: "1 Year",
      type: "Executive"
    },
    reviews: {
      rating: 4.4,
      count: 25,
      summary: "Perfect for home office."
    },
    customOrderNote: "Customised tables on order basis"
  }
];

export const getProductById = (id: string) => {
  return products.find((product) => product.id === id);
};



export const getBestSellers = () => {
  return products.filter((product) => product.isBestSeller);
};
