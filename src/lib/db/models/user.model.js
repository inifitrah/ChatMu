import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: String,
  lastSeen: { type: Date, default: Date.now },
  isOnline: { type: Boolean, default: false },
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
