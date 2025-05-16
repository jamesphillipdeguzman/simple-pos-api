import express from "express";
import cors from "cors";
// import productRoutes from "./controller/productsController.js";
// import salesRoutes from "./controller/salesController.js";

// Initialize an express app
const app = express();
// Define PORT from environment variable or default to 3000
const PORT = process.env.port || 3001;

// CORS middleware
app.use(cors());

// Parse JSON payloads
app.use(express());

// Greet
app.get("/", (req, res) => {
  res.send("Hello from app.js!");
});

// Mount routes at /api/products and /api/sales
// app.use("/api/products", productRoutes);
// app.use("/api/sales", salesRoutes);

export { PORT, app };
