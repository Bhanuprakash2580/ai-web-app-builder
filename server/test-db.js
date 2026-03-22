import mongoose from 'mongoose';
import 'dotenv/config';

const testConnection = async () => {
  const uri = "mongodb+srv://nxtuser:nxtuser29062001@smartcodetranslator.bqmkpjq.mongodb.net/nxtbuild?retryWrites=true&w=majority";
  try {
    console.log("Attempting to connect to MongoDB...");
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("SUCCESS: Connected to MongoDB!");
    process.exit(0);
  } catch (error) {
    console.error("FAILURE: Could not connect to MongoDB.");
    console.error("Reason:", error.message);
    process.exit(1);
  }
};

testConnection();
