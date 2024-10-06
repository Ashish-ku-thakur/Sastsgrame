import { useSelector } from "react-redux";
import Message from "./Message";
import useGetRTChat from "@/hooks/useGetRTChat";
const Messages = () => {
  // let arr = [1, 2, 3, 5, 6, 7, 8, 9, 10];
let {chats} = useSelector((store) => store?.chat);
useGetRTChat()
  return (
    <div className="m-3">
      <div className="w-fit bg-blue-300 rounded-sm p-2 my-3 font-serif">
        {
          chats?.map((mess, index) =>  <Message key={index} mess={mess}/>)
        }
       
      </div>
    </div>
  );
};



export default Messages;
