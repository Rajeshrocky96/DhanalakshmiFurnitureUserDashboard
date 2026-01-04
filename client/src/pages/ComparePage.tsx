import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { X, GitCompare, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BreadcrumbNav from "@/components/ui/BreadcrumbNav";
import { useCompare } from "@/context/CompareContext";
import { getProductById } from "@/data/products";

const ComparePage = () => {
  const { compareProducts, removeFromCompare, clearCompare } = useCompare();

  const products = compareProducts
    .map((cp) => getProductById(cp.id))
    .filter(Boolean);

  const breadcrumbItems = [{ label: "Compare Products" }];

  // Get all unique specification keys
  const allSpecKeys = new Set<string>();
  products.forEach((product) => {
    if (product) {
      Object.keys(product.specifications).forEach((key) => allSpecKeys.add(key));
    }
  });

  const handleEnquiry = (productName: string, productSlug: string) => {
    const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "917448856172";

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:30038';
    const imageLinkForMessage = `${apiUrl}/api/products/${productSlug}/image`;

    const message = `Hello 👋\n\nI am interested in the following product:\n\n🛋️ Product: ${productName}\n🔗 Product Link: ${window.location.origin}/product/${productSlug}\n🖼️ Image: ${imageLinkForMessage}\n\nPlease share price, availability, and more details.\n\nThank you.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      <Helmet>
        <title>Compare Products - Dhanalakshmi Furnitures</title>
        <meta
          name="description"
          content="Compare furniture and appliances side by side at Dhanalakshmi Furnitures. Make informed decisions."
        />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <div className="container-custom">
            <BreadcrumbNav items={breadcrumbItems} />

            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="font-heading font-bold text-2xl sm:text-3xl text-foreground">
                  Compare Products
                </h1>
                <p className="text-muted-foreground mt-1">
                  {compareProducts.length > 0
                    ? `Comparing ${compareProducts.length} ${compareProducts[0].category} products`
                    : "Add products to compare"}
                </p>
              </div>

              {compareProducts.length > 0 && (
                <button
                  onClick={clearCompare}
                  className="text-destructive hover:underline text-sm self-start"
                >
                  Clear all
                </button>
              )}
            </div>

            {compareProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <GitCompare className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="font-heading font-semibold text-xl text-foreground mb-2">
                  No products to compare
                </h2>
                <p className="text-muted-foreground mb-6">
                  Add products from the same category to compare them side by side
                </p>
                <Link to="/" className="btn-primary inline-flex">
                  Browse Products
                </Link>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="overflow-x-auto pb-12"
              >
                <table className="w-full min-w-[600px] border-collapse">
                  {/* Product Images & Names */}
                  <thead>
                    <tr>
                      <th className="p-4 text-left font-heading font-semibold text-foreground bg-secondary rounded-tl-xl w-48">
                        Product
                      </th>
                      {products.map((product, index) => (
                        product && (
                          <th
                            key={product.id}
                            className={`p-4 bg-secondary ${index === products.length - 1 ? "rounded-tr-xl" : ""
                              }`}
                          >
                            <div className="relative">
                              <button
                                onClick={() => removeFromCompare(product.id)}
                                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:scale-110 transition-transform"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              <Link to={`/product/${product.id}`}>
                                <div className="w-32 h-32 mx-auto rounded-lg overflow-hidden mb-3">
                                  <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <h3 className="font-medium text-foreground text-sm line-clamp-2 hover:text-primary transition-colors">
                                  {product.name}
                                </h3>
                              </Link>
                            </div>
                          </th>
                        )
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {/* Brand */}
                    <CompareRow
                      label="Brand"
                      values={products.map((p) => p?.brand || "-")}
                    />



                    {/* Specifications */}
                    {Array.from(allSpecKeys).map((key) => (
                      <CompareRow
                        key={key}
                        label={key.charAt(0).toUpperCase() + key.slice(1)}
                        values={products.map((p) => p?.specifications[key] || "-")}
                      />
                    ))}

                    {/* Description */}
                    <CompareRow
                      label="Description"
                      values={products.map((p) => (
                        <p className="text-sm text-muted-foreground line-clamp-4">
                          {p?.description || "-"}
                        </p>
                      ))}
                    />



                    {/* Actions */}
                    <tr>
                      <td className="p-4 font-medium text-foreground bg-secondary rounded-bl-xl">
                        Action
                      </td>
                      {products.map((product, index) => (
                        product && (
                          <td
                            key={product.id}
                            className={`p-4 bg-secondary ${index === products.length - 1 ? "rounded-br-xl" : ""
                              }`}
                          >
                            <button
                              onClick={() => handleEnquiry(product.name, product.id)}
                              className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold py-2 rounded-lg shadow-md flex items-center justify-center gap-2 text-sm transition-colors"
                            >
                              <MessageCircle className="w-4 h-4" />
                              Enquire
                            </button>
                          </td>
                        )
                      ))}
                    </tr>
                  </tbody>
                </table>
              </motion.div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

// Compare Row Component
const CompareRow = ({
  label,
  values,
}: {
  label: string;
  values: (string | React.ReactNode)[];
}) => (
  <tr className="border-b border-border">
    <td className="p-4 font-medium text-foreground capitalize">{label}</td>
    {values.map((value, index) => (
      <td key={index} className="p-4 text-sm">
        {typeof value === "string" ? (
          <span className="text-foreground">{value}</span>
        ) : (
          value
        )}
      </td>
    ))}
  </tr>
);

export default ComparePage;
