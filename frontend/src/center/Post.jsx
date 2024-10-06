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
import {
  Bookmark,
  BookmarkCheckIcon,
  Heart,
  MessageCircle,
  MoreHorizontal,
} from "lucide-react";
import CommentDialog from "./CommentDialog";
import { useState } from "react";
import axios from "axios";
import { COMMENT_API, POST_API, USER_API } from "@/lib/utils";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import {
  setAuthuser,
  setOtherUsers,
  setSelectedUser,
} from "@/redux/userSlicer";
import { FaHeart } from "react-icons/fa";
import { setAllComments, setAllPosts, setSelectPost } from "@/redux/postSlicer";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const Post = ({ post, otherUser }) => {
  let [commentText, setCommentText] = useState("");
  let { allComments, allPosts } = useSelector((store) => store?.frame);
  let { authUser, otherUsers, selectedUser } = useSelector(
    (store) => store?.auth
  );

  let [commentCount, setCommentCount] = useState(post?.comments?.length || 0);
  let [likeCount, setLikeCount] = useState(post?.likes?.length || 0);
  let [show, setShow] = useState(false);
  let [isLiked, setIsLiked] = useState(
    post?.likes?.includes(authUser?._id) || false
  );
  let [isBookmarked, setIsBookmarked] = useState(
    post?.saved?.includes(authUser?._id) || false
  );

  let [isFollow, setIsFollow] = useState(
    post?.author?.followers?.includes(authUser?._id) || false
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

      if (
        response?.data?.success &&
        response?.data?.message == "post is bookmarked"
      ) {
        let updateAuthuser = {
          ...authUser,
          bookmarks: [...authUser.bookmarks, response?.data?.post],
        };
        let updateAllPosts = allPosts.map((po) =>
          po?._id == id ? { ...po, saved: [...po.saved, authUser?._id] } : po
        );
        setIsBookmarked(true);
        dispatch(setAllPosts(updateAllPosts));
        dispatch(setAuthuser(updateAuthuser));
        toast?.success(response?.data?.message);
      } else {
        let updateAuthuser = {
          ...authUser,
          bookmarks: [...authUser.bookmarks.filter((pos) => pos?._id != id)],
        };
        let updateAllPosts = allPosts.map((po) =>
          po?._id == id
            ? {
                ...po,
                saved: [...po.saved.filter((ids) => ids != authUser?._id)],
              }
            : po
        );
        setIsBookmarked(false);
        dispatch(setAllPosts(updateAllPosts));
        dispatch(setAuthuser(updateAuthuser));
        toast?.success(response?.data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // delete post handler
  let deletePostHandler = async (id) => {
    try {
      axios.defaults.withCredentials = true;
      let response = await axios.delete(`${POST_API}/deletepost/${id}`);
      if (response?.data?.success) {
        toast?.success(response?.data?.message);
        let updateAllPosts = allPosts.filter((po) => po?._id != id);
        dispatch(setAllPosts(updateAllPosts));

        let updateAuthUser = {
          ...authUser,
          posts: authUser?.posts?.filter((po) => po?._id != id),
          bookmarks: authUser?.bookmarks?.filter((po) => po?._id != id),
        };
        dispatch(setAuthuser(updateAuthUser));
      }
    } catch (error) {
      console.log(error);
    }
  };

 

  let userFollowHandler = async (id) => {
    console.log(id);
    try {
      axios.defaults.withCredentials = true;
      let response = await axios.patch(`${USER_API}/followtheuser/${id}`);
      console.log(response?.data);

      if (response?.data?.success) {
        toast?.success(response?.data?.message);

        // Updating authUser's following array
        let updatedAuthUser = {
          ...authUser,
          following: [...authUser.following, id], // Adding the otherUser's id
        };
        dispatch(setAuthuser(updatedAuthUser));
        setIsFollow(true); // Update isFollow state to true

        // Find the index of the user in otherUsers
        let userIndex = otherUsers?.findIndex((user) => user?._id === id);

        // If user is found, update their followers without changing the array order
        if (userIndex !== -1) {
          let updatedOtherUser = {
            ...otherUsers[userIndex],
            followers: [...otherUsers[userIndex].followers, authUser?._id], // Add current user's ID to followers
          };

          // Create a new array with the updated user at the same index
          let updatedOtherUsers = [
            ...otherUsers.slice(0, userIndex),
            updatedOtherUser,
            ...otherUsers.slice(userIndex + 1), // ye code end tak chalega
          ];

          dispatch(setOtherUsers(updatedOtherUsers)); // Update the store with the new array
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // unfollow the user
  let userUnfollowHandler = async (id) => {
    try {
      axios.defaults.withCredentials = true;
      let response = await axios.patch(`${USER_API}/unfollowtheuser/${id}`);

      if (response?.data?.success) {
        toast?.success(response?.data?.message);
        let updateAuthUser = {
          ...authUser,
          following: [...authUser.following.filter((ids) => ids != id)],
        };
        dispatch(setAuthuser(updateAuthUser));
        setIsFollow(false);

        let userIndex = otherUsers?.findIndex((user) => user?._id == id); // get the index of the user

        if (userIndex != -1) {
          let updateOtherUser = {
            ...otherUsers[userIndex],
            followers: [
              ...authUser.followers.filter((ids) => ids != authUser?._id),
            ],
          };

          let updatedOtherUsers = [
            ...otherUsers.slice(0, userIndex),
            updateOtherUser,
            ...otherUsers.slice(userIndex + 1),
          ];

          dispatch(setOtherUsers(updatedOtherUsers));
        }
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
              <AvatarImage src={post?.author?.profilePhoto} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            {/* description */}
            <div className="flex gap-2 items-center">
              <h1>{post?.author?.fullname}</h1>
              {post?.author?._id == authUser?._id && <Badge>author</Badge>}
            </div>
          </div>

          {/* ... */}
          <div onClick={() => dispatch(setSelectedUser(post?.author))}>
            <Dialog>
              <DialogTrigger asChild>
                <MoreHorizontal className="cursor-pointer" />
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex gap-2 w-full">
                    <div className="flex flex-col gap-2 w-full">
                      <Link to={"/edit/profile"}>
                        <Button className="w-full">Edit</Button>
                      </Link>

                      {post?.author?._id == authUser?._id ? (
                        ""
                      ) : (
                        <div>
                          {isFollow ? (
                            <Button
                              className="w-full "
                              onClick={() =>
                                userUnfollowHandler(selectedUser?._id)
                              }
                            >
                              Unfollow
                            </Button>
                          ) : (
                            <Button
                              className="w-full"
                              onClick={() =>
                                userFollowHandler(selectedUser?._id)
                              }
                            >
                              Follow
                            </Button>
                          )}
                        </div>
                      )}

                      {post?.author?._id == authUser?._id && (
                        <Button onClick={() => deletePostHandler(post?._id)}>
                          Delete
                        </Button>
                      )}
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
            {isBookmarked ? (
              <BookmarkCheckIcon className="w-[30px] h-[30px] cursor-pointer" />
            ) : (
              <Bookmark className="w-[30px] h-[30px] cursor-pointer" />
            )}
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
