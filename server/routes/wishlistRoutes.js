import { Router } from "express";
import { authentication } from "../middleware/authentication.js";

import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
} from "../controller/wishlistController.js";

const wishlistRouter = Router();

wishlistRouter.get("/", authentication, getWishlist);
wishlistRouter.post("/:productId", authentication, addToWishlist);
wishlistRouter.delete("/:productId", authentication, removeFromWishlist);
wishlistRouter.post("/toggle/:productId", authentication, toggleWishlist);

export default wishlistRouter;
