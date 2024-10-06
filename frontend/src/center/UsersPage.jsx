// import { MessageCircle } from "lucide-react";
import User from "./User";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Messages from "./Messages";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import useRTSandesh from "@/hooks/useRTSandesh";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { setSelectedPerson } from "@/redux/userSlicer";
import axios from "axios";
import { MESSAGE_API } from "@/lib/utils";
import { setChats } from "@/redux/chatSlicer";
import { toast } from "sonner";
import useGetAllMessage from "@/hooks/useGetAllMessages";
import { Loader2, MessageCircle } from "lucide-react";

const UsersPage = () => {
  useGetAllMessage();
  let [messageText, setMessageText] = useState(null);
  let { otherUsers, authUser, selectedPerson } = useSelector((store) => store?.auth);
  let [selectPerson, setSelectPerson] = useState(null);
  let [isLoading, setIsLoading] = useState(false);

  let dispatch = useDispatch();
  dispatch(setSelectedPerson(selectPerson));

  let { chats } = useSelector((store) => store?.chat);

  // send message
  let handleSendMessage = async () => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex overflow-x-hidden">
      {/* left user page */}
      <div className="w-[40%] h-full">
        <div className="w-full h-[8%] flex items-center justify-center">
          <p className="w-full text-center font-semibold">
            {authUser?.fullname}
          </p>
        </div>

        <hr className="  m-2" />

        <div className=" w-full h-[80%] overflow-y-scroll scrollbar-hidden">
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
      {!selectedPerson && (
        <div className="w-[60%] h-full flex items-center justify-center">
          <div className="">
            <div className="w-full flex flex-col items-center">
              <MessageCircle className="w-40 h-40" />
              <p className="text-center font-bold text-2xl">Your Messages</p>
              <p className="text-center font-semibold text-xl">
                Start Messages select any one
              </p>
            </div>
          </div>
        </div>
      )}

      {/* right not default */}
      <div className="w-[58%] h-full ">
        {/* avatar & detail */}
        <div className="h-[10%] w-full flex gap-2 items-center mx-2">
          <Avatar className="w-14 h-14">
            <AvatarImage
              className="w-full h-full"
              src={selectedPerson?.profile}
              alt="ar"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <div>
            <p>{selectPerson?.fullname}</p>
          </div>
        </div>

        <hr className=" mx-2" />

        {/* All messages */}
        <div className="w-full h-[84%]  overflow-y-scroll scrollbar-hidden">
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
          <Button
            disabled={isLoading}
            onClick={handleSendMessage}
            className="bg-blue-500"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            ) : (
              "Send"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
