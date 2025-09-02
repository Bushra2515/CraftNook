const mongoose = require("mongoose");

module.exports = async function connectDB() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.error("❌ MONGO_URI is missing in .env");
      process.exit(1);
    }
    await mongoose.connect(uri);
    console.log("✔ MongoDb connected");
  } catch (err) {
    console.error("❌ MongoDb error:", err.massage);
    process.exit(1);
  }
};
