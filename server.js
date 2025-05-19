import dotenv from "dotenv";
// Load environment variables from .env file
dotenv.config();

import connectDB from "./src/db/connection.js";
import { app } from "./app.js";

// Define PORT from environment variables
const PORT = process.env.PORT;

const startServer = async () => {
  try {
    await connectDB();
    // Listen on all interfaces with 0.0.0.0
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to the database", error);
    process.exit(1); // Exit with error
  }
};

startServer();
