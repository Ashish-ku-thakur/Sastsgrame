import mongoose from "mongoose";

let conversationSchema = new mongoose.Schema(
  {
    group: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  { timestamps: true }
);

let Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;
