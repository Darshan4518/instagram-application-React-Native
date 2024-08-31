import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { setSearchUser } from "../redux/authSlice";
import Feather from "@expo/vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Toast from "react-native-simple-toast";
const SearchScreen = () => {
  const dispatch = useDispatch();
  const searchResults = useSelector((state) => state.auth.searchUser);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("User not found");
  const navigation = useNavigation();

  const getSearchUsers = async () => {
    const token = await AsyncStorage.getItem("token");

    try {
      const res = await axios.get(
        `https://instagram-olwk.onrender.com/api/v1/user/getsearchusers?name=${search}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (search === "") {
        dispatch(setSearchUser([]));
      }

      if (res.data.success && search !== "") {
        dispatch(setSearchUser(res.data.users));
      }
    } catch (err) {
      Toast.showWithGravity(
        error.message || "Somthing went wrong",
        Toast.LONG,
        Toast.BOTTOM
      );
      dispatch(setSearchUser([]));
    }
  };

  useEffect(() => {
    getSearchUsers();
  }, [search]);

  const renderUser = ({ item: user }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("UserProfile", { id: user?._id });
        setSearch("");
      }}
      className="flex-row items-center gap-4 p-2"
    >
      {user?.profilePicture !== "" ? (
        <Image
          source={{ uri: user?.profilePicture }}
          className="w-12 h-12 rounded-full"
          resizeMode="stretch"
        />
      ) : (
        <Image
          source={require("../assets/avatar.png")}
          className="w-16 h-16 rounded-full"
          resizeMode="stretch"
        />
      )}
      <Text className="font-medium text-xl">{user?.userName}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="p-4 flex-1">
      <View className="flex-row items-center gap-x-2">
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
            setSearch("");
          }}
        >
          <Ionicons name="arrow-back" size={35} color="black" />
        </TouchableOpacity>
        <View className="flex-row items-center border p-2 rounded flex-1">
          <Feather name="search" size={24} color="black" />
          <TextInput
            placeholder="Search users..."
            value={search}
            onChangeText={(text) => setSearch(text)}
            className="ml-2 flex-1"
          />
        </View>
      </View>

      <View className="my-4">
        {searchResults?.length > 0 ? (
          <FlatList
            data={searchResults}
            renderItem={renderUser}
            keyExtractor={(item) => item._id}
            className="w-full"
          />
        ) : (
          <Text className="text-gray-500 text-center my-10 text-lg font-semibold">
            {error || "No users found"}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default SearchScreen;
