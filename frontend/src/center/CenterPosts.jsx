import RightSide from "@/right/RightSide";
import Post from "./Post";
import { useSelector } from "react-redux";

const CenterPosts = () => {
  let arr = [2, 3, 4, 56, 6];
  // let { authUser, otherUsers, selectedUser } = useSelector(
  //   (store) => store?.auth
  // );
  let {allPosts} = useSelector((store) =>store?.frame)

  return (
    <div className="w-full h-full flex">
      <div className="w-[65%] h-full overflow-y-scroll ">
        {allPosts?.map((post) => (
          <Post key={post?._id} post={post} />
        ))}
      </div>

      <div className="w-[35%] border border-black h-full">
        <RightSide />
      </div>
    </div>
  );
};

export default CenterPosts;
