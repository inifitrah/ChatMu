import mongoose from "mongoose";

export const connectToMongoDB = async () => {
  try {
    await mongoose.connect("mongodb://root:admin123@localhost:27017");
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};
