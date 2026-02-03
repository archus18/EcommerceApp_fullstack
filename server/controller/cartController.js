import User from "../model/userModel.js";

// ✅ GET /api/cart  (protected)
export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("cart.product");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ cart: user.cart || [] });
  } catch (err) {
    console.log("GET CART ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ POST /api/cart (protected)
// body: { productId, qty }
export const addToCartDB = async (req, res) => {
  try {
    const { productId, qty = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const existing = user.cart.find((i) => i.product.toString() === productId);

    if (existing) {
      existing.qty += Number(qty);
    } else {
      user.cart.push({ product: productId, qty: Number(qty) });
    }

    await user.save();

    const updated = await User.findById(req.userId).populate("cart.product");
    return res.status(200).json({
      message: "Added to cart",
      cart: updated.cart || [],
    });
  } catch (err) {
    console.log("ADD CART ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ PUT /api/cart/:productId  (protected)
// body: { qty }
export const updateCartQty = async (req, res) => {
  try {
    const { productId } = req.params;
    const { qty } = req.body;

    const q = Number(qty);
    if (!q || q < 1) {
      return res.status(400).json({ message: "qty must be >= 1" });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const item = user.cart.find((i) => i.product.toString() === productId);
    if (!item) return res.status(404).json({ message: "Item not found in cart" });

    item.qty = q;
    await user.save();

    const updated = await User.findById(req.userId).populate("cart.product");
    return res.status(200).json({
      message: "Cart updated",
      cart: updated.cart || [],
    });
  } catch (err) {
    console.log("UPDATE CART ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ DELETE /api/cart/:productId (protected)
export const removeFromCartDB = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.cart = user.cart.filter((i) => i.product.toString() !== productId);
    await user.save();

    const updated = await User.findById(req.userId).populate("cart.product");
    return res.status(200).json({
      message: "Removed from cart",
      cart: updated.cart || [],
    });
  } catch (err) {
    console.log("REMOVE CART ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ DELETE /api/cart (protected) - clear all
export const clearCartDB = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.cart = [];
    await user.save();

    return res.status(200).json({ message: "Cart cleared", cart: [] });
  } catch (err) {
    console.log("CLEAR CART ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
