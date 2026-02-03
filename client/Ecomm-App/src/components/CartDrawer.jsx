import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useCartDrawer } from "../context/CartDrawerContext";
import { createOrder } from "../api/apis";

const CartDrawer = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart } = useCart();
  const { isCartOpen, closeCart } = useCartDrawer();

  const user = JSON.parse(localStorage.getItem("user"));

  const total = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.qty || 1),
    0
  );

  // ✅ close on ESC + lock scroll
  useEffect(() => {
    if (!isCartOpen) return;

    const onKey = (e) => {
      if (e.key === "Escape") closeCart();
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "auto";
    };
  }, [isCartOpen, closeCart]);

  const handleCheckout = async () => {
    if (!user) {
      alert("Please login to place an order");
      closeCart();
      navigate("/login");
      return;
    }

    const orderItems = cartItems.map((item) => ({
      product: item._id,
      qty: item.qty,
      price: item.price,
    }));

    try {
      await createOrder({
        userId: user?.id || user?._id,
        items: orderItems,
        totalAmount: total,
      });

      alert("Order placed successfully 🎉");
      // Later: clear cart
      closeCart();
    } catch (error) {
      console.log("ORDER ERROR:", error?.response?.data || error);
      alert("Failed to place order");
    }
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-50"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Your Cart</h2>
          <button
            onClick={closeCart}
            className="h-9 w-9 rounded-full hover:bg-gray-100 transition flex items-center justify-center text-gray-700"
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center pt-10">
              <p className="text-lg font-semibold text-gray-800">
                Your cart is empty 🛒
              </p>
              <p className="text-gray-600 mt-2 mb-6">
                Add something you like.
              </p>

              <Link
                to="/products"
                onClick={closeCart}
                className="inline-block px-8 py-3 rounded-full text-white font-semibold
                bg-gradient-to-r from-cyan-500 to-green-500 hover:opacity-90 transition"
              >
                Shop Products
              </Link>
            </div>
          ) : (
            cartItems.map((item) => {
              const title = item?.title || item?.name || "Product";
              const qty = item?.qty || 1;
              const price = item?.price || 0;
              const image = item?.image;

              return (
                <div
                  key={item?._id || item?.id}
                  className="flex gap-4 border rounded-2xl p-4"
                >
                  <div className="h-16 w-16 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
                    {image ? (
                      <img src={image} alt={title} className="h-full w-full object-contain" />
                    ) : (
                      <span className="text-xs text-gray-400">No Image</span>
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 line-clamp-1">{title}</p>
                    <p className="text-sm text-gray-600 mt-1">Qty: {qty}</p>
                    <p className="text-sm text-gray-600">₹{price} each</p>

                    <div className="mt-3 flex items-center justify-between">
                      <p className="font-bold text-gray-900">₹{price * qty}</p>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-sm font-semibold text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-700 font-semibold">Total</span>
              <span className="text-xl font-bold text-gray-900">₹{total}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full px-8 py-3 rounded-full text-white font-semibold
              bg-gradient-to-r from-cyan-500 to-green-500 hover:opacity-90 transition"
            >
              Checkout
            </button>

            <button
              onClick={() => {
                closeCart();
                navigate("/cart");
              }}
              className="w-full mt-3 px-8 py-3 rounded-full font-semibold border border-gray-300 hover:bg-gray-100 transition"
            >
              Open Full Cart Page
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
