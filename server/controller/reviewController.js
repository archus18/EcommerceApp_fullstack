import Product from "../model/productModel.js";

/* helper: recompute avg + count */
const recalcRatings = (product) => {
  const count = product.reviews.length;
  const avg =
    count === 0
      ? 0
      : product.reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / count;

  product.ratingCount = count;
  product.ratingAvg = Number(avg.toFixed(1));
};

/* ✅ GET /api/products/:productId/reviews */
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId).select("reviews ratingAvg ratingCount");
    if (!product) return res.status(404).json({ message: "Product not found" });

    return res.status(200).json({
      reviews: product.reviews || [],
      ratingAvg: product.ratingAvg || 0,
      ratingCount: product.ratingCount || 0,
    });
  } catch (err) {
    console.log("GET REVIEWS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ✅ POST /api/products/:productId/reviews (auth) */
export const addProductReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }
    if (!comment || comment.trim().length < 2) {
      return res.status(400).json({ message: "Comment is required" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // ✅ Prevent duplicate reviews by same user
    const already = product.reviews.find((r) => r.user.toString() === req.userId);
    if (already) {
      return res.status(400).json({ message: "You already reviewed this product" });
    }

    const name =
      req.user?.firstName
        ? `${req.user.firstName} ${req.user?.lastName || ""}`.trim()
        : "User";

    product.reviews.push({
      user: req.userId,
      name,
      rating: Number(rating),
      comment: comment.trim(),
    });

    recalcRatings(product);
    await product.save();

    return res.status(201).json({
      message: "Review added",
      reviews: product.reviews,
      ratingAvg: product.ratingAvg,
      ratingCount: product.ratingCount,
    });
  } catch (err) {
    console.log("ADD REVIEW ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ✅ PUT /api/products/:productId/reviews/:reviewId (auth, owner only) */
export const updateProductReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;
    const { rating, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const review = product.reviews.id(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    // ✅ Only owner can edit
    if (review.user.toString() !== req.userId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (rating) {
      const r = Number(rating);
      if (r < 1 || r > 5) return res.status(400).json({ message: "Invalid rating" });
      review.rating = r;
    }

    if (comment) {
      if (comment.trim().length < 2) return res.status(400).json({ message: "Invalid comment" });
      review.comment = comment.trim();
    }

    recalcRatings(product);
    await product.save();

    return res.status(200).json({
      message: "Review updated",
      reviews: product.reviews,
      ratingAvg: product.ratingAvg,
      ratingCount: product.ratingCount,
    });
  } catch (err) {
    console.log("UPDATE REVIEW ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ✅ DELETE /api/products/:productId/reviews/:reviewId (auth, owner OR admin) */
export const deleteProductReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const review = product.reviews.id(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    const isOwner = review.user.toString() === req.userId;
    const isAdmin = req.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not allowed" });
    }

    review.deleteOne();
    recalcRatings(product);
    await product.save();

    return res.status(200).json({
      message: "Review deleted",
      reviews: product.reviews,
      ratingAvg: product.ratingAvg,
      ratingCount: product.ratingCount,
    });
  } catch (err) {
    console.log("DELETE REVIEW ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
