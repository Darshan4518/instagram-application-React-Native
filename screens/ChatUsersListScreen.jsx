import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Pressable,
  FlatList,
} from "react-native";
import { setSelectedUser } from "../redux/chatSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const ChatUsersList = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { user, suggestedUsers } = useSelector((store) => store.auth);
  const [selectedUserTab, setSelectedUserTab] = useState();
  const { onlineUsers } = useSelector((store) => store.chat);

  const handleUserClick = (selectedUser) => {
    dispatch(setSelectedUser(selectedUser));
    setSelectedUserTab(selectedUser?._id);
    navigation.navigate("message");
  };

  const renderItem = ({ item: suggestedUser }) => {
    const isOnline = onlineUsers.includes(suggestedUser?._id);
    return (
      <View
        key={suggestedUser?._id}
        className="flex-row items-center justify-between"
      >
        <TouchableOpacity
          className={`flex flex-row items-center w-[80%] gap-x-4 ${
            suggestedUser?._id === selectedUserTab
              ? "bg-slate-100 rounded-lg"
              : ""
          } my-3 p-2`}
          onPress={() => handleUserClick(suggestedUser)}
        >
          <View>
            {suggestedUser?.profilePicture ? (
              <Image
                source={{ uri: suggestedUser?.profilePicture }}
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
          </View>
          <View>
            <Text className="text-lg font-bold">{suggestedUser?.userName}</Text>
            {isOnline ? (
              <Text className="text-green-500 text-sm font-semibold">
                Online
              </Text>
            ) : (
              <Text className="text-red-600 text-sm font-semibold">
                Offline
              </Text>
            )}
          </View>
        </TouchableOpacity>
        <Pressable>
          <Ionicons name="camera-outline" size={34} color="black" />
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView className="w-screen p-3">
      <View className="my-2 flex-row justify-between items-center">
        <Text className="text-xl font-semibold">{user?.userName}</Text>
        <Feather name="edit" size={24} color="black" />
      </View>
      <View>
        <View className="flex flex-row items-center justify-between gap-x-3 my-4">
          <Text className="font-bold text-base">Messages</Text>
          <Text className="font-bold text-base text-gray-500">Requests</Text>
        </View>
      </View>
      <View>
        {suggestedUsers?.length > 0 ? (
          <FlatList
            data={suggestedUsers}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
          />
        ) : (
          <View>
            <Text className="text-center my-10 text-lg">Users not found</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ChatUsersList;
