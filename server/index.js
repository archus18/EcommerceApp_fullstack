import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import wishlistRouter from "./routes/wishlistRoutes.js";
import cartRouter from "./routes/cartRoutes.js";

import dbConnection from "./db/dbConnection.js";

dotenv.config({quite:true});




const app = express();
const PORT = 3000;

/* ================= MIDDLEWARE ================= */
app.use(express.json());

app.use(
  cors({
    origin: process.env.fRONTEND_URL, // ✅ allows all localhost ports in dev
    credentials: true,
  })
);

/* ================= DATABASE ================= */
dbConnection();

/* ================= ROUTES ================= */
app.get("/", (req, res) => {
  res.send("Ecommerce Backend is running");
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/cart", cartRouter);

/* ================= SERVER ================= */
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
