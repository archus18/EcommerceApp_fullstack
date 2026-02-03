import { useEffect, useState } from "react";
import { fetchOrders } from "../../api/apis";
import { motion } from "framer-motion";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchOrders();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log("ORDERS LOAD ERROR:", err?.response?.data || err);
        setOrders([]);
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
        className="max-w-6xl mx-auto bg-white rounded-[40px] shadow-2xl p-8 md:p-12"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Orders
          </h1>
          <p className="text-gray-600 mt-2">
            View all customer orders in one place
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-16">
            <p className="text-gray-500 font-medium">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-700 font-semibold text-lg">
              No orders placed yet 📦
            </p>
            <p className="text-gray-500 mt-2">
              When customers checkout, orders will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => {
              const fullName = order?.user
                ? `${order.user.firstName || ""} ${order.user.lastName || ""}`.trim()
                : "Unknown";

              const payment = order?.paymentStatus || "pending";
              const created = order?.createdAt
                ? new Date(order.createdAt).toLocaleString()
                : "";

              return (
                <div
                  key={order._id}
                  className="rounded-3xl border bg-white shadow-md hover:shadow-xl transition p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Left */}
                    <div>
                      <p className="text-sm text-gray-500">Order ID</p>
                      <p className="font-semibold text-gray-800 break-all">
                        {order._id}
                      </p>

                      <p className="text-sm text-gray-500 mt-3">Customer</p>
                      <p className="font-semibold text-gray-800">{fullName}</p>

                      <p className="text-xs text-gray-500 mt-2">{created}</p>
                    </div>

                    {/* Right */}
                    <div className="flex flex-col items-start md:items-end gap-3">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="text-2xl font-bold text-green-600">
                          ₹{order.totalAmount ?? 0}
                        </p>
                      </div>

                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                          payment.toLowerCase() === "paid"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-yellow-50 text-yellow-700 border-yellow-200"
                        }`}
                      >
                        Payment: {payment}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Orders;
