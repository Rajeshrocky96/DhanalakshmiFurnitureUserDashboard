import { Link } from "react-router-dom";
import { X, GitCompare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCompare } from "@/context/CompareContext";

const CompareBar = () => {
  const { compareProducts, removeFromCompare, clearCompare } = useCompare();

  if (compareProducts.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="compare-bar"
      >
        <div className="container-custom">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Products */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-primary-foreground">
                <GitCompare className="w-5 h-5" />
                <span className="font-medium hidden sm:inline">Compare:</span>
              </div>
              
              <div className="flex items-center gap-2">
                {compareProducts.map((product) => (
                  <div
                    key={product.id}
                    className="relative group"
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 border-primary/50 bg-background">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => removeFromCompare(product.id)}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                
                {/* Empty Slots */}
                {Array.from({ length: Math.max(0, 2 - compareProducts.length) }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center"
                  >
                    <span className="text-muted-foreground/50 text-xs">+</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={clearCompare}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-primary-foreground transition-colors"
              >
                Clear All
              </button>
              <Link
                to="/compare"
                className="btn-primary text-sm px-6"
              >
                View Compare ({compareProducts.length})
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CompareBar;
