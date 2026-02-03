import Product from "../model/productModel.js";

/* ================= CREATE PRODUCT (ADMIN) ================= */
export const createProduct = async (req, res) => {
  try {
    const { title, price, image, description, category } = req.body;

    if (!title || !price || !image) {
      return res.status(400).json({ message: "title, price, image are required" });
    }

    const product = await Product.create({
      title,
      price: Number(price),
      image,
      description: description || "",
      category: category || "general",
    });

    return res.status(201).json(product);
  } catch (err) {
    console.log("CREATE PRODUCT ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET ALL PRODUCTS ================= */
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json(products);
  } catch (err) {
    console.log("GET PRODUCTS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET SINGLE PRODUCT ================= */
export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.status(200).json(product);
  } catch (err) {
    console.log("GET SINGLE PRODUCT ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ================= COUNT PRODUCTS ================= */
export const getProductCount = async (req, res) => {
  try {
    const count = await Product.countDocuments();
    return res.status(200).json({ count });
  } catch (err) {
    console.log("GET PRODUCT COUNT ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ================= ✅ GET PRODUCT REVIEWS =================
   GET /api/products/:id/reviews
*/
export const getProductReviews = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select(
      "reviews ratingAvg ratingCount"
    );
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

/* ================= ✅ ADD PRODUCT REVIEW =================
   POST /api/products/:id/reviews (protected)
   body: { rating, comment }
*/
export const addProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const r = Number(rating);

    if (!r || r < 1 || r > 5)
      return res.status(400).json({ message: "Rating must be 1-5" });

    if (!comment || comment.trim().length < 2)
      return res.status(400).json({ message: "Comment required" });

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // prevent duplicate review by same user
    const already = (product.reviews || []).some(
      (rev) => rev.user?.toString() === req.userId
    );
    if (already)
      return res.status(400).json({ message: "You already reviewed this product" });

    const user = req.user; // (we will attach in auth middleware)
    const name = user?.firstName
      ? `${user.firstName} ${user.lastName || ""}`.trim()
      : "User";

    product.reviews.push({
      user: req.userId,
      name,
      rating: r,
      comment: comment.trim(),
    });

    // recalc avg
    product.ratingCount = product.reviews.length;
    product.ratingAvg =
      product.reviews.reduce((sum, x) => sum + (x.rating || 0), 0) /
      product.ratingCount;

    await product.save();

    return res.status(201).json({
      message: "Review added",
      ratingAvg: product.ratingAvg,
      ratingCount: product.ratingCount,
      reviews: product.reviews,
    });
  } catch (err) {
    console.log("ADD REVIEW ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
