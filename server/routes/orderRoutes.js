import { Router } from "express";
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  getMyOrders,
  updateOrderStatus,
} from "../controller/orderController.js";

import { authentication, authorization } from "../middleware/authentication.js";

const router = Router();

/* ✅ USER ORDER HISTORY */
router.get("/my-orders", authentication, getMyOrders);

/* ✅ USER CREATE ORDER */
router.post("/", authentication, createOrder);

/* ✅ ADMIN: ALL ORDERS */
router.get("/", authentication, authorization, getAllOrders);

/* ✅ ADMIN: UPDATE STATUS (Placed → Shipped → Delivered) */
router.put("/:orderId/status", authentication, authorization, updateOrderStatus);

/* ✅ ADMIN: ORDERS OF ANY USER (optional) */
router.get("/user/:userId", authentication, authorization, getUserOrders);

export default router;
