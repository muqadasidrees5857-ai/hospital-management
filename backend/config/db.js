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
        serverSelectionTimeoutMS: 3000,
      });
      console.log("MongoDB Connected successfully to local/cloud instance!");
      return;
    }
  } catch (error) {
    console.warn("Primary MongoDB URI connection failed:", error.message);
    console.log("Attempting fallback to MongoDB Memory Server...");
  }

  // Fallback to in-memory MongoDB server for instant zero-setup execution
  try {
    if (MongoMemoryServer) {
      const mongod = await MongoMemoryServer.create();
      const mongoUri = mongod.getUri();
      await mongoose.connect(mongoUri);
      console.log(`MongoDB Connected successfully via In-Memory instance at ${mongoUri}`);
    } else {
      throw new Error("mongodb-memory-server package is not available.");
    }
  } catch (memError) {
    console.error("Failed to start MongoDB Memory Server:", memError.message);
    console.error("Please ensure MongoDB service is running or MONGODB_URI is valid.");
  }
};

module.exports = connectDB;
