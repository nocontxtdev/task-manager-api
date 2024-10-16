const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config(); // To load environment variables

const app = express();

// Middleware
app.use(express.json()); // To parse incoming JSON payloads

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

app.get("/", (req, res) => {
  res.send("Welcome to task manager API");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
