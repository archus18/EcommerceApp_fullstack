import { useEffect, useState } from "react";
import { fetchProducts } from "../api/apis";
import ProductCard from "../components/ProductCart";
import { motion } from "framer-motion";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log("FETCH PRODUCTS ERROR:", err?.response?.data || err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-400 to-green-400 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto bg-white rounded-[40px] shadow-2xl p-8 md:p-12"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            All Products
          </h1>
          <p className="text-gray-600 mt-2">
            Explore our collection and shop smarter.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-600 font-medium">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-gray-600 font-medium">
            No products found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p?._id || p?.id} product={p} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Products;
