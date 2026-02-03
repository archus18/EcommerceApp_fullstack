import { useEffect, useState } from "react";
import { fetchUsers, addUser, deleteUser } from "../../api/apis";
import { motion } from "framer-motion";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "user",
  });

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("LOAD USERS ERROR:", err?.response?.data || err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAdd = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      await addUser(form);
      alert("✅ User added successfully");

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "user",
      });

      loadUsers();
    } catch (err) {
      console.log("ADD USER ERROR:", err?.response?.data || err);
      alert("❌ Failed to add user");
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this user?");
    if (!ok) return;

    try {
      await deleteUser(id);
      alert("✅ User deleted");
      loadUsers();
    } catch (err) {
      console.log("DELETE USER ERROR:", err?.response?.data || err);
      alert("❌ Failed to delete user");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-400 to-green-400 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto bg-white rounded-[40px] shadow-2xl p-8 md:p-12"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Users Management
          </h1>
          <p className="text-gray-600 mt-2">
            Add users and manage roles from here
          </p>
        </div>

        {/* Add User Form */}
        <div className="rounded-3xl border bg-gray-50 p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Add New User</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <input
              className="border border-gray-300 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-300"
              placeholder="First Name"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />

            <input
              className="border border-gray-300 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-300"
              placeholder="Last Name"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />

            <input
              className="border border-gray-300 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-300 lg:col-span-2"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
              type="password"
              className="border border-gray-300 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-300"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <select
              className="border border-gray-300 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-300 bg-white"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              onClick={handleAdd}
              className="px-8 py-3 rounded-full text-white font-semibold
              bg-gradient-to-r from-cyan-500 to-green-500 hover:opacity-90 transition"
            >
              Add User
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="rounded-3xl border overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500 to-green-500 text-white px-6 py-4">
            <h2 className="text-lg font-bold">All Users</h2>
          </div>

          {loading ? (
            <div className="text-center py-14">
              <p className="text-gray-500 font-medium">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-14">
              <p className="text-gray-700 font-semibold">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white">
              <table className="w-full">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {u.firstName} {u.lastName}
                      </td>
                      <td className="px-6 py-4 text-gray-700">{u.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold border ${
                            u.role === "admin"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : "bg-green-50 text-green-700 border-green-200"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDelete(u._id)}
                          className="text-red-600 font-semibold hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Users;
