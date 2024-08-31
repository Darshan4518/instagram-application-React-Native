import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUseProfile } from "../redux/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-simple-toast";
const useGetUserProfile = (userId) => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const res = await axios.get(
        `https://instagram-olwk.onrender.com/api/v1/user/${userId}/profile`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        dispatch(setUseProfile(res.data.user));
      }
    } catch (error) {
      Toast.showWithGravity(
        error.message || "Somthing went wrong",
        Toast.LONG,
        Toast.BOTTOM
      );
    } finally {
      setLoading(false);
    }
  }, [userId, dispatch, user]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  return { fetchUserProfile, loading };
};

export default useGetUserProfile;
