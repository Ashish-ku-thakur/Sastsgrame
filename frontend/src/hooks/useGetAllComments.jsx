import { COMMENT_API } from "@/lib/utils";
import { setAllComments } from "@/redux/postSlicer";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

let useGetAllComments = () => {
  let { selectPost } = useSelector((store) => store?.frame);
  let dispatch = useDispatch();

  useEffect(() => {
    selectPost?._id && fetchAllComments();
  }, [selectPost?._id]);

  let fetchAllComments = async () => {
    let response = await axios.get(
      `${COMMENT_API}/getallthecomments/${selectPost?._id}`,
      { withCredentials: true }
    );

    console.log(response?.data);
    

    if (response?.data?.success) {
      dispatch(setAllComments(response?.data?.commentsOnPost));
    }
  };
};

export default useGetAllComments;
