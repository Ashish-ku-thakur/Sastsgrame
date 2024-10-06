import mongoose from "mongoose";

let postSchema = new mongoose.Schema(
  {
    caption: { type: String, required: true },
    postImage: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    saved: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

let Post = mongoose.model("Post", postSchema);
export default Post;
