import { Router } from "express";
import {
  getAllUsers,
  createUser,
  deleteUser,
  getUserCount,
} from "../controller/userController.js";

import { authentication, authorization } from "../middleware/authentication.js";

const router = Router();

// ✅ ADMIN ONLY
router.get("/", authentication, authorization, getAllUsers);
router.post("/", authentication, authorization, createUser);
router.delete("/:id", authentication, authorization, deleteUser);
router.get("/count", authentication, authorization, getUserCount);

export default router;
