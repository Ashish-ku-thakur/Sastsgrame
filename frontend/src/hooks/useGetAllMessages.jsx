import { setChats } from "@/redux/chatSlicer";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {MESSAGE_API} from '../lib/utils'

let useGetAllMessage = () => {
  let dispatch = useDispatch();

  let { selectedPerson } = useSelector((store) => store?.auth);

  useEffect(() => {
    selectedPerson?._id && fetchAllMessages();
  }, [selectedPerson?._id, dispatch]);

  let fetchAllMessages = async () => {
    try {
      let res = await axios.get(
        `${MESSAGE_API}/getallmessage/${selectedPerson?._id}`,
        {
          withCredentials: true,
        }
      );
      console.log(res?.data?.conversation);
      if (res?.data?.success) {
        dispatch(setChats(res?.data?.conversation?.messages));
      }
    } catch (error) {
      toast?.error(error?.response?.data?.message);
      dispatch(setChats([]));
    }
  };
};

export default useGetAllMessage;
