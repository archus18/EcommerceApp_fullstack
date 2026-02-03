import { Router } from "express";
import { authentication } from "../middleware/authentication.js";
import {
  getCart,
  addToCartDB,
  updateCartQty,
  removeFromCartDB,
  clearCartDB,
} from "../controller/cartController.js";

const cartRouter = Router();

cartRouter.get("/", authentication, getCart);
cartRouter.post("/", authentication, addToCartDB);
cartRouter.put("/:productId", authentication, updateCartQty);
cartRouter.delete("/:productId", authentication, removeFromCartDB);
cartRouter.delete("/", authentication, clearCartDB);

export default cartRouter;
