import React, { useState } from "react";
import { Login } from "../../api/apis";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await Login({ email, password });

      const token = response?.token;
      const user = response?.user;
      const role = user?.role || response?.role || "user";

      if (!token || !user) {
        setError(response?.message || "Login failed");
        return;
      }

      // ✅ SAVE AUTH
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", role);

      // ✅ ROLE BASED REDIRECT
      if (role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      const data = err?.response?.data;
      const msg =
        (data && typeof data === "object" ? data.message : data) ||
        "Invalid credentials";

      setError(msg);
      console.log("LOGIN ERROR:", data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-cyan-400 to-green-400 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <div className="bg-white rounded-[40px] shadow-2xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
          {/* Left Section */}
          <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-cyan-500 to-green-500 text-white p-10">
            <h2 className="text-4xl font-bold mb-4 tracking-wide">WELCOME</h2>
            <p className="text-center text-sm opacity-90 mb-6 leading-relaxed">
              Login to access your account and continue shopping.
            </p>

            <Link
              to="/register"
              className="border border-white px-6 py-2 rounded-full hover:bg-white hover:text-green-600 transition font-semibold"
            >
              Create Account
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex flex-col justify-center p-8 md:p-12">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Login Here
            </h3>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full border rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full border rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-full text-white font-semibold bg-gradient-to-r from-cyan-500 to-green-500 hover:opacity-90 transition disabled:opacity-60"
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="text-center text-sm mt-4 md:hidden text-gray-700">
              Don’t have an account?{" "}
              <Link to="/register" className="text-green-700 font-semibold">
                Register
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
