import { Section, Category, Subcategory, Product, Banner } from "../types/api";

const API_BASE_URL = `${import.meta.env.VITE_API_URL || "http://localhost:30038"}/api`;

export const fetchSections = async (): Promise<Section[]> => {
    const response = await fetch(`${API_BASE_URL}/sections`);
    if (!response.ok) {
        throw new Error("Failed to fetch sections");
    }
    return response.json();
};

export const fetchCategories = async (): Promise<Category[]> => {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) {
        throw new Error("Failed to fetch categories");
    }
    return response.json();
};

export const fetchSubcategories = async (): Promise<Subcategory[]> => {
    const response = await fetch(`${API_BASE_URL}/subcategories`);
    if (!response.ok) {
        throw new Error("Failed to fetch subcategories");
    }
    return response.json();
};

export const fetchProducts = async (): Promise<Product[]> => {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }
    return response.json();
};

export const fetchProductBySlug = async (slug: string): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/products/${slug}`);
    if (!response.ok) {
        throw new Error("Failed to fetch product");
    }
    return response.json();
};

export const fetchBanners = async (): Promise<Banner[]> => {
    const response = await fetch(`${API_BASE_URL}/banners`);
    if (!response.ok) {
        throw new Error("Failed to fetch banners");
    }
    return response.json();
};


