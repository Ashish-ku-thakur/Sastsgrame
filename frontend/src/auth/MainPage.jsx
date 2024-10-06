import useGetAllComments from "@/hooks/useGetAllComments";
import useGetAllPosts from "@/hooks/useGetAllPosts";
import useGetOtherUsers from "@/hooks/useGetOtherUsers";
import LeftBTN from "@/left/LeftBTN";
import { Outlet } from "react-router-dom";

const MainPage = () => {
  useGetOtherUsers();
  useGetAllPosts();
  useGetAllComments();

  return (
    <div className="flex w-full h-screen">
      <div className="w-[20%] border border-black h-[90vh]">
        <LeftBTN />
      </div>
      <div className="w-[80%] border border-black h-full overflow-y-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default MainPage;
