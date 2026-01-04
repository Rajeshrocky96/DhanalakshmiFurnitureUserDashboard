export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  brand: string;
  price?: number;
  images: string[];
  shortInfo: string;
  description: string;
  specifications: {
    material?: string;
    size?: string;
    warranty?: string;
    type?: string;
    color?: string;
    weight?: string;
    [key: string]: string | undefined;
  };
  reviews: {
    rating: number;
    count: number;
    summary: string;
  };
  customOrderNote?: string;
  isBestSeller?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  subcategories?: string[];
  brands?: string[];
  banners?: {
    image: string;
    title?: string;
    subtitle?: string;
  }[];
}

export interface Banner {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  discount?: string;
  categoryLink: string;
  ctaText: string;
}

export interface FilterOptions {
  brands: string[];
  sizes: string[];
  materials: string[];
  types: string[];
  warranties: string[];
}

export interface CompareProduct {
  id: string;
  name: string;
  image: string;
  category: string;
}
