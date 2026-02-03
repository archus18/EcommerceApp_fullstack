import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder } from "../api/apis";
import { useToast } from "../context/ToastContext";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, increaseQty, decreaseQty, clearCart } =
    useCart();
  const { toast } = useToast();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const total = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.qty || 1),
    0
  );

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please login to place an order");
      navigate("/login");
      return;
    }

    const orderItems = cartItems.map((item) => ({
      product: item._id || item.id,
      qty: item.qty || 1,
      price: item.price || 0,
    }));

    try {
      // ✅ IMPORTANT: Don't send userId now (backend reads req.userId)
      await createOrder({
        items: orderItems,
        totalAmount: total,
      });

      toast.success("Order placed successfully 🎉");
      clearCart();

      // ✅ Flipkart-like redirect
      setTimeout(() => navigate("/my-orders"), 800);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to place order"
      );
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-cyan-400 to-green-400 px-4 py-10">
        <div className="max-w-4xl mx-auto bg-white rounded-[40px] shadow-2xl p-10 md:p-14 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Your cart is empty 🛒
          </h2>
          <p className="text-gray-600 mb-8">Add products to see them here.</p>

          <Link
            to="/products"
            className="inline-block px-10 py-4 rounded-full text-white text-lg font-semibold
            bg-gradient-to-r from-cyan-500 to-green-500 hover:opacity-90 transition"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-400 to-green-400 px-4 py-10">
      <div className="max-w-6xl mx-auto bg-white rounded-[40px] shadow-2xl p-8 md:p-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Your Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const id = item._id || item.id;
              const qty = item.qty || 1;
              const price = item.price || 0;

              return (
                <div
                  key={id}
                  className="flex gap-4 items-center bg-gray-50 border rounded-3xl p-4"
                >
                  <div className="h-20 w-20 bg-white rounded-2xl border flex items-center justify-center overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title || item.name}
                        className="h-full object-contain"
                      />
                    ) : (
                      <span className="text-gray-400 text-xs">No Image</span>
                    )}
                  </div>

                  <div className="flex-1">
                    <h2 className="font-semibold text-gray-800">
                      {item.title || item.name}
                    </h2>
                    <p className="text-sm text-gray-500">₹{price} each</p>

                    <div className="mt-3 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => decreaseQty(id)}
                        className="h-9 w-9 rounded-full border hover:bg-gray-100 font-bold"
                      >
                        −
                      </button>

                      <span className="min-w-[28px] text-center font-semibold">
                        {qty}
                      </span>

                      <button
                        type="button"
                        onClick={() => increaseQty(id)}
                        className="h-9 w-9 rounded-full border hover:bg-gray-100 font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-gray-800">₹{price * qty}</p>

                    <button
                      type="button"
                      onClick={() => {
                        removeFromCart(id);
                        toast.info("Removed from cart");
                      }}
                      className="text-red-600 text-sm font-semibold hover:underline mt-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="bg-gray-50 border rounded-3xl p-6 h-fit">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Order Summary
            </h2>

            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Items</span>
              <span>{cartItems.length}</span>
            </div>

            <div className="flex justify-between text-sm text-gray-600 mb-4">
              <span>Delivery</span>
              <span>Free</span>
            </div>

            <div className="flex justify-between text-lg font-bold text-gray-800 border-t pt-4">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              className="w-full mt-6 py-3 rounded-full text-white font-semibold
              bg-gradient-to-r from-cyan-500 to-green-500 hover:opacity-90 transition"
            >
              Checkout
            </button>

            <button
              type="button"
              onClick={() => {
                clearCart();
                toast.info("Cart cleared");
              }}
              className="w-full mt-3 py-3 rounded-full border font-semibold hover:bg-white transition"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
