import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const RightTop = () => {
  return (
    <div className="border border-black">
      <div className="flex gap-3">
        {/* avatar */}
        <div>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>

        {/* discription */}
        <div className="flex gap-2 items-center">
          <p>Ashish</p>
          <p>Bio here...</p>
        </div>
      </div>

      <hr className="border border-black m-2"/>

      <div className="w-full text-center font-semibold my-2">
        <p>See All Recomendation</p>
      </div>
    </div>
  );
};

export default RightTop;
