const express = require("express");
require("dotenv").config(); // To load environment variables
const connectDB = require("./config/db");
const auth = require("./middleware/auth");

const app = express();

// Middleware
app.use(express.json()); // To parse incoming JSON payloads

// Environment variable validation
if (!process.env.MONGO_URI) {
  console.error("Mongo URI is missing in the environment variables!");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("JWT Secret is missing in the environment variables!");
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start the server
connectDB()
  .then(() => {
    // Routes
    app.use("/api/auth", require("./routes/auth"));
    app.use("/api/account", auth, require("./routes/account"));
    app.use("/api/tasks", auth, require("./routes/tasks"));

    // 404 Route Not Found handler
    app.use((req, res, next) => {
      const error = new Error("Not Found");
      error.status = 404;
      next(error);
    });

    // General error handler
    app.use((err, req, res, next) => {
      const statusCode = err.status || 500;
      const message = err.message || "Internal Server Error";
      res.status(statusCode).json({
        error: {
          message,
          ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
        },
      });
    });

    // Start the server
    const server = app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

    // Graceful shutdown on termination signals
    const shutdown = (signal) => {
      console.log(`Received ${signal}. Closing HTTP server...`);
      server.close(() => {
        console.log("HTTP server closed.");
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err.message);
    process.exit(1);
  });
