import { USER_API } from "@/lib/utils";
import { setOtherUsers } from "@/redux/userSlicer";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

let useGetOtherUsers = () => {
  let dispatch = useDispatch();
  let { authUser } = useSelector((store) => store?.auth);

  useEffect(() => {
    fetchOtherUsers();
  }, [authUser?.id]);

  let fetchOtherUsers = async () => {
    let response = await axios.get(`${USER_API}/getallusers`, {
      withCredentials: true,
    });


    if (response?.data?.success) {
      dispatch(setOtherUsers(response?.data?.users));
    }
  };
};

export default useGetOtherUsers;
