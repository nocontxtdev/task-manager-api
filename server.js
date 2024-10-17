const express = require("express");
require("dotenv").config(); // To load environment variables
const connectDB = require("./config/db");
const auth = require("./middleware/auth");

const app = express();

// Middleware
app.use(express.json()); // To parse incoming JSON payloads

// Connect to MongoDB
connectDB();

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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
