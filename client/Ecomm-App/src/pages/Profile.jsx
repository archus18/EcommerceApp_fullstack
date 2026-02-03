import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchProfile } from "../api/apis";

const Profile = () => {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProfile();
        setMe(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-400 to-green-400 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white rounded-[40px] shadow-2xl p-10"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h1>

        <div className="space-y-3 text-gray-700">
          <p><b>Name:</b> {me.firstName} {me.lastName}</p>
          <p><b>Email:</b> {me.email}</p>
          <p><b>Role:</b> {me.role}</p>
          <p><b>Wishlist items:</b> {me.wishlist?.length || 0}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
