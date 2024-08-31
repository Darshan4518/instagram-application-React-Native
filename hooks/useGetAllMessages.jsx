import axios from "axios";
import { useEffect } from "react";
import Toast from "react-native-simple-toast";

import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/chatSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useGetAllMessages = () => {
  const { selectedUser } = useSelector((store) => store.chat);

  const dispatch = useDispatch();
  const fetchAllMessages = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const res = await axios.get(
        `https://instagram-olwk.onrender.com/api/v1/message/all/${selectedUser?._id}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status == 200) {
        dispatch(setMessages(res.data.messages));
      }
    } catch (error) {
      Toast.showWithGravity(
        error.message || "Somthing went wrong",
        Toast.LONG,
        Toast.BOTTOM
      );
    }
  };
  useEffect(() => {
    fetchAllMessages();
  }, [selectedUser]);
};

export default useGetAllMessages;
