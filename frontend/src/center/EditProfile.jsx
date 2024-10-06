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
import { USER_API } from "@/lib/utils";
import { setAuthuser } from "@/redux/userSlicer";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const EditProfile = () => {
  let { authUser } = useSelector((state) => state?.auth);
  let [isLoading, setIsLoading] = useState(false)
  let imageRef = useRef();
  let [imageUri, setImageUri] = useState("");
  let [addBio, setAddBio] = useState("");
  let [addGender, setGender] = useState("");

  let imageFillHandler = (e) => {
    let file = e?.target?.files[0];
    if (file) {
      setImageUri(file);
    }
  };

  let dispatch = useDispatch();

  // edit profile handler
  let EditProfilehandler = async () => {
    // console.log(imageUri, addBio, addGender);
    try {
      setIsLoading(true)
      let formData = new FormData();
      if (imageUri) formData.append("image", imageUri);
      if (addBio) formData.append("bio", addBio);
      if (addGender) formData.append("gender", addGender);

      let response = await axios.patch(
        `${USER_API}/edituserprofile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      console.log(response);
      if (response?.data?.success) {
        toast?.success(response?.data?.message);
        dispatch(setAuthuser(response?.data?.user));
      }
    } catch (error) {
      console.log(error);
    }finally{
      setIsLoading(false)
    }
  };
  return (
    <div className="w-[80%] p-5">
      <div className="w-full flex items-center justify-between ">
        <div className="w-full">
          <p className="font-semibold text-2xl mb-4">Edit Profile</p>

          {/* av  */}
          <div className="w-full flex gap-10 items-center">
            <Avatar className="w-36 h-36">
              <AvatarImage src={authUser?.profilePhoto} alt="av" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div>
              <h1 className="font-semibold">{authUser?.fullname}</h1>
              <div>{authUser?.bio}</div>
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
        <Select
          onValueChange={(value) => setGender(value)}
          className="focus-visible:ring-transparent"
        >
          <SelectTrigger>
            <SelectValue placeholder="Male" />
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

      <Button
        onClick={EditProfilehandler}
        disabled={isLoading}
        className="w-full bg-blue-500 my-6"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        ) : (
          "Submit"
        )}
      </Button>
    </div>
  );
};

export default EditProfile;
