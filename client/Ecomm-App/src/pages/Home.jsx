import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-cyan-400 to-green-400 px-4">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-[40px] shadow-2xl w-full max-w-4xl p-12 md:p-14 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Welcome to ShopEase
        </h1>

        <p className="text-gray-600 mb-8">
          Your one-stop destination for smart shopping.
        </p>

        <Link
          to="/products"
          className="inline-block px-10 py-4 rounded-full text-white text-lg font-semibold
          bg-gradient-to-r from-cyan-500 to-green-500 hover:opacity-90 transition"
        >
          Shop Here
        </Link>
      </motion.div>
    </div>
  );
};

export default Home;
