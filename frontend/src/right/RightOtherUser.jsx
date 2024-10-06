import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { USER_API } from "@/lib/utils";
import {
  setAuthuser,
  setOtherUsers,
  setSelectedUser,
} from "@/redux/userSlicer";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const RightOtherUser = ({ otherUser, isFollow, setIsFollow }) => {
  let { authUser, otherUsers } = useSelector(
    (store) => store?.auth
  );

  let dispatch = useDispatch();

  // follow the user
  let userFollowHandler = async (id) => {
    try {
      axios.defaults.withCredentials = true;
      let response = await axios.patch(`${USER_API}/followtheuser/${id}`);

      if (response?.data?.success) {
        toast?.success(response?.data?.message);

        // Updating authUser's following array
        let updatedAuthUser = {
          ...authUser,
          following: [...authUser.following, id], // Adding the otherUser's id
        };
        dispatch(setAuthuser(updatedAuthUser));
        setIsFollow(!isFollow); // Update isFollow state to true

        // Find the index of the user in otherUsers
        let userIndex = otherUsers?.findIndex((user) => user?._id === id);

        // If user is found, update their followers without changing the array order
        if (userIndex !== -1) {
          let updatedOtherUser = {
            ...otherUsers[userIndex],
            followers: [...otherUsers[userIndex].followers, authUser?._id], // Add current user's ID to followers
          };

          // Create a new array with the updated user at the same index
          let updatedOtherUsers = [
            ...otherUsers.slice(0, userIndex),
            updatedOtherUser,
            ...otherUsers.slice(userIndex + 1), // ye code end tak chalega
          ];

          dispatch(setOtherUsers(updatedOtherUsers)); // Update the store with the new array
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // unfollow the user
  let userUnfollowHandler = async (id) => {
    try {
      axios.defaults.withCredentials = true;
      let response = await axios.patch(`${USER_API}/unfollowtheuser/${id}`);

      if (response?.data?.success) {
        toast?.success(response?.data?.message);
        let updateAuthUser = {
          ...authUser,
          following: [...authUser.following.filter((ids) => ids != id)],
        };
        dispatch(setAuthuser(updateAuthUser));
       setIsFollow(!isFollow);

        let userIndex = otherUsers?.findIndex((user) => user?._id == id); // get the index of the user

        if (userIndex != -1) {
          let updateOtherUser = {
            ...otherUsers[userIndex],
            followers: [
              ...authUser.followers.filter((ids) => ids != authUser?._id),
            ],
          };

          let updatedOtherUsers = [
            ...otherUsers.slice(0, userIndex),
            updateOtherUser,
            ...otherUsers.slice(userIndex + 1),
          ];

          dispatch(setOtherUsers(updatedOtherUsers));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  let selectUser = (user) => {
    dispatch(setSelectedUser(user));
  };

  return (
    <div className=" w-full h-full ">
      <div className="w-full h-full ">
        <div
          onClick={() => {
            selectUser(otherUser);
          }}
          className="w-full flex justify-between items-center my-3 hover:bg-zinc-200 px-3 rounded-xl"
        >
          <Link to={`/profile/${otherUser?._id}`} className="flex gap-3">
            {/* avatar */}
            <div className="w-16 h-16">
              <Avatar className="w-full h-full">
                <AvatarImage src={otherUser?.profilePhoto} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>

            {/* discription */}
            <div className="flex gap-2 items-center font-semibold">
              <p>{otherUser?.fullname}</p>
            </div>
          </Link>

          {isFollow ? (
            <div>
              <Button
                onClick={() => userUnfollowHandler(otherUser?._id)}
                className="bg-blue-500"
              >
                Unfollow
              </Button>
            </div>
          ) : (
            <div>
              <Button
                onClick={() => userFollowHandler(otherUser?._id)}
                className="bg-blue-500"
              >
                Follow
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RightOtherUser;
