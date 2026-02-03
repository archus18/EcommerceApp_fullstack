import { useState } from "react";
import { createProduct } from "../../api/apis";
import { motion } from "framer-motion";

const CreateProduct = () => {
  const [form, setForm] = useState({
    title: "",
    price: "",
    image: "",
    description: "",
    category: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.title || !form.price || !form.image || !form.category || !form.description) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      await createProduct(form);
      alert("✅ Product Added Successfully");

      setForm({
        title: "",
        price: "",
        image: "",
        description: "",
        category: "",
      });
    } catch (error) {
      console.log("CREATE PRODUCT ERROR:", error?.response?.data || error);
      alert("❌ Error adding product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-400 to-green-400 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-[40px] shadow-2xl p-8 md:p-12"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Create Product
          </h1>
          <p className="text-gray-600 mt-2">
            Add a new product to your ShopEase store
          </p>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Product Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. iPhone 14"
              className="w-full mt-1 border border-gray-300 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">
              Price (₹)
            </label>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="e.g. 69999"
              className="w-full mt-1 border border-gray-300 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-gray-700">
              Image URL
            </label>
            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full mt-1 border border-gray-300 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-gray-700">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-300 bg-white"
            >
              <option value="">Select Category</option>
              <option value="electronics">Electronics</option>
              <option value="clothes">Clothes</option>
              <option value="shoes">Shoes</option>
              <option value="books">Books</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Write product description..."
              rows={5}
              className="w-full mt-1 border border-gray-300 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>
        </div>

        {/* Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-10 py-4 rounded-full text-white text-lg font-semibold
            bg-gradient-to-r from-cyan-500 to-green-500 hover:opacity-90 transition
            disabled:opacity-60"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateProduct;
