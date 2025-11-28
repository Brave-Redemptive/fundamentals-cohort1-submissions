import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to database first, then start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log("Database connected successfully");

    // Start server
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Swagger docs available at http://localhost:${PORT}`);
    });

    // Handle server errors
    server.on("error", (err: any) => {
      console.error("Server error:", err);
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      console.log("SIGTERM received, shutting down gracefully");
      server.close(() => {
        console.log("Process terminated");
        process.exit(0);
      });
    });

    process.on("SIGINT", () => {
      console.log("SIGINT received, shutting down gracefully");
      server.close(() => {
        console.log("Process terminated");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();
