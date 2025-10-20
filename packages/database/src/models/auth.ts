import mongoose, { Document, Schema } from "mongoose";

// USER
interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  password?: string;
  image?: string;
  role?: string;
  emailVerified?: Date;
  lastSeen: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: String,
  image: String,
  role: { type: String, default: "USER" },
  emailVerified: { type: Date },
});

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

// ACCOUNT
interface IAccount extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
}

const accountSchema = new Schema<IAccount>({
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
  mongoose.models.Account || mongoose.model<IAccount>("Account", accountSchema);

// SESSION
interface ISession extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  expires: Date;
  sessionToken: string;
}

const sessionSchema = new Schema<ISession>({
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
  mongoose.models.Session || mongoose.model<ISession>("Session", sessionSchema);

// VERIFICATION TOKEN
interface IVerificationToken extends Document {
  token: string;
  email: string;
  expires: Date;
}

const verificationTokenSchema = new Schema<IVerificationToken>({
  token: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  expires: Date,
});

export const VerificationToken =
  mongoose.models.VerificationToken ||
  mongoose.model<IVerificationToken>(
    "VerificationToken",
    verificationTokenSchema
  );
