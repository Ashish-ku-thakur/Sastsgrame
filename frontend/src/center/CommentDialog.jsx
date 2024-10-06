import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { COMMENT_API } from "@/lib/utils";
import { setAllComments } from "@/redux/postSlicer";
import axios from "axios";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

let CommentDialog = ({ show, setShow, Post, commentCount, setCommentCount }) => {
  let { selectPost, allComments } = useSelector((store) => store?.frame);
  let dispatch = useDispatch();

  let [commentText, setCommentText] = useState(null);

  let commentCreateHandler = async (id) => {
    console.log(commentText);

    try {
      let response = await axios.post(
        `${COMMENT_API}/createComment/${id}`,
        {text:commentText},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(response?.data);

      if (response?.data?.success) {
        toast?.success(response?.data?.message);

        let updatePostComment = {
          ...allComments,
          comments: [response?.data?.newComment, ...allComments.comments],
        };

        dispatch(setAllComments(updatePostComment));
        setCommentCount(commentCount + 1)
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={show} className="w-full p-0 m-0">
      <DialogContent
        className="min-w-[900px] h-[80%] p-0 m-0"
        onInteractOutside={() => setShow(false)}
      >
        <div className="flex w-[100%] min-h-full">
          {/* left img */}
          <div className="w-1/2 h-full">
            <img
              className="w-full h-full object-cover object-center"
              src={selectPost?.postImage}
              alt=""
            />
          </div>

          {/* right comment */}
          <div className="w-1/2 h-[100%]">
            <div className="flex h-[8%] w-full mb-2 items-center">
              {/* avatar bio */}
              <div className="flex h-full w-full gap-2 cursor-pointer items-center mt-3">
                <Avatar className="h-14 w-14">
                  <AvatarImage
                    className="w-full h-full"
                    src={selectPost?.author?.profilePhoto}
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div className="flex gap-2 items-center">
                  <p>{selectPost?.author?.fullname}</p>
                  <p>bio...</p>
                </div>
              </div>

              {/* ... */}
              <div>
                <Dialog>
                  <DialogTrigger asChild>
                    <MoreHorizontal className="cursor-pointer" />
                  </DialogTrigger>

                  <DialogContent>
                    <Button>Delete</Button>
                    <Button>Follow</Button>
                    <Button>Add To BookMark</Button>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <hr className="mt-4 " />

            <div className="h-[88%] overflow-y-hidden flex flex-col mt-2">
              <div className="w-full h-[88%] px-3  overflow-y-scroll flex flex-col flex-1  scrollbar-hidden">
                {allComments?.comments?.map((com) => {
                  return (
                    <div
                      className="p-2 my-2 rounded-lg bg-pink-300 "
                      key={com?._id}
                    >
                      {com?.text}
                    </div>
                  );
                })}
              </div>

              <div className="h-[10%]  flex items-center mt-2">
                <Input
                  type="text"
                  placeholder="Add post."
                  className="p-2 h-full w-full focus-visible:ring-transparent bg-zinc-300"
                  value={commentText}
                  onChange={(e) => setCommentText(e?.target?.value)}
                />
                <Button
                  onClick={() => commentCreateHandler(Post?._id)}
                  className="h-full"
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default CommentDialog;
