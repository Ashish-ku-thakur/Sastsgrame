import mongoose from "mongoose";

let messageSchema = new mongoose.Schema(
  {
    text: { type: String },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

let Message = mongoose.model("Message", messageSchema)
export default Message
