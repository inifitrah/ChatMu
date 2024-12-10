import mongoose from "mongoose";

// USER
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: String,
  image: String,
  role: { type: String, default: "USER" },
  emailVerified: { type: Date },
});
export const User = mongoose.models.User || mongoose.model("User", userSchema);

// ACCOUNT
const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  type: String,
  provider: String,
  providerAccountId: String,
  refresh_token: String,
  access_token: String,
  expires_at: Number,
  token_type: String,
  scope: String,
  id_token: String,
  session_state: String,
});
export const Account =
  mongoose.models.Account || mongoose.model("Account", accountSchema);

// SESSION
const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  expires: Date,
  sessionToken: {
    type: String,
    unique: true,
  },
});
export const Session =
  mongoose.models.Session || mongoose.model("Session", sessionSchema);

// VERIFICATION TOKEN
const verificationTokenSchema = new mongoose.Schema({
  identifier: String,
  token: {
    type: String,
    unique: true,
  },
  expires: Date,
});
export const VerificationToken =
  mongoose.models.VerificationToken ||
  mongoose.model("VerificationToken", verificationTokenSchema);
