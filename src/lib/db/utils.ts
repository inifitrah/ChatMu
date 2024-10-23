// import { cache } from "react";
// import { connectToMongoDB } from "./mongodb";
// import { User } from "./models/user.model";

// const connectDB = cache(async () => {
//   await connectToMongoDB();
// });

// export const getUser = cache(async () => {
//   await connectDB();

//   const users = await User.find({});
//   return users;
// });
