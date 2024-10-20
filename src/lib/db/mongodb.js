import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;
export async function connectToDB() {
  try {
    return await mongoose.connect(MONGO_URI);
  } catch (error) {
    console.log("ERR CONNECTION ", error);
    throw error;
  }
}

mongoose.connection.on("connected", () => {
  console.log("CONNECT IS SUCCESS");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});
