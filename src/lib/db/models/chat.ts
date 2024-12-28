import mongoose, { Document, Schema } from "mongoose";

interface IChat extends Document {
  participants: mongoose.Schema.Types.ObjectId[];
  lastMessage: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}
const ChatSchema = new Schema<IChat>({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Chat =
  mongoose.models.Chat || mongoose.model<IChat>("Chat", ChatSchema);

interface IMessage extends Document {
  chatId: mongoose.Schema.Types.ObjectId;
  sender: mongoose.Schema.Types.ObjectId;
  text: string;
  timestamp: Date;
  status: "sent" | "delivered" | "read";
}

const MessageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["sent", "delivered", "read"],
    default: "sent",
  },
});

export const Message =
  mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);
