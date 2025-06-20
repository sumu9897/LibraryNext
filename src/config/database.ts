import mongoose from "mongoose";

/**
 * Establishes a connection to the MongoDB database using Mongoose.
 */
const connectToDatabase = async (): Promise<void> => {
  const uri = process.env.MONGO_DB_URI;

  if (!uri) {
    throw new Error("MONGO_DB_URI is not defined in the environment variables.");
  }

  try {
    await mongoose.connect(uri);
    console.log("✅ Successfully connected to MongoDB.");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    process.exit(1); // Exit process on failure to avoid undefined behavior
  }
};

export default connectToDatabase;
