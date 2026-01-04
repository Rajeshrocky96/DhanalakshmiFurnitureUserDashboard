import { useNavigate } from 'react-router-dom';
import { Banner } from '@/types/api';
import { fetchCategories } from '@/services/api';

export const useBannerNavigation = () => {
    const navigate = useNavigate();

    const handleBannerClick = async (banner: Banner) => {
        if (!banner.redirectType || !banner.redirectValue) return;

        switch (banner.redirectType) {
            case 'PRODUCT':
                // Navigate to product detail page using slug or ID (backend supports both)
                navigate(`/product/${banner.redirectValue}`);
                break;
            case 'CATEGORY':
                try {
                    // Fetch categories to find the slug if redirectValue is an ID
                    const categories = await fetchCategories();
                    const category = categories.find(c => c.categoryId === banner.redirectValue || c.slug === banner.redirectValue);

                    if (category && category.slug) {
                        navigate(`/category/${category.slug}`);
                    } else {
                        // Fallback to redirectValue (might be ID or slug)
                        navigate(`/category/${banner.redirectValue}`);
                    }
                } catch (error) {
                    console.error("Failed to resolve category slug", error);
                    navigate(`/category/${banner.redirectValue}`);
                }
                break;
            case 'SUBCATEGORY':
                // Navigate to category page with subcategory query param
                if (banner.categoryId) {
                    navigate(`/category/${banner.categoryId}?subcategory=${banner.redirectValue}`);
                } else {
                    navigate(`/products?subcategory=${banner.redirectValue}`);
                }
                break;
            case 'SECTION':
                navigate(`/section/${banner.redirectValue}`);
                break;
            case 'EXTERNAL':
                window.open(banner.redirectValue, '_blank');
                break;
            default:
                break;
        }
    };

    return { handleBannerClick };
};
