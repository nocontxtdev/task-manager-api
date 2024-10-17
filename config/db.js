const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
    process.exit(1); // Exit process with failure code
  }
};

// Event listener for connection errors
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

module.exports = connectDB;
