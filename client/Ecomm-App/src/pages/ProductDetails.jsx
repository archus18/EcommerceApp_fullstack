import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import {
  fetchSingleProduct,
  fetchProductReviews,
  addProductReview,
  updateProductReview,
  deleteProductReview,
} from "../api/apis";

/* ================= UI Helpers ================= */
const Stars = ({ value = 0, size = "text-base" }) => {
  const full = Math.floor(value);
  const half = value - full >= 0.5;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= full;
        const isHalf = !filled && half && i === full + 1;
        return (
          <span
            key={i}
            className={`${size} ${
              filled
                ? "text-amber-500"
                : isHalf
                ? "text-amber-400"
                : "text-gray-300"
            }`}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

const Pill = ({ children, tone = "gray" }) => {
  const styles = {
    gray: "bg-white border-gray-200 text-gray-700",
    green: "bg-emerald-50 border-emerald-200 text-emerald-700",
    yellow: "bg-amber-50 border-amber-200 text-amber-700",
    blue: "bg-blue-50 border-blue-200 text-blue-700",
  };
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-semibold ${styles[tone]}`}
    >
      {children}
    </span>
  );
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const myId = user?._id || user?.id;
  const isAdmin = user?.role === "admin";

  const [product, setProduct] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [ratingAvg, setRatingAvg] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);

  const [myRating, setMyRating] = useState(5);
  const [myComment, setMyComment] = useState("");

  // ✅ edit state
  const [editingId, setEditingId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");

  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  const createdText = (d) => {
    try {
      return new Date(d).toLocaleString();
    } catch {
      return "";
    }
  };

  const refreshReviews = async () => {
    const r = await fetchProductReviews(id);
    setReviews(Array.isArray(r?.reviews) ? r.reviews : []);
    setRatingAvg(Number(r?.ratingAvg || 0));
    setRatingCount(Number(r?.ratingCount || 0));
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const p = await fetchSingleProduct(id);
        setProduct(p);
        await refreshReviews();
      } catch (err) {
        console.log("PRODUCT DETAILS ERROR:", err?.response?.data || err);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    toast.success("Added to cart ✅");
    navigate("/cart");
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to add a review");
      navigate("/login");
      return;
    }

    if (!myComment.trim() || myComment.trim().length < 2) {
      toast.error("Please write a short comment");
      return;
    }

    try {
      setPosting(true);
      const res = await addProductReview(id, {
        rating: Number(myRating),
        comment: myComment.trim(),
      });

      setReviews(Array.isArray(res?.reviews) ? res.reviews : []);
      setRatingAvg(Number(res?.ratingAvg || 0));
      setRatingCount(Number(res?.ratingCount || 0));
      setMyComment("");

      toast.success("Review added 🎉");
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to add review";
      toast.error(msg);
    } finally {
      setPosting(false);
    }
  };

  const startEdit = (rev) => {
    setEditingId(rev._id);
    setEditRating(Number(rev.rating || 5));
    setEditComment(rev.comment || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditRating(5);
    setEditComment("");
  };

  const handleUpdateReview = async (reviewId) => {
    if (!editComment.trim() || editComment.trim().length < 2) {
      toast.error("Please write a short comment");
      return;
    }

    try {
      setPosting(true);
      const res = await updateProductReview(id, reviewId, {
        rating: Number(editRating),
        comment: editComment.trim(),
      });

      setReviews(Array.isArray(res?.reviews) ? res.reviews : []);
      setRatingAvg(Number(res?.ratingAvg || 0));
      setRatingCount(Number(res?.ratingCount || 0));
      cancelEdit();

      toast.success("Review updated ✅");
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to update review";
      toast.error(msg);
    } finally {
      setPosting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      setPosting(true);
      const res = await deleteProductReview(id, reviewId);

      setReviews(Array.isArray(res?.reviews) ? res.reviews : []);
      setRatingAvg(Number(res?.ratingAvg || 0));
      setRatingCount(Number(res?.ratingCount || 0));

      toast.info("Review deleted");
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to delete review";
      toast.error(msg);
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white w-full max-w-xl rounded-3xl shadow p-8 text-center border">
          <p className="font-semibold text-gray-800">Loading product...</p>
          <p className="text-sm text-gray-500 mt-1">Please wait</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow p-8 text-center border">
          <p className="font-semibold text-gray-800">Product not found</p>
          <Link
            to="/products"
            className="inline-block mt-3 text-green-700 font-semibold hover:underline"
          >
            Go back to products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ================= PRODUCT CARD ================= */}
        <div className="bg-white rounded-3xl shadow-lg border overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left: Image */}
            <div className="p-6 lg:p-10 bg-white">
              <div className="rounded-3xl border bg-gray-50 p-4 flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full max-h-[430px] object-contain"
                />
              </div>
              <p className="text-xs text-gray-400 mt-3">
                Image shown is for reference purpose.
              </p>
            </div>

            {/* Right: Info */}
            <div className="p-6 lg:p-10">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="text-3xl font-extrabold text-gray-900">
                    {product.title}
                  </h1>

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <Pill tone="green">
                      <Stars value={ratingAvg} />
                      <span className="font-extrabold">{ratingAvg.toFixed(1)}</span>
                    </Pill>

                    <span className="text-sm text-gray-500">
                      {ratingCount} rating{ratingCount === 1 ? "" : "s"}
                    </span>

                    {product.category && (
                      <span className="text-sm text-gray-500">
                        • <span className="font-semibold capitalize">{product.category}</span>
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => navigate("/products")}
                  className="shrink-0 rounded-2xl border px-4 py-2 font-semibold hover:bg-gray-50 transition"
                >
                  Back
                </button>
              </div>

              <div className="mt-6">
                <p className="text-3xl font-extrabold text-blue-600">
                  ₹{product.price}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Inclusive of all taxes • Free delivery
                </p>
              </div>

              <div className="mt-6">
                <p className="text-sm font-extrabold text-gray-900 mb-2">
                  Description
                </p>
                <p className="text-gray-600 leading-relaxed">
                  {product.description || "No description available."}
                </p>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-green-500 text-white font-extrabold hover:opacity-95 transition shadow"
                >
                  Add to Cart
                </button>

                <button
                  onClick={() => navigate("/products")}
                  className="w-full sm:w-auto px-8 py-3 rounded-2xl border font-extrabold hover:bg-gray-50 transition"
                >
                  Continue Shopping
                </button>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-2xl border bg-gray-50 p-4">
                  <p className="text-sm font-extrabold text-gray-900">✅ Genuine</p>
                  <p className="text-xs text-gray-500 mt-1">Verified products</p>
                </div>
                <div className="rounded-2xl border bg-gray-50 p-4">
                  <p className="text-sm font-extrabold text-gray-900">🚚 Fast Delivery</p>
                  <p className="text-xs text-gray-500 mt-1">Free & quick shipping</p>
                </div>
                <div className="rounded-2xl border bg-gray-50 p-4">
                  <p className="text-sm font-extrabold text-gray-900">↩ Easy Return</p>
                  <p className="text-xs text-gray-500 mt-1">7-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= REVIEWS ================= */}
        <div className="bg-white rounded-3xl shadow-lg border p-6 lg:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">
                Customer Reviews
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                See what people are saying about this product.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Stars value={ratingAvg} size="text-lg" />
              <span className="text-sm font-extrabold text-gray-800">
                {ratingAvg.toFixed(1)} ({ratingCount})
              </span>
            </div>
          </div>

          {/* Add Review */}
          <div className="rounded-3xl border bg-slate-50 p-5 mb-6">
            <h3 className="text-lg font-extrabold text-gray-900 mb-3">
              Write a review
            </h3>

            {!user ? (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-sm text-gray-600">
                  Please login to add a review.
                </p>
                <button
                  onClick={() => navigate("/login")}
                  className="px-6 py-2 rounded-2xl bg-blue-600 text-white font-extrabold hover:bg-blue-700 transition"
                >
                  Login
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmitReview}
                className="grid grid-cols-1 md:grid-cols-6 gap-3"
              >
                <div className="md:col-span-1">
                  <label className="text-sm font-bold text-gray-700">Rating</label>
                  <select
                    value={myRating}
                    onChange={(e) => setMyRating(Number(e.target.value))}
                    className="w-full mt-1 border rounded-2xl px-3 py-2 bg-white"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>
                        {r} ★
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-4">
                  <label className="text-sm font-bold text-gray-700">Comment</label>
                  <input
                    value={myComment}
                    onChange={(e) => setMyComment(e.target.value)}
                    placeholder="Share your experience..."
                    className="w-full mt-1 border rounded-2xl px-4 py-2"
                  />
                </div>

                <div className="md:col-span-1 flex items-end">
                  <button
                    type="submit"
                    disabled={posting}
                    className="w-full px-4 py-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-green-500 text-white font-extrabold hover:opacity-95 transition disabled:opacity-60"
                  >
                    {posting ? "Posting..." : "Post"}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Review List */}
          {reviews.length === 0 ? (
            <p className="text-gray-600 text-sm">No reviews yet. Be the first one!</p>
          ) : (
            <div className="space-y-4">
              {reviews
                .slice()
                .reverse()
                .map((rev) => {
                  const revUserId = (rev.user || "").toString();
                  const canEdit = myId && revUserId === myId;
                  const canDelete = (myId && revUserId === myId) || isAdmin;

                  return (
                    <div
                      key={rev._id}
                      className="rounded-3xl border p-5 hover:shadow-md transition bg-white"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="font-extrabold text-gray-900">
                            {rev.name || "User"}
                          </p>

                          <div className="mt-1 flex items-center gap-3">
                            <Stars value={Number(rev.rating || 0)} />
                            <Pill tone="gray">
                              <span className="font-extrabold">
                                {Number(rev.rating || 0).toFixed(1)}
                              </span>
                            </Pill>
                          </div>
                        </div>

                        <p className="text-xs text-gray-400">
                          {createdText(rev.createdAt)}
                        </p>
                      </div>

                      {/* Edit mode */}
                      {editingId === rev._id ? (
                        <div className="mt-4 rounded-2xl border bg-slate-50 p-4">
                          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                            <div className="md:col-span-1">
                              <label className="text-sm font-bold text-gray-700">
                                Rating
                              </label>
                              <select
                                value={editRating}
                                onChange={(e) => setEditRating(Number(e.target.value))}
                                className="w-full mt-1 border rounded-2xl px-3 py-2 bg-white"
                              >
                                {[5, 4, 3, 2, 1].map((r) => (
                                  <option key={r} value={r}>
                                    {r} ★
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="md:col-span-4">
                              <label className="text-sm font-bold text-gray-700">
                                Comment
                              </label>
                              <input
                                value={editComment}
                                onChange={(e) => setEditComment(e.target.value)}
                                className="w-full mt-1 border rounded-2xl px-4 py-2"
                              />
                            </div>

                            <div className="md:col-span-1 flex items-end gap-2">
                              <button
                                type="button"
                                disabled={posting}
                                onClick={() => handleUpdateReview(rev._id)}
                                className="flex-1 px-3 py-2 rounded-2xl bg-blue-600 text-white font-extrabold hover:bg-blue-700 transition disabled:opacity-60"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={cancelEdit}
                                className="flex-1 px-3 py-2 rounded-2xl border font-extrabold hover:bg-white transition"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-700 mt-3 leading-relaxed">
                          {rev.comment}
                        </p>
                      )}

                      {/* Actions */}
                      {(canEdit || canDelete) && editingId !== rev._id && (
                        <div className="flex gap-4 mt-4">
                          {canEdit && (
                            <button
                              type="button"
                              onClick={() => startEdit(rev)}
                              className="text-sm font-extrabold text-blue-600 hover:underline"
                            >
                              Edit
                            </button>
                          )}

                          {canDelete && (
                            <button
                              type="button"
                              onClick={() => handleDeleteReview(rev._id)}
                              className="text-sm font-extrabold text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
