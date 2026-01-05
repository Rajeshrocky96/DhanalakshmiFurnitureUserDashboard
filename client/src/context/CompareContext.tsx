import { createContext, useContext, useState, ReactNode } from "react";
import { CompareProduct } from "@/types/product";

interface CompareContextType {
  compareProducts: CompareProduct[];
  addToCompare: (product: CompareProduct) => boolean;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
  canCompare: (category: string) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider = ({ children }: { children: ReactNode }) => {
  const [compareProducts, setCompareProducts] = useState<CompareProduct[]>([]);

  const addToCompare = (product: CompareProduct): boolean => {
    if (compareProducts.length >= 4) {
      return false;
    }

    if (compareProducts.length > 0 && compareProducts[0].category !== product.category) {
      return false;
    }

    if (isInCompare(product.id)) {
      return false;
    }

    setCompareProducts([...compareProducts, product]);
    return true;
  };

  const removeFromCompare = (productId: string) => {
    setCompareProducts(compareProducts.filter(p => p.id !== productId));
  };

  const clearCompare = () => {
    setCompareProducts([]);
  };

  const isInCompare = (productId: string) => {
    return compareProducts.some(p => p.id === productId);
  };

  const canCompare = (category: string) => {
    if (compareProducts.length === 0) return true;
    return compareProducts[0].category === category;
  };

  return (
    <CompareContext.Provider
      value={{
        compareProducts,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        canCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
};
