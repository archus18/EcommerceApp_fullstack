import { Router } from "express";
import {
  createProduct,
  getProducts,
  getSingleProduct,
  getProductCount,
  getProductReviews,
  addProductReview,
} from "../controller/productController.js";

import { authentication } from "../middleware/authentication.js";

const router = Router();

/* ================= PRODUCTS ================= */

// ✅ ADMIN ONLY CREATE
router.post("/create", authentication, (req, res, next) => {
  if (req.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
}, createProduct);

router.get("/", getProducts);
router.get("/count", getProductCount);
router.get("/:id", getSingleProduct);

/* ================= ✅ REVIEWS ================= */
router.get("/:id/reviews", getProductReviews);
router.post("/:id/reviews", authentication, addProductReview);

export default router;
