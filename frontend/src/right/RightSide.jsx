import RightOtherUsers from "./RightOtherUsers";
import RightTop from "./RightTop";

const RightSide = ({isFollow, setIsFollow}) => {
  return (
    <div className="w-full h-full">
      <div className="h-[15%] w-full">
        <RightTop />
      </div>

      <div className="h-[70%] overflow-y-hidden">
        <RightOtherUsers isFollow={isFollow} setIsFollow={setIsFollow}/>
      </div>
    </div>
  );
};

export default RightSide;
