import RightSide from "@/right/RightSide";
import Post from "./Post";
import { useSelector } from "react-redux";
import { useState } from "react";

const CenterPosts = () => {
  let { authUser,  selectedUser } = useSelector(
    (store) => store?.auth  
  );
  let {allPosts} = useSelector((store) =>store?.frame)

  let [isFollow, setIsFollow] = useState(
    selectedUser?.followers?.includes(authUser?._id) || false
  );

  return (
    <div className="w-full h-full flex">
      <div className="w-[65%] h-full overflow-y-scroll scrollbar-hidden">
        {allPosts?.map((post) => (
          <Post key={post?._id} post={post}  isFollow={isFollow} setIsFollow={setIsFollow} />
        ))}
      </div>

      <div className="w-[35%] border border-l-black h-full">
        <RightSide isFollow={isFollow} setIsFollow={setIsFollow}/>
      </div>
    </div>
  );
};

export default CenterPosts;
