import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const User = ({ person, setSelectPerson }) => {
  let {  onlineUsers, selectedPerson } = useSelector((store) => store?.auth);
  let [isOnline, setIsOnline] = useState(
    onlineUsers.includes(person?._id) || false
  );

  useEffect(() => {
    setIsOnline(onlineUsers.includes(person?._id) || false);
  }, [person?._id, onlineUsers]);
  return (
    <div
      onClick={() => setSelectPerson(person)}
      className={`flex gap-3 items-center hover:bg-zinc-400 cursor-pointer rounded-xl m-3 ${
        person?._id === selectedPerson?._id ? "bg-zinc-400" : ""
      }`}
    >
      <Avatar className="w-16 h-16">
        <AvatarImage className="w-full h-full" src="" alt="avatar" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      <div>
        <p>{person?.fullname}</p>
        <p>
          {isOnline ? (
            <div className="w-3 h-3 text-green-500 rounded-full">Online</div>
          ) : (
            <div className="w-3 h-3 text-red-500 rounded-full">Offline </div>
          )}
        </p>
      </div>
    </div>
  );
};

export default User;
