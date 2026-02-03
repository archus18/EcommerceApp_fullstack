import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { fetchMyOrders } from "../api/apis";
import { Link } from "react-router-dom";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openOrderId, setOpenOrderId] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
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

    loadOrders();
  }, []);

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, o) => sum + (o?.totalAmount || 0), 0);
    return { totalOrders, totalSpent };
  }, [orders]);

  const badgeClasses = (type) => {
    if (type === "paid")
      return "bg-green-50 text-green-700 border-green-200";
    if (type === "pending")
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    if (type === "shipped")
      return "bg-blue-50 text-blue-700 border-blue-200";
    return "bg-gray-50 text-gray-700 border-gray-200";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-cyan-400 to-green-400 px-4 py-10">
        <div className="max-w-5xl mx-auto bg-white rounded-[40px] shadow-2xl p-10 md:p-14 text-center">
          <p className="text-gray-700 font-semibold">Loading your orders...</p>
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
          className="max-w-5xl mx-auto bg-white rounded-[40px] shadow-2xl p-10 md:p-14 text-center"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            No orders yet 📦
          </h2>
          <p className="text-gray-600 mb-8">
            You haven’t placed any orders. Start shopping now!
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
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            My Orders
          </h1>
          <p className="text-gray-600 mt-2">
            Track all your placed orders here.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-50 border rounded-3xl p-6">
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">
              {stats.totalOrders}
            </p>
          </div>

          <div className="bg-gray-50 border rounded-3xl p-6">
            <p className="text-sm text-gray-500">Total Spent</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">
              ₹{stats.totalSpent}
            </p>
          </div>
        </div>

        {/* Orders */}
        <div className="space-y-6">
          {orders.map((order) => {
            const id = order?._id;
            const date = order?.createdAt
              ? new Date(order.createdAt).toLocaleString()
              : "";
            const itemsCount = Array.isArray(order?.items) ? order.items.length : 0;
            const isOpen = openOrderId === id;

            return (
              <div key={id} className="border bg-gray-50 rounded-3xl overflow-hidden">
                {/* Top Bar */}
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Order ID</p>
                      <p className="font-semibold text-gray-800 break-all">
                        {id}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{date}</p>
                    </div>

                    <div className="flex flex-wrap gap-3 items-center justify-start lg:justify-end">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold border ${badgeClasses(
                          order?.paymentStatus
                        )}`}
                      >
                        Payment:{" "}
                        <span className="capitalize">{order?.paymentStatus}</span>
                      </span>

                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold border ${badgeClasses(
                          order?.orderStatus
                        )}`}
                      >
                        Status:{" "}
                        <span className="capitalize">{order?.orderStatus}</span>
                      </span>

                      <span className="px-4 py-2 rounded-full text-sm font-bold bg-white border">
                        {itemsCount} items • ₹{order?.totalAmount || 0}
                      </span>

                      <button
                        type="button"
                        onClick={() => setOpenOrderId(isOpen ? null : id)}
                        className="px-5 py-2 rounded-full font-semibold text-white
                        bg-gradient-to-r from-cyan-500 to-green-500 hover:opacity-90 transition"
                      >
                        {isOpen ? "Hide items" : "View items"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Items */}
                {isOpen && (
                  <div className="px-6 pb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {(order?.items || []).map((it, idx) => {
                        const p = it?.product || {};
                        const pid = p?._id || it?.product; // supports populated & non-populated
                        const title = p?.title || "Product";
                        const image = p?.image;

                        return (
                          <div
                            key={pid?.toString?.() || idx}
                            className="bg-white border rounded-2xl p-4 flex gap-4"
                          >
                            <div className="h-16 w-16 rounded-xl bg-gray-100 border flex items-center justify-center overflow-hidden">
                              {image ? (
                                <img
                                  src={image}
                                  alt={title}
                                  className="h-full object-contain"
                                />
                              ) : (
                                <span className="text-xs text-gray-400">
                                  No Image
                                </span>
                              )}
                            </div>

                            <div className="flex-1">
                              <p className="font-semibold text-gray-800 line-clamp-1">
                                {title}
                              </p>

                              <p className="text-sm text-gray-500">
                                Qty: {it?.qty || 1} • ₹{it?.price || 0} each
                              </p>

                              {pid && typeof pid === "string" && (
                                <Link
                                  to={`/product/${pid}`}
                                  className="text-sm font-semibold text-green-700 hover:underline mt-1 inline-block"
                                >
                                  View product
                                </Link>
                              )}

                              {pid && typeof pid === "object" && pid?._id && (
                                <Link
                                  to={`/product/${pid._id}`}
                                  className="text-sm font-semibold text-green-700 hover:underline mt-1 inline-block"
                                >
                                  View product
                                </Link>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default MyOrders;
