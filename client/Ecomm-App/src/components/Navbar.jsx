import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useCartDrawer } from "../context/CartDrawerContext";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const role = localStorage.getItem("role");
  const { openCart } = useCartDrawer();

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener("mousedown", onClickOutside);
    return () => window.removeEventListener("mousedown", onClickOutside);
  }, []);

  // ✅ Admin check
  const isAdmin = user?.role === "admin" && role === "admin";
  const isUser = user && !isAdmin;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setOpen(false);
    navigate("/login", { replace: true });
  };

  const requireLogin = () => {
    if (!user) {
      navigate("/login");
      return false;
    }
    return true;
  };

  const handleOpenCart = () => {
    setOpen(false);
    if (!requireLogin()) return;
    openCart();
  };

  const handleWishlist = () => {
    setOpen(false);
    if (!requireLogin()) return;
    navigate("/wishlist");
  };

  const handleMyOrders = () => {
    setOpen(false);
    if (!requireLogin()) return;
    navigate("/my-orders");
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-cyan-500 to-green-500 text-white shadow">
      <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-wide hover:opacity-90">
          ShopEase
        </Link>

        {/* Desktop Links (ONLY Home + Products + Admin if admin) */}
        <div className="hidden md:flex items-center gap-8 font-medium">
          <Link to="/" className="hover:opacity-90">Home</Link>
          <Link to="/products" className="hover:opacity-90">Products</Link>

          {isAdmin && (
            <Link to="/admin" className="font-semibold hover:opacity-90">
              Admin
            </Link>
          )}
        </div>

        {/* Profile / Login */}
        <div className="relative" ref={menuRef}>
          {!user ? (
            <button
              onClick={() => navigate("/login")}
              className="bg-white/20 hover:bg-white/30 transition px-5 py-2 rounded-full font-semibold"
            >
              Login
            </button>
          ) : (
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 transition px-4 py-2 rounded-full"
            >
              <span className="h-8 w-8 rounded-full bg-white/30 flex items-center justify-center font-bold">
                {(user?.firstName || user?.email || "U")[0]?.toUpperCase()}
              </span>
              <span className="hidden sm:block font-semibold">
                {user?.firstName || "Account"}
              </span>
              <span className="text-sm opacity-90">▾</span>
            </button>
          )}

          {/* Dropdown */}
          {user && open && (
            <div className="absolute right-0 mt-3 w-56 bg-white text-gray-800 rounded-2xl shadow-xl overflow-hidden border">
              <div className="px-4 py-3 bg-gray-50">
                <p className="font-semibold">
                  {user?.firstName
                    ? `${user.firstName} ${user?.lastName || ""}`
                    : "User"}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>

              <div className="p-2">
                {/* ✅ USER MENU */}
                {isUser && (
                  <>
                    <button
                      type="button"
                      onClick={handleWishlist}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-100 transition"
                    >
                      ❤️ Wishlist
                    </button>

                    <button
                      type="button"
                      onClick={handleOpenCart}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-100 transition"
                    >
                      🛒 Cart
                    </button>

                    <button
                      type="button"
                      onClick={handleMyOrders}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-100 transition"
                    >
                      📦 My Orders
                    </button>
                  </>
                )}

                {/* ✅ ADMIN MENU */}
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setOpen(false)}
                    className="block px-3 py-2 rounded-xl hover:bg-gray-100 transition"
                  >
                    🛠 Admin Dashboard
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-red-50 text-red-600 transition font-semibold"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-4">
          <Link to="/products" className="hover:opacity-90 font-medium">
            Products
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
