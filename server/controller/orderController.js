import Order from "../model/orderModel.js";

/* ================= CREATE ORDER (USER) =================
   ✅ Protected route (authentication middleware)
   ✅ Uses req.userId from JWT (NOT userId from body)
   ✅ Returns populated order for UI
*/
export const createOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, totalAmount } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    const amount = Number(totalAmount);
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid totalAmount" });
    }

    const order = new Order({
      user: userId,
      items,
      totalAmount: amount,
      paymentStatus: "pending",
      orderStatus: "placed",
    });

    await order.save();

    const saved = await Order.findById(order._id)
      .populate("user", "firstName lastName email role")
      .populate("items.product", "title price image description category");

    return res.status(201).json(saved);
  } catch (error) {
    console.log("CREATE ORDER ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET ALL ORDERS (ADMIN) =================
   ✅ Protected + Admin only (authorization middleware)
*/
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "firstName lastName email role")
      .populate("items.product", "title price image category");

    return res.status(200).json(orders);
  } catch (error) {
    console.log("GET ALL ORDERS ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET MY ORDERS (USER) =================
   ✅ GET /api/orders/my-orders
   ✅ Protected
*/
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.userId;

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("items.product", "title price image category");

    return res.status(200).json(orders);
  } catch (error) {
    console.log("GET MY ORDERS ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET USER ORDERS (ADMIN OPTIONAL) =================
   ✅ GET /api/orders/user/:userId
   ✅ Admin-only
*/
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("items.product", "title price image category");

    return res.status(200).json(orders);
  } catch (error) {
    console.log("GET USER ORDERS ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ================= ✅ UPDATE ORDER STATUS (ADMIN) =================
   ✅ PUT /api/orders/:orderId/status
   ✅ Admin-only
   body: { orderStatus, paymentStatus }
*/
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const allowedStatus = ["placed", "confirmed", "shipped", "delivered"];
    const allowedPay = ["pending", "paid"];

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (orderStatus) {
      if (!allowedStatus.includes(orderStatus)) {
        return res.status(400).json({ message: "Invalid orderStatus" });
      }
      order.orderStatus = orderStatus;
    }

    if (paymentStatus) {
      if (!allowedPay.includes(paymentStatus)) {
        return res.status(400).json({ message: "Invalid paymentStatus" });
      }
      order.paymentStatus = paymentStatus;
    }

    await order.save();

    const updated = await Order.findById(orderId)
      .populate("user", "firstName lastName email role")
      .populate("items.product", "title price image category");

    return res.status(200).json(updated);
  } catch (error) {
    console.log("UPDATE ORDER STATUS ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
