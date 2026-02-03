import User from "../model/userModel.js";

// ✅ GET /api/wishlist  (protected)
export const getWishlist = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).populate("wishlist");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ wishlist: user.wishlist || [] });
  } catch (err) {
    console.log("GET WISHLIST ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ POST /api/wishlist/:productId (protected)
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const exists = user.wishlist.some((id) => id.toString() === productId);
    if (!exists) user.wishlist.push(productId);

    await user.save();

    const updated = await User.findById(userId).populate("wishlist");
    return res.status(200).json({
      message: "Added to wishlist",
      wishlist: updated.wishlist || [],
    });
  } catch (err) {
    console.log("ADD WISHLIST ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ DELETE /api/wishlist/:productId (protected)
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    await user.save();

    const updated = await User.findById(userId).populate("wishlist");
    return res.status(200).json({
      message: "Removed from wishlist",
      wishlist: updated.wishlist || [],
    });
  } catch (err) {
    console.log("REMOVE WISHLIST ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ POST /api/wishlist/toggle/:productId (protected)
export const toggleWishlist = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const exists = user.wishlist.some((id) => id.toString() === productId);

    if (exists) {
      user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    } else {
      user.wishlist.push(productId);
    }

    await user.save();

    const updated = await User.findById(userId).populate("wishlist");
    return res.status(200).json({
      message: exists ? "Removed from wishlist" : "Added to wishlist",
      wishlist: updated.wishlist || [],
    });
  } catch (err) {
    console.log("TOGGLE WISHLIST ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
