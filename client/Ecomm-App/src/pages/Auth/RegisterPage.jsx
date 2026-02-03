import React, { useState } from "react";
import { Register } from "../../api/apis.js";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    const registerData = {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    };

    try {
      const response = await Register(registerData);

      // ✅ with your updated backend, response is usually { message: "User registered successfully" }
      if (response?.message) {
        setSuccess(response.message || "Registered successfully!");
        setTimeout(() => navigate("/login"), 1200);
      } else if (response?.success || response?.token) {
        setSuccess("Account created successfully. Redirecting to login…");
        setTimeout(() => navigate("/login"), 1200);
      } else {
        setError(response?.message || "Unable to register. Please try again.");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Registration failed. Please retry.";

      setError(msg);
      console.log("REGISTER ERROR:", err?.response?.data);
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
        {/* Card */}
        <div className="bg-white rounded-[40px] shadow-2xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
          {/* Left Section */}
          <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-cyan-500 to-green-500 text-white p-10">
            <h2 className="text-4xl font-bold mb-4 tracking-wide">JOIN US</h2>
            <p className="text-center text-sm opacity-90 mb-6 leading-relaxed">
              Create your account and start shopping smarter with us.
            </p>

            <Link
              to="/login"
              className="border border-white px-6 py-2 rounded-full hover:bg-white hover:text-green-600 transition font-semibold"
            >
              Already Member
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex flex-col justify-center p-8 md:p-12">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Register Here
            </h3>

            {/* Error / Success */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4 text-center">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm mb-4 text-center">
                {success}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <input
                type="text"
                placeholder="First Name"
                className="w-full border rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />

              <input
                type="text"
                placeholder="Last Name"
                className="w-full border rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />

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

              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full border rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-full text-white font-semibold bg-gradient-to-r from-cyan-500 to-green-500 hover:opacity-90 transition disabled:opacity-60"
              >
                {isLoading ? "Registering..." : "Register"}
              </button>
            </form>

            {/* Mobile-only login link */}
            <p className="text-center text-sm mt-4 md:hidden text-gray-700">
              Already have an account?{" "}
              <Link to="/login" className="text-green-700 font-semibold">
                Login
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
