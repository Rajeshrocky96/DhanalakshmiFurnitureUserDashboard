export interface Section {
    isActive: boolean;
    icon: string;
    slug: string;
    SK: string;
    showOnHome: boolean;
    sectionId: string;
    order: number;
    description: string;
    PK: string;
    name: string;
    image: string;
}

export interface Category {
    isActive: boolean;
    image: string;
    categoryId: string;
    slug: string;
    SK: string;
    sectionId: string;
    order: number;
    PK: string;
    name: string;
}

export interface Subcategory {
    isActive: boolean;
    subcategoryId: string;
    slug: string;
    SK: string;
    order: number;
    PK: string;
    name: string;
}

export interface Product {
    PK: string;
    SK: string;
    productId: string;
    name: string;
    slug: string;
    categoryId: string;
    subcategoryId: string;
    thumbnailImg: string;
    images: string[];
    specs: Record<string, string | { key: string; value: string }>;
    isActive: boolean;
    isNewArrival: boolean;
    isBestSeller: boolean;
    isFeatured: boolean;
    isTrending: boolean;
    isPremium: boolean;
    isRecommended: boolean;
    isOnOffer: boolean;
    offerText?: string;
    isCustomOrder: boolean;
    description?: string;
    rating?: number;
    isInStock?: boolean;
    price: number;
    mrp?: number;
}

export type BannerPosition = 'HOME_HERO' | 'HOME_OFFER' | 'HOME_MIDDLE' | 'HOME_BOTTOM' | 'CATEGORY_TOP' | 'SUBCATEGORY_TOP' | 'CATEGORY_SPLIT' | 'PRODUCT_PROMO';
export type RedirectType = 'PRODUCT' | 'CATEGORY' | 'SUBCATEGORY' | 'SECTION' | 'EXTERNAL';

export interface Banner {
    bannerId: string;
    title: string;
    subtitle?: string;
    image: string;
    redirectType: RedirectType;
    redirectValue: string;
    position: BannerPosition;
    order: number;
    isActive: boolean;
    categoryId?: string; // Optional, for context if needed
    subcategoryId?: string; // Optional, for context if needed
}
