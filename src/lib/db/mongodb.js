import mongoose from "mongoose";

const { MONGO_USER, MONGO_PASSWORD, MONGO_DB } = process.env;

if (!MONGO_USER || !MONGO_PASSWORD || !MONGO_DB) {
  console.error(
    "Error: Missing required environment variables MONGO_USER, MONGO_PASSWORD, or MONGO_DB"
  );
  process.exit(1);
}

const MONGO_URI = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@localhost:27017/${MONGO_DB}?authSource=admin`;

export const connectToMongoDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (error) => {
  console.log("Error connecting to MongoDB", error);
});

mongoose.connection.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
});
