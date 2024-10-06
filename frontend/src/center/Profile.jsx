import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import FrameSaved from "./FrameSaved";
import FramePost from "./FramePost";

const Profile = () => {
  let [clickText, setClickText] = useState("POSTS");

  let { authUser, selectedUser } = useSelector((store) => store?.auth);
  let { id } = useParams();

  return (
    <div className="w-full h-screen ">
      {/* top */}
      <div className="w-full  min-h-[300px] flex items-center gap-4 ">
        {/* avatar */}
        <div className="w-1/2  flex items-center justify-center">
          <Avatar className="h-44 w-44">
            <AvatarImage
              className="w-full h-full "
              src={selectedUser?.profilePhoto}
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>

        <div className="flex flex-col gap-6">
          {/* name btns */}

          {authUser?._id == id ? (
            <div className="grid grid-cols-4 gap-4 items-center">
              <div>{selectedUser?.fullname}</div>

              <Link to={"/edit/profile"}>
                <Button variant="secondary">Edit profile</Button>
              </Link>
              <Button variant="secondary">View archive</Button>
              <Button variant="secondary">Ad tools</Button>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4 items-center">
              <div>{selectedUser?.fullname}</div>

              <Button variant="secondary">Unfollow</Button>
              <Link to={"/message"}>
                <Button variant="secondary">Message</Button>
              </Link>
            </div>
          )}

          <div className="flex items-center gap-16">
            <div className="flex gap-3">
              <div className="font-bold">2</div>
              <span>Posts</span>
            </div>
            <div className="flex gap-3">
              <div className="font-bold">0</div>
              <span>Followers</span>
            </div>
            <div className="flex gap-3">
              <div className="font-bold">0</div>
              <span>Followings</span>
            </div>
          </div>

          <div className="w-fit">
            <div>{selectedUser?.bio}</div>
            <div className="bg-zinc-400 rounded-full text-center font-semibold">
              @ <span>{selectedUser?.fullname}</span>
            </div>
          </div>
        </div>
      </div>

      <hr className=" my-4 mx-2" />

      {/* text posts saved */}
      <div className="flex gap-6 w-full items-center justify-center">
        <p className="cursor-pointer" onClick={() => setClickText("POSTS")}>
          POSTS
        </p>
        <p className="cursor-pointer" onClick={() => setClickText("SAVED")}>
          SAVED
        </p>
      </div>

      {/* Posts  */}
      <div className="grid lg:grid-cols-5 gap-4 auto-fit sm:grid-cols-3 grid-cols-1 h-screen overflow-y-scroll">
        {clickText === "POSTS" &&
          selectedUser?.posts?.map((post, index) => {
            return <FramePost key={index} post={post} />;
          })}
        {clickText === "SAVED" &&
          selectedUser?.bookmarks?.map((post, index) => {
            return <FrameSaved key={index} post={post} />;
          })}
      </div>
    </div>
  );
};

export default Profile;
