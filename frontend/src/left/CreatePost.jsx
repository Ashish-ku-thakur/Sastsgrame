import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { POST_API } from "@/lib/utils";
import { setAllPosts } from "@/redux/postSlicer";
import { setAuthuser } from "@/redux/userSlicer";
import axios from "axios";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const CreatePost = ({ open, setOpen }) => {
  let { authUser } = useSelector((store) => store?.auth);
  let { allPosts } = useSelector((store) => store?.frame);

  let imageRef = useRef();
  let [selectImage, setSelectImage] = useState("");
  let [areatext, setAreatext] = useState(null);
  let [imageUri, setImageUri] = useState("");
  let dispatch = useDispatch();

  let imageFillHandler = async (e) => {
    let file = e?.target?.files[0];
    if (file) {
      setSelectImage(file);
      let ch = await fileToBaseUrl(file);
      setImageUri(ch);
    }
  };

  let fileToBaseUrl = async (file) => {
    let baseUri = await new Promise((resolve) => {
      let reader = new FileReader();

      reader.onload = () => {
        resolve(reader?.result);
      };

      reader.readAsDataURL(file);
    });

    return baseUri;
  };

  let postCreateHandler = async () => {
    let formdata = new FormData();
    formdata.append("text", areatext);
    if (selectImage) {
      formdata.append("image", selectImage);
    }

    try {
      let response = await axios.post(`${POST_API}/addnewpost`, formdata, {
        headers: {
          "Content-Type": "multipart-form/data",
        },
        withCredentials: true,
      });
      // console.log(formdata);
      console.log(response?.data);

      if (response?.data?.success) {
        toast?.success(response?.data?.message);

        let updateAuthUser = {
          ...authUser,
          posts: [...authUser.posts, response?.data?.newPost],
        };

        let updateAllPosts = [response?.data?.newPost, ...allPosts];
        dispatch(setAuthuser(updateAuthUser));
        dispatch(setAllPosts(updateAllPosts));
        setOpen(false);
        setAreatext(null);
        setImageUri("");
        setSelectImage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>

          {/* Avatar to Post */}
          <DialogDescription>
            <div className="flex gap-3 items-center my-4">
              <Avatar className="w-16 h-16">
                <AvatarImage
                  className="w-full h-full"
                  src="https://github.com/shadcn.png"
                  alt=""
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <div>
                <p>Ashish</p>
                <p>Bio ...</p>
              </div>
            </div>

            <Textarea
              onChange={(e) => setAreatext(e?.target?.value)}
              value={areatext}
              placeholder="Type here..."
            />

            {imageUri && (
              <div className="w-full h-80 mt-1">
                <img
                  className="w-full h-full rounded-xl"
                  src={imageUri}
                  alt=""
                />
              </div>
            )}

            <div className="w-full">
              <input
                onChange={imageFillHandler}
                ref={imageRef}
                type="file"
                className="hidden"
              />
              <Button
                onClick={() => imageRef?.current?.click()}
                className="w-full my-2 bg-blue-500"
              >
                Select From Computer
              </Button>
            </div>

            <Button
              onClick={postCreateHandler}
              className="w-full my-2 bg-blue-500"
            >
              Post
            </Button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
