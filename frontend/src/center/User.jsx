import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const User = ({person, setSelectPerson}) => {
  return (
    <div
      onClick={() => setSelectPerson(person)}
      className='flex gap-3 items-center hover:bg-zinc-400 cursor-pointer rounded-xl m-3' 
    
    >
      <Avatar className="w-16 h-16">
        <AvatarImage
          className="w-full h-full"
          src=''
          alt="avatar"
        />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      <div>
        <p>{person?.fullname}</p>
        <p>Offline</p>
      </div>
    </div>
  );
};

export default User;
