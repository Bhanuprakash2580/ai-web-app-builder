import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in your .env file');
    }

    // Mongoose 9.x handles connection options automatically
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging
      connectTimeoutMS: 10000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    process.env.MOCK_DB = "false";
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.warn("⚠️ FALLBACK: Starting server in MOCK MODE with in-memory data.");
    process.env.MOCK_DB = "true";
    // Do not exit, allow server to run for UI demo
  }
};

export default connectDB;
