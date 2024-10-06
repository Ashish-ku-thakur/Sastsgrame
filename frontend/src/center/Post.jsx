import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Bookmark, Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import CommentDialog from "./CommentDialog";
import { useState } from "react";
import axios from "axios";
import { COMMENT_API, POST_API, USER_API } from "@/lib/utils";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setAuthuser } from "@/redux/userSlicer";
import { FaHeart } from "react-icons/fa";
import { setAllComments, setAllPosts, setSelectPost } from "@/redux/postSlicer";

const Post = ({ post }) => {
  let [commentText, setCommentText] = useState("");
  let { allComments, allPosts } = useSelector((store) => store?.frame);

  let [commentCount, setCommentCount] = useState(post?.comments?.length || 0);
  let [likeCount, setLikeCount] = useState(post?.likes?.length || 0);
  let [show, setShow] = useState(false);
  let { authUser } = useSelector((store) => store?.auth);
  let [isLiked, setIsLiked] = useState(
    post?.likes?.includes(authUser?._id) || false
  );

  let dispatch = useDispatch();

  let changeState = (Post) => {
    dispatch(setSelectPost(Post));
    setShow(true);
  };

  let setSelectedPostHandler = (post) => {
    dispatch(setSelectPost(post));
  };

  // postlike or dislike handler
  let postLikeHandler = async (id) => {
    try {
      let action = isLiked ? "dislikepost" : "likepost";
      axios.defaults.withCredentials = true;
      let response = await axios.patch(`${POST_API}/${action}/${id}`);

      if (response?.data?.success) {
        // Find the post index in allPosts
        let postIndex = allPosts.findIndex((po) => po?._id === id);

        // Updating the likes array
        let updatedPost = {
          ...post,
          likes: isLiked
            ? post.likes.filter((ids) => ids !== authUser?._id) // Dislike logic
            : [...post.likes, authUser?._id], // Like logic
        };

        // updating the hole array with updatePost
        let updatedAllPosts = [
          ...allPosts.slice(0, postIndex),
          updatedPost,
          ...allPosts.slice(postIndex + 1),
        ];

        // authuser.posts.posts.likes authuser.bookmarks.posts.likes
        let updateAuthUser = {
          ...authUser,
          posts: authUser?.posts?.map((po) =>
            po?._id == id
              ? {
                  ...po,
                  likes: isLiked
                    ? po.likes.filter((ids) => ids != authUser?._id)
                    : [...po.likes, authUser?._id],
                }
              : po
          ),
          bookmarks: authUser?.bookmarks?.map((po) =>
            po?._id == id
              ? {
                  ...po,
                  likes: isLiked
                    ? po.likes.filter((ids) => ids != authUser?._id)
                    : [...po.likes, authUser?._id],
                }
              : po
          ),
        };

        toast?.success(response?.data?.message);
        dispatch(setAllPosts(updatedAllPosts)); // Corrected dispatch function
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1); // Adjust like count
        setIsLiked(!isLiked); // Toggle the like state
        dispatch(setAuthuser(updateAuthUser));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // create comment handler
  let commentCreateHandler = async (id) => {
    try {
      let response = await axios.post(
        `${COMMENT_API}/createComment/${id}`,
        { text: commentText },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        toast?.success(response?.data?.message);

        let updatePostComment = {
          ...allComments,
          comments: [response?.data?.newComment, ...allComments.comments],
        };

        let updateAuthUser = {
          ...authUser,
          posts: authUser?.posts?.map((po) =>
            po?._id == id
              ? {
                  ...po,
                  comments: [...po.comments, id],
                }
              : po
          ),
          bookmarks: authUser?.bookmarks?.map((po) =>
            po?._id == id
              ? {
                  ...po,
                  comments: [...po.comments, id],
                }
              : po
          ),
        };

        let updateAllPosts = allPosts.map((po) =>
          po?._id == id
            ? { ...po, comments: [response?.data?.newComment, ...po.comments] }
            : po
        );

        dispatch(setAllComments(updatePostComment));
        setCommentCount(commentCount + 1);
        setCommentText(""); // Clear the input after comment post
        dispatch(setAuthuser(updateAuthUser));
        dispatch(setAllPosts(updateAllPosts));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // bookmark the post
  let bookmarkthePostHandler = async (id) => {
    try {
      axios.defaults.withCredentials = true;
      let response = await axios.patch(`${USER_API}/bookmark/${id}`);

      console.log(response?.data?.post);

      if (
        response?.data?.success &&
        response?.data?.message == "post is bookmarked"
      ) {
        let updateAuthuser = {
          ...authUser,
          bookmarks: [...authUser.bookmarks, response?.data?.post],
        };

        dispatch(setAuthuser(updateAuthuser));
        toast?.success(response?.data?.message);
      } else {
        let updateAuthuser = {
          ...authUser,
          bookmarks: [...authUser.bookmarks.filter((pos) => pos?._id != id)],
        };

        dispatch(setAuthuser(updateAuthuser));
        toast?.success(response?.data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-full flex justify-center mt-6">
      <div
        onClick={() => setSelectedPostHandler(post)}
        className="w-[45%] flex flex-col border border-black shadow-2xl p-3"
      >
        <div className="flex items-center justify-between w-full border border-black">
          {/* avatar bio */}
          <div className="flex gap-3">
            {/* avatar */}
            <Avatar>
              <AvatarImage src={post?.profilePhoto} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            {/* description */}
            <div className="flex gap-2 items-center">
              <h1>{post?.fullname}</h1>
              <h1>Bio here...</h1>
            </div>
          </div>

          {/* ... */}
          <div>
            <Dialog>
              <DialogTrigger asChild>
                <MoreHorizontal className="cursor-pointer" />
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex gap-2 w-full">
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>

                    <div>
                      <p>Ashish</p>
                      <p>Bio here...</p>
                    </div>
                  </DialogTitle>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* post img */}
        <div className="w-[100%]">
          <img
            className="w-full object-cover object-center"
            src={post?.postImage}
            alt=""
          />
        </div>

        {/* icons */}
        <div className="my-3 flex justify-between items-center ">
          <div className="flex gap-3">
            {isLiked ? (
              <FaHeart
                onClick={() => postLikeHandler(post?._id)}
                className="w-[30px] h-[30px] cursor-pointer text-red-900 font-bold"
              />
            ) : (
              <Heart
                onClick={() => postLikeHandler(post?._id)}
                className="w-[30px] h-[30px] cursor-pointer"
              />
            )}

            <MessageCircle
              onClick={() => changeState(post)}
              className="w-[30px] h-[30px] cursor-pointer"
            />
          </div>

          <div onClick={() => bookmarkthePostHandler(post?._id)}>
            <Bookmark className="w-[30px] h-[30px] cursor-pointer" />
          </div>
        </div>

        {/* counters like comment */}
        <div className="mb-2">
          <div>
            <p className="mb-3 font-serif text-pink-600">{post?.caption}</p>
          </div>
          <div>
            <span className="font-bold">{likeCount}</span> Likes
          </div>
          <div onClick={() => changeState(post)} className="cursor-pointer">
            {commentCount === 0 ? (
              <span>View All Comments...</span>
            ) : (
              <p className="font-semibold text-lg">
                View ({commentCount}) Comments...
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <Input
            placeholder="Add Comment.."
            className="focus-visible:ring-transparent"
            value={commentText}
            onChange={(e) => setCommentText(e?.target?.value)}
          />
          <Button onClick={() => commentCreateHandler(post?._id)}>Post</Button>
        </div>
      </div>
      <div>
        <CommentDialog
          show={show}
          setShow={setShow}
          Post={post}
          commentCount={commentCount}
          setCommentCount={setCommentCount}
        />
      </div>
    </div>
  );
};

export default Post;
