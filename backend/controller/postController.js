// import sharp from "sharp";
// import path from "path";
// import DataURIParser from "datauri/parser.js";
import modifiedImageBuffer from "../utils/updateImage.js";
import cloudinary from "../utils/cloudinary.js";
import User from "../model/userSchema.js";
import Post from "../model/postSchema.js";
import Comment from "../model/commentSchema.js";

export let AddNewPost = async (req, res) => {
  try {
    let text = req.body.text;
    let userId = req.userId;
    let image = req.file;
    let imageBuffer = req.file.buffer;

    if (!text || !userId) {
      return res.status(400).json({
        message: "text & userId is not defined",
        success: false,
      });
    }

    if (!image || !imageBuffer) {
      return res.status(400).json({
        message: "image & imageBuffer is not defined",
        success: false,
      });
    }

    // if image then modified it
    // let modifiedImageBuffer = await sharp(imageBuffer)
    //   .resize({ width: 400, height: 400, fit: "inside" })
    //   .toFormat("webp", { quality: 80 })
    //   .toBuffer();

    // let parser = new DataURIParser();
    // let extname = path.extname(image.originalname); // file ext
    // let datauri = parser.format(extname, modifiedImageBuffer).content;

    let fileuri;
    if (image) {
      fileuri = await modifiedImageBuffer(image);
    }

    let cloudResponse = await cloudinary.uploader.upload(fileuri);

    let newPost;

    if (cloudResponse) {
      newPost = await Post.create({
        caption: text,
        author: userId,
        postImage: cloudResponse.secure_url,
      });

      await newPost.save();
    }
    let post = await Post.findById(newPost._id).populate({
      path: "author",
      select: "fullname profilePhoto",
    });

    let user = await User.findById(userId);
    await User.updateOne(
      { _id: userId },
      { $push: { posts: newPost._id } }
    ).populate({ path: "posts" });

    return res.status(200).json({
      message: `${user.fullname} created a post successfully`,
      success: true,
      newPost: post,
    });
  } catch (error) {
    console.log(error);
  }
};

export let LikethePost = async (req, res) => {
  try {
    let userId = req.userId;
    let postId = req.params.id;

    if (!postId) {
      return res.status(400).json({
        message: "postId is required",
        success: false,
      });
    }

    let post = await Post.findById(postId);

    if (!post.likes.includes(userId)) {
      await Post.updateOne({ _id: postId }, { $push: { likes: userId } });
    }
    post = await Post.findById(postId)
      .populate({ path: "author", select: "-password" })
      .populate({ path: "likes" });

    return res.status(200).json({
      message: "post liked successfully",
      success: true,
      post,
    });
  } catch (error) {
    console.log(error);
  }
};

export let DislikethePost = async (req, res) => {
  try {
    let userId = req.userId;
    let postId = req.params.id;

    if (!postId) {
      return res.status(400).json({
        message: "postId is required",
        success: false,
      });
    }

    let post = await Post.findById(postId);

    if (post.likes.includes(userId)) {
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
    }
    post = await Post.findById(postId)
      .populate({ path: "author", select: "-password" })
      .populate({ path: "likes" });

    return res.status(200).json({
      message: "post unLiked successfully",
      success: true,
      post,
    });
  } catch (error) {
    console.log(error);
  }
};

export let DeletethePost = async (req, res) => {
  try {
    let userId = req.userId;
    let postId = req.params.id;

    if (!postId) {
      return res.status(400).json({
        message: "PostId is not defined",
        success: false,
      });
    }

    let post = await Post.findById(postId);
    let user = await User.findById(userId);

    let user2;

    await Promise.all(
      post.saved.map(async (userIds) => {
        user2 = await User.findById(userIds.toString());
        if (user2) {
          user2.bookmarks = user2.bookmarks.filter(
            (ids) => ids.toString() !== postId
          );
          await user2.save(); // Save changes for each user
        }
      })
    );

    user.posts = user.posts.filter((ids) => ids.toString() != postId);
    await user.save();

    await Comment.deleteMany({ post: postId });

    let deletePost = await Post.findByIdAndDelete(postId);

    if (!deletePost) {
      return res.status(400).json({
        message: "post is not deleted successfully",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Deleted the post successfully",
      success: true,
      user: user2,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export let GetAllPosta = async (req, res) => {
  try {
    let allPosts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "comments" })
      .populate({ path: "author" });

    if (!allPosts) {
      return res.status(400).json({
        message: "posts is not find",
        success: false,
      });
    }

    return res.status(200).json({
      message: "all posts",
      success: true,
      allPosts,
    });
  } catch (error) {
    console.log(error);
  }
};
