import mongoose, { Document, Schema } from "mongoose";

interface IConversation extends Document {
  participants: mongoose.Schema.Types.ObjectId[];
  lastMessage: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}
const ConversationSchema = new Schema<IConversation>({
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

export const Conversation =
  mongoose.models.Conversation ||
  mongoose.model<IConversation>("Conversation", ConversationSchema);

interface IMessage extends Document {
  conversationId: mongoose.Schema.Types.ObjectId;
  sender: mongoose.Schema.Types.ObjectId;
  content: string;
  timestamp: Date;
  status: "sent" | "delivered" | "read";
}

const MessageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
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
