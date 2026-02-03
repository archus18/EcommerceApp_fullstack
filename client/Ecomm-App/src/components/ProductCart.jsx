import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/wishlistContext";
import { motion } from "framer-motion";
import { useToast } from "../context/ToastContext";

const ProductCart = ({ product }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();

  const id = product?._id || product?.id;
  const title = product?.title || product?.name || "Product";
  const price = product?.price ?? 0;
  const image = product?.image;
  const category = product?.category || "";

  const liked = id ? isInWishlist(id) : false;

  const requireLogin = (msg) => {
    if (!user) {
      toast.error(msg);
      navigate("/login");
      return false;
    }
    return true;
  };

  const handleWishlist = () => {
    const ok = requireLogin("Please login to use wishlist ❤️");
    if (!ok) return;

    toggleWishlist(product);
    toast.success(liked ? "Removed from wishlist" : "Added to wishlist");
  };

  const handleAddToCart = () => {
    const ok = requireLogin("Please login to use cart 🛒");
    if (!ok) return;

    addToCart(product);
    toast.success("Added to cart ✅");
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-3xl shadow-md hover:shadow-xl transition overflow-hidden border"
    >
      {/* Image + Wishlist Button */}
      <div className="relative h-48 bg-gray-100 flex items-center justify-center p-4">
        {image ? (
          <img src={image} alt={title} className="h-full w-full object-contain" />
        ) : (
          <span className="text-gray-400">No Image</span>
        )}

        <button
          type="button"
          onClick={handleWishlist}
          className={`absolute top-3 right-3 h-10 w-10 rounded-full flex items-center justify-center shadow border transition
            ${liked ? "bg-red-50 border-red-200" : "bg-white/90 border-gray-200 hover:bg-white"}
          `}
          title={liked ? "Remove from wishlist" : "Add to wishlist"}
        >
          <span className={`text-xl ${liked ? "text-red-600" : "text-gray-700"}`}>♥</span>
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        {category && <div className="text-xs text-gray-500 capitalize mb-1">{category}</div>}

        <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">{title}</h3>
        <p className="text-green-600 font-bold text-xl mt-1">₹{price}</p>

        <div className="flex gap-3 mt-4">
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-green-500 hover:opacity-90 text-white py-2 rounded-xl font-medium transition"
          >
            Add to Cart
          </button>

          <Link
            to={`/product/${id}`}
            className="flex-1 text-center border border-gray-300 py-2 rounded-xl hover:bg-gray-100 transition font-medium"
          >
            View
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCart;
