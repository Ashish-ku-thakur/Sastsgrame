import Comment from "../model/commentSchema.js";
import Post from "../model/postSchema.js";

export let CommentonPost = async (req, res) => {
  try {
    let text = req.body.text;
    let postId = req.params.id;
    let userId = req.userId;


    if (!text || !postId) {
      return res.status(400).json({
        message: "text & postId is required",
        success: false,
      });
    }
    

    let commentCreate = await Comment.create({
      text,
      author: userId,
      post: postId,
    });

    if (!commentCreate) {
      return res.status(400).json({
        message: "comment is not created",
        success: false,
      });
    }

    await Post.updateOne(
      { _id: postId },
      { $push: { comments: commentCreate._id } }
    );

    let post = await Post.findById(postId)
      .populate({ path: "comments" })
      .populate({ path: "author", select: "fullname profilePhoto" });

    return res.status(200).json({
      message: "comment created successfully",
      success: true,
      newComment: commentCreate,
    });
  } catch (error) {
    console.log(error);
  }
};

export let GetAlltheComments = async (req, res) => {
  try {
    let userId = req.userId;
    let postId = req.params.id;

    if (!postId) {
      return res.status(400).json({
        message: "post id is required",
        success: false,
      });
    }

    let post = await Post.findById(postId).populate({
      path: "comments",
      options: { sort: { createdAt: -1 } },
    });

    if (!post) {
      return res.status(400).json({
        message:"post is not defined",
        success:false,
      })
    }

    return res.status(200).json({
      message: "get all comments",
      success: true,
      commentsOnPost: post,
    });
  } catch (error) {
    console.log(error);
  }
};
