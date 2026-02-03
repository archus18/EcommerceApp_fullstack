import { useEffect, useState } from "react";
import { fetchOrders, updateOrderStatus } from "../../api/apis";
import { motion } from "framer-motion";
import { useToast } from "../../context/ToastContext";

const STATUS = ["placed", "confirmed", "shipped", "delivered"];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
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

  useEffect(() => {
    load();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setSavingId(orderId);

      // optimistic UI
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
      );

      await updateOrderStatus(orderId, { orderStatus: newStatus });
      toast.success(`Order status updated to "${newStatus}"`);
    } catch (err) {
      toast.error("Failed to update status");
      console.log("STATUS UPDATE ERROR:", err?.response?.data || err);
      load(); // rollback by reload
    } finally {
      setSavingId(null);
    }
  };

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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Orders</h1>
          <p className="text-gray-600 mt-2">Update tracking: Placed → Shipped → Delivered</p>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <p className="text-gray-500 font-medium">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-700 font-semibold text-lg">No orders placed yet 📦</p>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => {
              const fullName = order?.user
                ? `${order.user.firstName || ""} ${order.user.lastName || ""}`.trim()
                : "Unknown";

              const payment = (order?.paymentStatus || "pending").toLowerCase();
              const status = (order?.orderStatus || "placed").toLowerCase();

              const created = order?.createdAt ? new Date(order.createdAt).toLocaleString() : "";

              return (
                <div
                  key={order._id}
                  className="rounded-3xl border bg-white shadow-md hover:shadow-xl transition p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Left */}
                    <div>
                      <p className="text-sm text-gray-500">Order ID</p>
                      <p className="font-semibold text-gray-800 break-all">{order._id}</p>

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
                          payment === "paid"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-yellow-50 text-yellow-700 border-yellow-200"
                        }`}
                      >
                        Payment: {payment}
                      </span>

                      {/* ✅ STATUS DROPDOWN */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 font-semibold">Status:</span>

                        <select
                          value={status}
                          disabled={savingId === order._id}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="border rounded-xl px-3 py-2 text-sm font-semibold bg-white"
                        >
                          {STATUS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>

                        {savingId === order._id && (
                          <span className="text-xs text-gray-500">Saving...</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(order.items || []).map((it, idx) => {
                      const p = it.product || {};
                      return (
                        <div
                          key={p._id || idx}
                          className="bg-gray-50 border rounded-2xl p-4 flex gap-4"
                        >
                          <div className="h-14 w-14 rounded-xl bg-white border flex items-center justify-center overflow-hidden">
                            {p.image ? (
                              <img src={p.image} alt={p.title} className="h-full object-contain" />
                            ) : (
                              <span className="text-xs text-gray-400">No Image</span>
                            )}
                          </div>

                          <div className="flex-1">
                            <p className="font-semibold text-gray-800 line-clamp-1">
                              {p.title || "Product"}
                            </p>
                            <p className="text-sm text-gray-500">
                              Qty: {it.qty} • ₹{it.price} each
                            </p>
                          </div>
                        </div>
                      );
                    })}
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
