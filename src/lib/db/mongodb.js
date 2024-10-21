import mongoose from "mongoose";

// const MONGO_URI = process.env.MONGO_URI;
export async function connectToDB() {
  try {
    const connect = await mongoose.connect(
      "mongodb://trah:trah@localhost:27017"
    );
    console.log("Connect to mongodb");
    return connect;
  } catch (error) {
    console.log("Error koneksinya pak ", error);
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
