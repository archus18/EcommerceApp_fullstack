import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getWishlist, toggleWishlist } from "../api/apis";
import { useToast } from "./ToastContext";
import { useNavigate } from "react-router-dom";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  // ✅ read token reactively (simple)
  const token = localStorage.getItem("token");

  const { toast } = useToast();
  const navigate = useNavigate();

  // Load wishlist from backend when token exists
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        if (!token) {
          setWishlist([]);
          return;
        }
        const res = await getWishlist(); // { wishlist: [...] }
        setWishlist(res?.wishlist || []);
      } catch (err) {
        console.log("WISHLIST LOAD ERROR:", err?.response?.data || err);
        setWishlist([]);
      }
    };

    loadWishlist();
  }, [token]);

  const isInWishlist = (id) =>
    wishlist.some((p) => (p?._id || p?.id) === id);

  const toggle = async (product) => {
    const id = product?._id || product?.id;
    if (!id) return;

    if (!token) {
      toast.error("Please login to use wishlist ❤️");
      navigate("/login");
      return;
    }

    try {
      const res = await toggleWishlist(id); // returns { wishlist: [...] }
      setWishlist(res?.wishlist || []);
      toast.success(isInWishlist(id) ? "Removed from wishlist" : "Added to wishlist");
    } catch (err) {
      console.log("WISHLIST TOGGLE ERROR:", err?.response?.data || err);
      toast.error("Wishlist update failed");
    }
  };

  const value = useMemo(
    () => ({
      wishlist,
      isInWishlist,
      toggleWishlist: toggle,
    }),
    [wishlist]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
