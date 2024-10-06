import RightOtherUsers from "./RightOtherUsers";
import RightTop from "./RightTop";

const RightSide = () => {
  return (
    <div className="w-full h-full">
      <div className="h-[15%] w-full">
        <RightTop />
      </div>

      <div className="h-[70%] overflow-y-hidden">
        <RightOtherUsers />
      </div>
    </div>
  );
};

export default RightSide;
