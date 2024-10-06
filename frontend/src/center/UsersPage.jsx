// import { MessageCircle } from "lucide-react";
import User from "./User";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Messages from "./Messages";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import useRTSandesh from "@/hooks/useRTSandesh";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setSelectedPerson } from "@/redux/userSlicer";
import axios from "axios";
import { MESSAGE_API } from "@/lib/utils";
import { setChats } from "@/redux/chatSlicer";
import { toast } from "sonner";
import useGetAllMessage from "@/hooks/useGetAllMessages";

const UsersPage = () => {
  useGetAllMessage();
  let [messageText, setMessageText] = useState(null);
  let { otherUsers } = useSelector((store) => store?.auth);
  let [selectPerson, setSelectPerson] = useState(null);

  let dispatch = useDispatch();
  dispatch(setSelectedPerson(selectPerson));

  let { chats } = useSelector((store) => store?.chat);

  let handleSendMessage = async () => {
    try {
      let response = await axios.post(
        `${MESSAGE_API}/messagecreate/${selectPerson?._id}`,
        {
          text: messageText,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        console.log([...chats, response?.data?.newMessage]);
        dispatch(setChats([...chats, response?.data?.newMessage]));
        setMessageText("");
      }
    } catch (error) {
      toast?.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="w-full h-screen flex overflow-x-hidden">
      {/* left user page */}
      <div className="w-[40%] h-full">
        <div className="w-full h-[8%] flex items-center justify-center">
          <p className="w-full text-center font-semibold">Ashish</p>
        </div>

        <hr className=" border border-black m-2" />

        <div className="border border-black w-full h-[80%] overflow-y-scroll scrollbar-hidden">
          {otherUsers?.map((person) => (
            <User
              key={person?._id}
              person={person}
              setSelectPerson={setSelectPerson}
            />
          ))}
        </div>
      </div>

      {/* right default page */}
      {/* <div className="w-[60%] h-full flex items-center justify-center">
        <div className="border border-black">
          <div className="w-full flex flex-col items-center">
            <MessageCircle className="w-40 h-40" />
            <p className="text-center font-bold text-2xl">Your Messages</p>
            <p className="text-center font-semibold text-xl">
              Start Messages select any one
            </p>
          </div>
        </div>
      </div> */}

      {/* right not default */}
      <div className="w-[58%] h-full border border-black">
        {/* avatar & detail */}
        <div className="h-[10%] w-full flex gap-2 items-center mx-2">
          <Avatar className="w-14 h-14">
            <AvatarImage
              className="w-full h-full"
              src="https://github.com/shadcn.png"
              alt="ar"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <div>
            <p>Ash</p>
          </div>
        </div>

        <hr className="border border-black mx-2" />

        {/* All messages */}
        <div className="w-full h-[84%] border border-black overflow-y-scroll">
          <Messages />
        </div>

        {/* input field & btn */}
        <div className="flex items-center">
          <Input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e?.target?.value)}
            placeholder="Add Message..."
          />
          <Button onClick={handleSendMessage} className="bg-blue-500">
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
