import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRef, useState } from "react";

const EditProfile = () => {
  let imageRef = useRef();
  let [imageUri, setImageUri] = useState("");
  let [addBio, setAddBio] = useState("");
  let [addGender, setGender] = useState("Male")


  let imageFillHandler = (e) => {
    let file = e?.target?.files[0];
    if (file) {
      setImageUri(file);
    }
  };


  

  let EditProfilehandler = () => {
    console.log(imageUri, addBio, addGender);
    
  };
  return (
    <div className="w-[80%] p-5">
      <div className="w-full flex items-center justify-between border border-black">
        <div className="w-full">
          <p className="font-semibold text-2xl mb-4">Edit Profile</p>

          {/* av  */}
          <div className="w-full flex gap-10 items-center">
            <Avatar className="w-36 h-36">
              <AvatarImage src="https://github.com/shadcn.png" alt="av" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div>
              <h1 className="font-semibold">Ashish</h1>
              <div>
                Hy i am <br /> Ashish
              </div>
            </div>
          </div>
        </div>

        {/* file btn */}
        <div>
          <Input
            onChange={imageFillHandler}
            type="file"
            ref={imageRef}
            className="hidden"
          />
          <Button
            onClick={() => imageRef?.current?.click()}
            className="bg-blue-500"
          >
            Change Photo
          </Button>
        </div>
      </div>

      <div className="my-8 ">
        <p>Add Bio</p>
        <Textarea
          value={addBio}
          onChange={(e) => setAddBio(e?.target?.value)}
          placeholder="Text here..."
          className="focus-visible:ring-transparent"
        />
      </div>

      <div className="my-6">
        <p>Select Gender</p>
        <Select onValueChange={(value) => setGender(value)} className="focus-visible:ring-transparent">
          <SelectTrigger>
            <SelectValue placeholder="Male"/>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Gender</SelectLabel>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={EditProfilehandler} className="w-full bg-blue-500 my-6">
        Submit
      </Button>
    </div>
  );
};

export default EditProfile;
