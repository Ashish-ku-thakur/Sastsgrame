import { setChats } from "@/redux/chatSlicer";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

let useGetRTChat = () => {
  let dispatch = useDispatch();
  let { socket, chats } = useSelector((store) => store?.chat);

  useEffect(() => {
    fetchRealTime();

    return () => {
      socket?.off("newMassage");
    };
  }, [chats, dispatch]);

  let fetchRealTime = () => {
    socket?.on("newMassage", (realTime) => {
      dispatch(setChats([...chats, realTime]));
    });
  };
};

export default useGetRTChat;
