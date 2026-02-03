import { NavLink, Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-r from-cyan-400 to-green-400">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-10 text-gray-800">
          ShopEase Admin
        </h1>

        <nav className="space-y-3 font-medium">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `block px-4 py-3 rounded-xl transition ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500 to-green-500 text-white shadow"
                  : "hover:bg-gray-100 text-gray-700"
              }`
            }
          >
            📊 Dashboard
          </NavLink>

          <NavLink
            to="/admin/create"
            className={({ isActive }) =>
              `block px-4 py-3 rounded-xl transition ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500 to-green-500 text-white shadow"
                  : "hover:bg-gray-100 text-gray-700"
              }`
            }
          >
            ➕ Create Product
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `block px-4 py-3 rounded-xl transition ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500 to-green-500 text-white shadow"
                  : "hover:bg-gray-100 text-gray-700"
              }`
            }
          >
            👥 Users
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `block px-4 py-3 rounded-xl transition ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500 to-green-500 text-white shadow"
                  : "hover:bg-gray-100 text-gray-700"
              }`
            }
          >
            📦 Orders
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
