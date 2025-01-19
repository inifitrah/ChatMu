import mongoose, { Mongoose } from "mongoose";

const { MONGO_USER, MONGO_PASSWORD, MONGO_DB } = process.env;

if (!MONGO_USER || !MONGO_PASSWORD || !MONGO_DB) {
  console.error(
    "Error: Missing required environment variables MONGO_USER, MONGO_PASSWORD, or MONGO_DB"
  );
}

const MONGO_URI = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@localhost:27017/${MONGO_DB}?authSource=admin`;

export const connectToMongoDB = async (): Promise<Mongoose> => {
  try {
    if (mongoose.connection.readyState === 0) {
      mongoose.connection.removeAllListeners();
      await mongoose.connect(MONGO_URI);
    }
  } catch (error) {
    console.log("Error connecting to MongoDB", error);
    throw error;
  }
  return mongoose;
};

export const clientMongoose = async () => {
  await connectToMongoDB();
  return mongoose.connection.getClient();
};

if (mongoose.connection.listeners("connected").length === 0) {
  mongoose.connection.once("connected", () => {
    console.log("Connected to MongoDB");
  });

  mongoose.connection.once("error", (error) => {
    console.log("Error connecting to MongoDB", error);
  });

  mongoose.connection.once("disconnected", () => {
    console.log("Disconnected from MongoDB");
  });
}
