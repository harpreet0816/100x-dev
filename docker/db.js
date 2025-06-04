// db.js
const mongoose = require("mongoose");

const mongoURI = "mongodb://mongo-container:27017/mydatabase"; // Update with your DB name

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
