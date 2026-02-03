import { useEffect, useState } from "react";
import { fetchMyOrders } from "../api/apis";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const OrderHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const load = async () => {
      try {
        const data = await fetchMyOrders();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log("FETCH MY ORDERS ERROR:", err?.response?.data || err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-cyan-400 to-green-400 px-4 py-10">
        <div className="max-w-5xl mx-auto bg-white rounded-[40px] shadow-2xl p-10 text-center">
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-cyan-400 to-green-400 px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto bg-white rounded-[40px] shadow-2xl p-10 md:p-14 text-center"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            No orders yet 📦
          </h2>
          <p className="text-gray-600 mb-8">
            Once you place an order, it will appear here.
          </p>

          <Link
            to="/products"
            className="inline-block px-10 py-4 rounded-full text-white text-lg font-semibold
            bg-gradient-to-r from-cyan-500 to-green-500 hover:opacity-90 transition"
          >
            Shop Now
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
        className="max-w-6xl mx-auto bg-white rounded-[40px] shadow-2xl p-8 md:p-12"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            My Orders
          </h1>
          <p className="text-gray-600 mt-2">Track your order history.</p>
        </div>

        <div className="space-y-5">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-3xl p-6 bg-gray-50"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-semibold text-gray-800">{order._id}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="font-bold text-gray-800">₹{order.totalAmount}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Payment</p>
                  <p className="font-semibold text-gray-800 capitalize">
                    {order.paymentStatus || "pending"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {(order.items || []).map((it, idx) => {
                  const p = it.product || {};
                  const title = p.title || p.name || "Product";
                  const image = p.image;

                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-4 bg-white rounded-2xl border p-4"
                    >
                      <div className="h-14 w-14 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                        {image ? (
                          <img
                            src={image}
                            alt={title}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <span className="text-xs text-gray-400">No Image</span>
                        )}
                      </div>

                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 line-clamp-1">
                          {title}
                        </p>
                        <p className="text-sm text-gray-500">
                          Qty: {it.qty} • ₹{it.price}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default OrderHistory;
