const mongoose = require("mongoose");
let MongoMemoryServer;

try {
  MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer;
} catch (err) {
  MongoMemoryServer = null;
}

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  try {
    if (uri) {
      console.log(`Connecting to primary MongoDB URI...`);
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log("MongoDB Connected successfully to local/cloud instance!");
      return;
    }
  } catch (error) {
    console.warn("Primary MongoDB URI connection failed:", error.message);
  }

  // Fallback to in-memory MongoDB server if running in local Node environment
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    console.warn("Running on Vercel/Production without MONGODB_URI. Please set MONGODB_URI in Vercel environment variables.");
    return;
  }

  try {
    if (MongoMemoryServer) {
      const mongod = await MongoMemoryServer.create();
      const mongoUri = mongod.getUri();
      await mongoose.connect(mongoUri);
      console.log(`MongoDB Connected successfully via In-Memory instance at ${mongoUri}`);
    }
  } catch (memError) {
    console.error("Failed to start MongoDB Memory Server:", memError.message);
  }
};

module.exports = connectDB;
