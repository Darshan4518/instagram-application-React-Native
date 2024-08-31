import { View, Text, Image, TouchableOpacity, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { setSuggestedUsers } from "../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import Feather from "@expo/vector-icons/Feather";
import Toast from "react-native-simple-toast";

const SuggestedUsers = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isFollowing, setIsFollowing] = useState(false);
  const { user, userProfile, suggestedUsers } = useSelector(
    (store) => store.auth
  );

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setError("No token found. Please login.");
        return;
      }

      try {
        const res = await axios.get(
          "https://instagram-olwk.onrender.com/api/v1/user/suggestedusers",
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.status === 200) {
          dispatch(setSuggestedUsers(res.data.users));
        }
      } catch (error) {
        Toast.showWithGravity(
          error.message || "Something went wrong",
          Toast.LONG,
          Toast.BOTTOM
        );
      }
    };

    fetchSuggestedUsers();
  }, []);

  useEffect(() => {
    setIsFollowing(userProfile?.followers?.includes(user?._id) || false);
  }, [userProfile, user]);

  const renderItem = ({ item: suggestedUser }) => (
    <View key={suggestedUser?._id} className="flex-col items-center  relative">
      <TouchableOpacity
        className="relative flex-col items-center"
        onPress={() =>
          navigation.navigate("UserProfile", { id: suggestedUser?._id })
        }
      >
        {suggestedUser?.profilePicture !== "" ? (
          <Image
            source={{ uri: suggestedUser?.profilePicture }}
            className="w-20 h-20 rounded-full"
            resizeMode="stretch"
          />
        ) : (
          <Image
            source={require("../assets/avatar.png")}
            className="w-[90px] h-[90px] rounded-full"
            resizeMode="stretch"
          />
        )}
        <View
          className="absolute -bottom-3 bg-white py-2 px-4 flex-row justify-center  rounded-2xl"
          style={{
            shadowColor: "black",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          {!isFollowing ? (
            <Feather name="user-plus" size={18} color="black" />
          ) : (
            <Feather name="user-check" size={18} color="black" />
          )}
        </View>
      </TouchableOpacity>
      <Text className=" my-4 font-bold">{suggestedUser?.userName}</Text>
    </View>
  );

  return (
    <View className="px-3 pb-2 flex-row items-center gap-x-4">
      <FlatList
        data={suggestedUsers}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 16 }}
      />
    </View>
  );
};

export default SuggestedUsers;
