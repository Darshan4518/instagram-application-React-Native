import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import useGetAllMessages from "../hooks/useGetAllMessages";
import { setMessages } from "../redux/chatSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-simple-toast";
const MessageScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  useGetAllMessages();

  const { user } = useSelector((store) => store.auth);
  const { messages, selectedUser } = useSelector((store) => store.chat);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);

  const messageHandler = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      setError("No token found. Please login.");
      return;
    }
    try {
      const res = await axios.post(
        `https://instagram-olwk.onrender.com/api/v1/message/send/${selectedUser?._id}`,
        { message },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setMessage("");
        Toast.showWithGravity(
          res.data.message || "message send successfully",
          Toast.LONG,
          Toast.BOTTOM
        );
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
  };

  const handleLongPress = (message) => {
    if (message.senderId === user?._id) {
      setSelectedMessageId(message?._id);
      setModalVisible(true);
    }
  };

  const deleteMessage = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      setError("No token found. Please login.");
      return;
    }
    try {
      const res = await axios.delete(
        `https://instagram-olwk.onrender.com/api/v1/message/delete/${selectedMessageId}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.success) {
        dispatch(
          setMessages(messages.filter((msg) => msg?._id !== selectedMessageId))
        );
        setModalVisible(false);
        setSelectedMessageId(null);
        Toast.showWithGravity(
          res.data.message || "message deleted successfully",
          Toast.LONG,
          Toast.BOTTOM
        );
      }
    } catch (error) {
      Toast.showWithGravity(
        error.message || "Somthing went wrong",
        Toast.LONG,
        Toast.BOTTOM
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 p-4">
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <View className="flex-1">
          {selectedUser ? (
            <>
              <View className="flex-row items-center justify-between border-b border-gray-400 pb-3">
                <View className="flex-row items-center gap-x-3">
                  <Image
                    source={{ uri: user?.profilePicture }}
                    className="w-10 h-10 rounded-full"
                    resizeMode="stretch"
                  />
                  <Text className="text-xl font-semibold">
                    {user?.userName}
                  </Text>
                </View>
              </View>

              <View className="flex-col items-center justify-center gap-y-3 my-3">
                {selectedUser?.profilePicture !== "" ? (
                  <Image
                    source={{ uri: selectedUser?.profilePicture }}
                    resizeMode="stretch"
                    style={{ width: 100, height: 100, borderRadius: 50 }}
                  />
                ) : (
                  <Image
                    source={require("../assets/avatar.png")}
                    style={{ width: 100, height: 100, borderRadius: 50 }}
                    resizeMode="stretch"
                  />
                )}
                <Text className="text-2xl font-semibold">
                  {selectedUser?.userName}
                </Text>
                <TouchableOpacity
                  className="bg-slate-200 p-3 rounded-lg"
                  onPress={() =>
                    navigation.navigate("UserProfile", {
                      id: selectedUser?._id,
                    })
                  }
                >
                  <Text className="text-base font-bold">View profile</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                data={messages}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item: message }) => (
                  <TouchableOpacity
                    onLongPress={() => handleLongPress(message)}
                    className={`flex flex-row ${
                      message.senderId === user?._id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <Text
                      className={`p-2 px-4 text-base ${
                        message.senderId === user?._id
                          ? "bg-green-600 text-white font-bold my-2"
                          : "bg-slate-200 text-gray-500 font-bold my-2"
                      } max-w-[80%]`}
                      style={{ borderRadius: 8, flexShrink: 1 }}
                    >
                      {message.message}
                    </Text>
                  </TouchableOpacity>
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
              />

              <View className="flex-row items-center gap-x-2 border-t border-gray-400 pt-3 mt-2">
                <TextInput
                  placeholder="Type a message..."
                  className="flex-grow border rounded-md px-2 py-3 max-w-[80%] text-sm"
                  value={message}
                  onChangeText={(text) => setMessage(text)}
                />
                <TouchableOpacity
                  className="px-3"
                  onPress={messageHandler}
                  disabled={loading || message == ""}
                >
                  <Text className="text-blue-500 text-center">Send</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View className="flex-1 justify-center items-center">
              <Text className="text-sm md:text-base">
                Send a message to start a chat
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Modal for delete confirmation */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-transparent bg-opacity-50">
          <View className="bg-white p-6 rounded-lg w-4/5">
            <Text className="text-lg font-bold mb-4">Delete Message</Text>
            <Text className="text-base text-gray-700">
              Are you sure you want to delete this message? This action cannot
              be undone.
            </Text>
            <View className="flex-row justify-end mt-6">
              <TouchableOpacity
                className="mr-4"
                onPress={() => setModalVisible(false)}
              >
                <Text className="text-gray-500">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-red-500 px-4 py-2 rounded-lg"
                onPress={deleteMessage}
              >
                <Text className="text-white">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default MessageScreen;
