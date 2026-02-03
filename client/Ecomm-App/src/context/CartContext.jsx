import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";

const CartContext = createContext(null);

const BASE = "http://localhost:3000/api/cart";

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const token = localStorage.getItem("token");

  /* ================= LOAD CART ================= */
  useEffect(() => {
    const loadCart = async () => {
      try {
        if (!token) {
          setCartItems([]);
          return;
        }

        const res = await axios.get(BASE, authHeaders());

        // backend -> frontend: [{product, qty}] => [{...product, qty}]
        const items = (res.data.cart || []).map((item) => ({
          ...item.product,
          qty: item.qty,
        }));

        setCartItems(items);
      } catch (err) {
        console.log("LOAD CART ERROR:", err?.response?.data || err);
        setCartItems([]);
      }
    };

    loadCart();
  }, [token]);

  /* ================= ADD ================= */
  const addToCart = async (product) => {
    if (!token) {
      alert("Please login to use cart 🛒");
      return;
    }

    const id = product?._id || product?.id;
    if (!id) return;

    // ✅ optimistic UI
    setCartItems((prev) => {
      const existing = prev.find((i) => (i._id || i.id) === id);
      if (existing) {
        return prev.map((i) =>
          (i._id || i.id) === id ? { ...i, qty: (i.qty || 1) + 1 } : i
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });

    try {
      await axios.post(BASE, { productId: id, qty: 1 }, authHeaders());
    } catch (err) {
      console.log("ADD CART ERROR:", err?.response?.data || err);
    }
  };

  /* ================= UPDATE QTY ================= */
  const setQty = async (productId, qty) => {
    if (!token) return;
    if (!productId) return;

    setCartItems((prev) =>
      prev.map((i) =>
        (i._id || i.id) === productId ? { ...i, qty: Math.max(1, qty) } : i
      )
    );

    try {
      await axios.put(`${BASE}/${productId}`, { qty: Math.max(1, qty) }, authHeaders());
    } catch (err) {
      // fallback (if your backend uses POST for update)
      try {
        await axios.post(BASE, { productId, qty: Math.max(1, qty) }, authHeaders());
      } catch (e) {
        console.log("UPDATE QTY ERROR:", e?.response?.data || e);
      }
    }
  };

  const increaseQty = async (productId) => {
    const item = cartItems.find((i) => (i._id || i.id) === productId);
    const current = item?.qty || 1;
    await setQty(productId, current + 1);
  };

  const decreaseQty = async (productId) => {
    const item = cartItems.find((i) => (i._id || i.id) === productId);
    const current = item?.qty || 1;
    await setQty(productId, Math.max(1, current - 1));
  };

  /* ================= REMOVE ================= */
  const removeFromCart = async (productId) => {
    if (!token) return;

    setCartItems((prev) => prev.filter((i) => (i._id || i.id) !== productId));

    try {
      await axios.delete(`${BASE}/${productId}`, authHeaders());
    } catch (err) {
      console.log("REMOVE CART ERROR:", err?.response?.data || err);
    }
  };

  /* ================= CLEAR ================= */
  const clearCart = async () => {
    if (!token) {
      setCartItems([]);
      return;
    }

    setCartItems([]);

    try {
      await axios.delete(BASE, authHeaders());
    } catch (err) {
      console.log("CLEAR CART ERROR:", err?.response?.data || err);
    }
  };

  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      removeFromCart,
      increaseQty,
      decreaseQty,
      clearCart,
    }),
    [cartItems]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
