import mongoose, { Mongoose } from "mongoose";

export interface DatabaseConfig {
  mongo: {
    user: string;
    password: string;
    db: string;
    uri: string;
  };
}

// const { MONGO_USER, MONGO_PASSWORD, MONGO_DB } = process.env;
// if (!MONGO_USER || !MONGO_PASSWORD || !MONGO_DB) {
//   console.error(
//     "Error: Missing required environment variables MONGO_USER, MONGO_PASSWORD, or MONGO_DB"
//   );
// }
// const MONGO_URI = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@localhost:27017/${MONGO_DB}?authSource=admin`;

export const connectToMongoDB = async (
  config: DatabaseConfig
): Promise<Mongoose> => {
  try {
    if (mongoose.connection.readyState === 0) {
      mongoose.connection.removeAllListeners();

      const connectionString = config.mongo.uri
        .replace("<username>", config.mongo.user)
        .replace("<password>", config.mongo.password)
        .replace("<dbname>", config.mongo.db);

      await mongoose.connect(connectionString);
    }
  } catch (error) {
    console.log("Error connecting to MongoDB", error);
    throw error;
  }
  return mongoose;
};

export const clientMongoose = async (config: DatabaseConfig) => {
  await connectToMongoDB(config);
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
