import connectDB from "./db/connection.js";
import { PORT, app } from "./app.js";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

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
