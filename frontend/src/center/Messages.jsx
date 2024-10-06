import { useSelector } from "react-redux";
import Message from "./Message";
import useGetRTChat from "@/hooks/useGetRTChat";
const Messages = () => {
let {chats} = useSelector((store) => store?.chat);
useGetRTChat()
  return (
    <div className="m-3 w-full">
      <div className="w-full rounded-sm p-2 my-3 font-serif">
        {
          chats?.map((mess, index) =>  <Message key={index} mess={mess}/>)
        }
       
      </div>
    </div>
  );
};



export default Messages;
