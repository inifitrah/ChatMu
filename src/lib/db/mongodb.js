import mongoose from "mongoose";

const { MONGO_USER, MONGO_PASSWORD, MONGO_DB } = process.env;

if (!MONGO_USER || !MONGO_PASSWORD || !MONGO_DB) {
  console.error(
    "Error: Missing required environment variables MONGO_USER, MONGO_PASSWORD, or MONGO_DB"
  );
}

const MONGO_URI = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@localhost:27017/${MONGO_DB}?authSource=admin`;

export const connectToMongoDB = async () => {
  try {
    console.log("<MONGODB STATE: ", mongoose.connection.readyState, " >");
    if (mongoose.connection.readyState === 0) {
      console.log("<Connecting...>");
      await mongoose.connect(MONGO_URI);
    } else {
      console.log("<USING EXISTING CONNECTION>");
    }
    // console.log("FromMONGOOSE", mongoose.connection.getClient());
  } catch (error) {
    throw new Error(error.message);
  }
};

export const clientMongoose = async () => {
  await connectToMongoDB();
  return mongoose.connection.getClient();
};

mongoose.connection.once("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.once("error", (error) => {
  console.log("Error connecting to MongoDB", error);
});

mongoose.connection.once("disconnected", () => {
  console.log("Disconnected from MongoDB");
});
