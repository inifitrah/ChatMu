import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  avatar: String,
  lastSeen: { type: Date, default: Date.now },
  isOnline: { type: Boolean, default: false },
});

const conversationSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    lastMessage: {
      content: String,
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  },
  { timestamps: true }
);

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, required: true },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
  },
  { timestamps: true }
);

export const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);
export const User = mongoose.models.User || mongoose.model("User", userSchema);
// export const Conversation =
//   mongoose.Conversation || mongoose.model("Conversation", conversationSchema);
