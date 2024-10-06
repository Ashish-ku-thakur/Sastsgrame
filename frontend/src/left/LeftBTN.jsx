import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Heart,
  Home,
  LogOutIcon,
  MessageCircle,
  PlusCircle,
  Search,
} from "lucide-react";
import {  useState } from "react";
import { useNavigate } from "react-router-dom";
import CreatePost from "./CreatePost";
import { toast } from "sonner";
import axios from "axios";
import { USER_API } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import {
  setAuthuser,
  setOnlineUsers,
  setOtherUsers,
  setSelectedPerson,
  setSelectedUser,
} from "@/redux/userSlicer";
import { setAllComments, setAllPosts, setSelectPost } from "@/redux/postSlicer";
import { setChats, setSocket } from "@/redux/chatSlicer";

const LeftBTN = () => {
  let { authUser } = useSelector((store) => store?.auth);

  let tabs = [
    { icon: <Home className="w-[30px] h-[40px]" />, text: "Home" },
    { icon: <Search className="w-[30px] h-[40px]" />, text: "Search" },
    { icon: <MessageCircle className="w-[30px] h-[40px]" />, text: "Message" },
    { icon: <Heart className="w-[30px] h-[40px]" />, text: "Notification" },
    { icon: <PlusCircle className="w-[30px] h-[40px]" />, text: "Create" },
    {
      icon: (
        <Avatar>
          <AvatarImage src={authUser?.profilePhoto} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOutIcon className="w-[30px] h-[40px]" />, text: "Logout" },
  ];


  let [open, setOpen] = useState(false);
  let dispatch = useDispatch();
  let { onlineUsers } = useSelector((store) => store?.auth);
  let navigate = useNavigate();


  // logout user
  let logoutHandler = async () => {
    // dispatches all slicers
    try {
      let response = await axios.get(`${USER_API}/logout`, {
        withCredentials: true,
      });

      

      if (response?.data?.success) {
        toast.success(response?.data?.message);
        dispatch(setOnlineUsers(onlineUsers.filter((elm)=>elm!=authUser?._id)));
        dispatch(setAuthuser(""));
        dispatch(setOtherUsers([]));
        dispatch(setSelectedUser(null));
        dispatch(setAllPosts([]));
        dispatch(setSelectPost(null));
        dispatch(setAllComments([]));
        dispatch(setSocket(null));

        dispatch(setSelectedPerson(null));
        dispatch(setChats([]));
        navigate("/signup");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  let clickBTNHandler = (textType) => {
    if (textType == "Logout") {
      logoutHandler();
    } else if (textType == "Home") {
      navigate("/");
    } else if (textType == "Profile") {
      dispatch(setSelectedUser(authUser));
      navigate(`/profile/${authUser._id}`);
    } else if (textType == "Create") {
      setOpen(true);
    } else if (textType == "Message") {
      navigate("/message");
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-around">
      <div className="h-10 w-full  flex items-center justify-center">
        <img
          className="h-10 w-10 object-cover"
          src="https://github.com/shadcn.png"
          alt="logo"
        />
      </div>
      {tabs?.map((elm, index) => {
        return (
          <div
            onClick={() => clickBTNHandler(elm?.text)}
            key={index}
            className="w-full flex items-center justify-between px-3 hover:bg-gray-200 py-2 rounded-xl cursor-pointer"
          >
            {/* Check if the icon is a function and render it properly */}
            {elm.icon}

            <div className="font-bold text-lg">{elm?.text}</div>
          </div>
        );
      })}

      <div>
        <CreatePost open={open} setOpen={setOpen} />
      </div>
    </div>
  );
};

export default LeftBTN;
