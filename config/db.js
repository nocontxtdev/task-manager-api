const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
  }
};

module.exports = connectDB;
