import useGetAllComments from "@/hooks/useGetAllComments";
import useGetAllPosts from "@/hooks/useGetAllPosts";
import useGetOtherUsers from "@/hooks/useGetOtherUsers";
import LeftBTN from "@/left/LeftBTN";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

const MainPage = () => {
  useGetOtherUsers();
  useGetAllPosts();
  useGetAllComments();

  let { authUser } = useSelector((state) => state.auth);
  let navigate = useNavigate();

  useEffect(() => {
    if (!authUser?._id) {
      navigate("/signup");
    }
  }, [authUser?._id]);

  return (
    <div className="flex w-full h-screen">
      <div className="w-[20%]  h-[90vh]">
        <LeftBTN />
      </div>
      <div className="w-[80%]  h-full overflow-y-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default MainPage;
