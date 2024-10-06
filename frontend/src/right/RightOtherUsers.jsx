import { useSelector } from "react-redux";
import RightOtherUser from "./RightOtherUser";

const RightOtherUsers = () => {
  let { otherUsers } = useSelector((store) => store?.auth);


  return (
    <div className="w-full h-full border-[2px] border-red-800 overflow-y-scroll ">
      <div className="w-full h-[15%]">
        {otherUsers?.map((user) => (
          <RightOtherUser key={user?._id} otherUser={user} />
        ))}
      </div>
    </div>
  );
};

export default RightOtherUsers;
