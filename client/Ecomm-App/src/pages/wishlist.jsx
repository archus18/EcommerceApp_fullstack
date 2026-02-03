import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/wishlistContext";
import { useCart } from "../context/CartContext";
import { useState } from "react";

const Wishlist = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [toast, setToast] = useState("");

  const items = Array.isArray(wishlist) ? wishlist : [];

  const handleAddToCart = (product) => {
    addToCart(product);
    toggleWishlist(product);

    setToast("Moved to cart 🛒");

    setTimeout(() => {
      setToast("");
    }, 2000);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-cyan-400 to-green-400 px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto bg-white rounded-[40px] shadow-2xl p-10 md:p-14 text-center"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Your wishlist is empty ❤️
          </h2>
          <p className="text-gray-600 mb-8">
            Save items you like and come back later.
          </p>

          <Link
            to="/products"
            className="inline-block px-10 py-4 rounded-full text-white text-lg font-semibold
            bg-gradient-to-r from-cyan-500 to-green-500 hover:opacity-90 transition"
          >
            Browse Products
          </Link>
        </motion.div>
      </div>
    );
  }

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
            My Wishlist
          </h1>
          <p className="text-gray-600 mt-2">
            Your saved products appear here.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((product) => {
            const title = product?.title || product?.name || "Product";
            const price = product?.price ?? 0;
            const image = product?.image;
            const id = product?._id || product?.id;

            return (
              <div
                key={id}
                className="bg-white rounded-3xl shadow-md hover:shadow-xl transition overflow-hidden border"
              >
                <div className="h-48 bg-gray-100 flex items-center justify-center p-4">
                  {image ? (
                    <img
                      src={image}
                      alt={title}
                      className="h-full object-contain"
                    />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">
                    {title}
                  </h3>

                  <p className="text-green-600 font-bold text-xl mt-1">
                    ₹{price}
                  </p>

                  <div className="flex gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-green-500 hover:opacity-90 text-white py-2 rounded-xl font-medium transition"
                    >
                      Add to Cart
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleWishlist(product)}
                      className="flex-1 text-center border border-gray-300 py-2 rounded-xl hover:bg-gray-100 transition font-medium"
                    >
                      Remove
                    </button>
                  </div>

                  <Link
                    to={`/product/${id}`}
                    className="block text-center mt-3 text-sm font-medium text-gray-700 hover:underline"
                  >
                    View details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-black text-white px-5 py-3 rounded-xl shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
