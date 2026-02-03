import axios from "axios";

const BASE = "import.meta.env.VITE_BACKEND_URL";
console.log(BASE);

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

/* ================= AUTH ================= */
export const Login = (data) =>
  axios.post(`${BASE}/auth/login`, data).then((res) => res.data);

export const Register = (data) =>
  axios.post(`${BASE}/auth/register`, data).then((res) => res.data);

/* ================= PRODUCTS ================= */
export const fetchProducts = () =>
  axios.get(`${BASE}/products`).then((res) => res.data);

export const fetchSingleProduct = (id) =>
  axios.get(`${BASE}/products/${id}`).then((res) => res.data);

export const createProduct = (data) =>
  axios.post(`${BASE}/products/create`, data, authHeaders()).then((res) => res.data);

/* ================= USERS (ADMIN) ================= */
export const fetchUsers = () =>
  axios.get(`${BASE}/users`, authHeaders()).then((res) => res.data);

export const addUser = (data) =>
  axios.post(`${BASE}/users`, data, authHeaders()).then((res) => res.data);

export const deleteUser = (id) =>
  axios.delete(`${BASE}/users/${id}`, authHeaders()).then((res) => res.data);

/* ================= ORDERS ================= */
export const createOrder = (data) =>
  axios.post(`${BASE}/orders`, data, authHeaders()).then((res) => res.data);

// ✅ ADMIN ONLY
export const fetchOrders = () =>
  axios.get(`${BASE}/orders`, authHeaders()).then((res) => res.data);

// ✅ USER ORDER HISTORY
export const fetchMyOrders = () =>
  axios.get(`${BASE}/orders/my-orders`, authHeaders()).then((res) => res.data);

// ✅ ADMIN: update order status (placed/confirmed/shipped/delivered)
export const updateOrderStatus = (orderId, payload) =>
  axios.put(`${BASE}/orders/${orderId}/status`, payload, authHeaders()).then((res) => res.data);

/* ================= WISHLIST ================= */
export const getWishlist = () =>
  axios.get(`${BASE}/wishlist`, authHeaders()).then((res) => res.data);

export const addToWishlist = (productId) =>
  axios.post(`${BASE}/wishlist/${productId}`, {}, authHeaders()).then((res) => res.data);

export const removeFromWishlist = (productId) =>
  axios.delete(`${BASE}/wishlist/${productId}`, authHeaders()).then((res) => res.data);

export const toggleWishlist = (productId) =>
  axios.post(`${BASE}/wishlist/toggle/${productId}`, {}, authHeaders()).then((res) => res.data);

/* ================= ✅ REVIEWS ================= */
export const fetchProductReviews = (productId) =>
  axios.get(`${BASE}/products/${productId}/reviews`).then((res) => res.data);

export const addProductReview = (productId, payload) =>
  axios.post(`${BASE}/products/${productId}/reviews`, payload, authHeaders()).then((res) => res.data);

export const updateProductReview = (productId, reviewId, payload) =>
  axios
    .put(`${BASE}/products/${productId}/reviews/${reviewId}`, payload, authHeaders())
    .then((res) => res.data);

export const deleteProductReview = (productId, reviewId) =>
  axios
    .delete(`${BASE}/products/${productId}/reviews/${reviewId}`, authHeaders())
    .then((res) => res.data);
