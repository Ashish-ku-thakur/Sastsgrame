import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { setSelectedUser } from "@/redux/userSlicer";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const RightTop = () => {
  let { authUser } = useSelector((store) => store?.auth);
  let dispatch = useDispatch();
  return (
    <div className="">
      <div className="flex gap-3">
        {/* avatar */}
        <div onClick={() => dispatch(setSelectedUser(authUser))}>
          <Link to={`/profile/${authUser?._id}`}>
            <Avatar>
              <AvatarImage src={authUser?.profilePhoto} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Link>
        </div>

        {/* discription */}
        <div className="flex gap-2 items-center">
          <p>{authUser?.fullname}</p>
          <p className="text-sm text-gray-500">{authUser?.bio}</p>
        </div>
      </div>

      <hr className=" m-2" />

      <div className="w-full text-center font-semibold my-2">
        <p>See All Recomendation</p>
      </div>
    </div>
  );
};

export default RightTop;
