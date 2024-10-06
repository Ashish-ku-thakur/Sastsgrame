import { POST_API } from "@/lib/utils";
import { setAllPosts } from "@/redux/postSlicer";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

let useGetAllPosts = () => {
  let dispatch = useDispatch();
  let { authUser } = useSelector((store) => store?.auth);

  useEffect(() => {
    authUser && fetchAllPosts();
  }, []);

  let fetchAllPosts = async () => {
    try {
      let response = await axios.get(`${POST_API}/getallpost`, {
        withCredentials: true,
      });

      if (response?.data?.success) {
        dispatch(setAllPosts(response?.data?.allPosts));
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export default useGetAllPosts;
