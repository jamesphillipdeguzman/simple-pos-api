import express from "express";
import cors from "cors";
// import productRoutes from "./controller/productsController.js";
// import salesRoutes from "./controller/salesController.js";

// Initialize an express app
const app = express();

// CORS middleware
app.use(cors());

// Parse JSON payloads
app.use(express());

// Greet
app.get("/", (req, res) => {
  res.send("Hello James De Guzman!");
});

// Mount routes at /api/products and /api/sales
// app.use("/api/products", productRoutes);
// app.use("/api/sales", salesRoutes);

export { app };
