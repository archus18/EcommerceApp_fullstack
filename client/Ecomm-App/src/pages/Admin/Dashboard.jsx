import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [stats, setStats] = useState({ users: 0, products: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const users = await axios.get("http://localhost:3000/api/users");
        const products = await axios.get("http://localhost:3000/api/products");

        setStats({
          users: Array.isArray(users.data) ? users.data.length : 0,
          products: Array.isArray(products.data) ? products.data.length : 0,
        });
      } catch (err) {
        console.log("DASHBOARD ERROR:", err?.response?.data || err);
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
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Quick overview of your store performance
          </p>
        </div>

        {/* Stats */}
        {loading ? (
          <div className="text-center py-16">
            <p className="text-gray-500 font-medium">Loading stats...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Users Card */}
            <div className="rounded-3xl border bg-white shadow-md hover:shadow-xl transition p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600">
                    Total Users
                  </p>
                  <h2 className="text-4xl font-bold text-gray-900 mt-2">
                    {stats.users}
                  </h2>
                </div>

                <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-cyan-500 to-green-500 text-white flex items-center justify-center text-2xl shadow">
                  👥
                </div>
              </div>

              <div className="mt-6 h-2 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full w-2/3 bg-gradient-to-r from-cyan-500 to-green-500" />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Registered customers & admins
              </p>
            </div>

            {/* Products Card */}
            <div className="rounded-3xl border bg-white shadow-md hover:shadow-xl transition p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600">
                    Total Products
                  </p>
                  <h2 className="text-4xl font-bold text-gray-900 mt-2">
                    {stats.products}
                  </h2>
                </div>

                <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-cyan-500 to-green-500 text-white flex items-center justify-center text-2xl shadow">
                  📦
                </div>
              </div>

              <div className="mt-6 h-2 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full w-3/4 bg-gradient-to-r from-cyan-500 to-green-500" />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Total products available in store
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
