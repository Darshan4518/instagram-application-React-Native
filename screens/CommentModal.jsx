import React, { useState } from "react";
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Text,
  Modal,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setPosts } from "../redux/postsSlice";
import axios from "axios";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-simple-toast";
const CommentsModal = ({ route }) => {
  const { post } = route.params;
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.posts);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [text, setComment] = useState("");
  const [comments, setComments] = useState(post.comments || []);
  const [selectedComment, setSelectedComment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const changeEventHandler = (val) => {
    setComment(val.trim() ? val : "");
  };

  const addComment = async () => {
    if (!text.trim()) return;

    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.post(
        `https://instagram-olwk.onrender.com/api/v1/post/${post?._id}/comment`,
        { text },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.status === 201) {
        const newComment = res.data.comment;
        const updatedComments = [...comments, newComment];
        setComments(updatedComments);
        const updatedData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedComments } : p
        );
        dispatch(setPosts(updatedData));
        setComment("");
        Toast.showWithGravity(
          res.data.message || "Comment added successfully",
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

  const deleteComment = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.delete(
        `https://instagram-olwk.onrender.com/api/v1/post/${post._id}/comment/${selectedComment?._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 200) {
        const updatedComments = comments.filter(
          (comment) => comment._id !== selectedComment._id
        );
        setComments(updatedComments);

        const updatedData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedComments } : p
        );
        dispatch(setPosts(updatedData));
        setModalVisible(false);
        Toast.showWithGravity(
          res.data.message || "domment deleted successfully",
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
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex flex-row items-center justify-between p-4 border-b border-gray-300">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-bold">Comments</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <View
              key={comment?._id}
              className="flex flex-row items-center my-2"
            >
              {comment?.author?.profilePicture !== "" ? (
                <Image
                  source={{ uri: comment?.author?.profilePicture }}
                  resizeMode="stretch"
                  style={{ width: 40, height: 40, borderRadius: 20 }}
                />
              ) : (
                <Image
                  source={require("../assets/avatar.png")}
                  style={{ width: 60, height: 60, borderRadius: 30 }}
                  resizeMode="stretch"
                />
              )}
              <TouchableOpacity
                className="ml-3 flex-1 relative"
                onPressIn={() => {
                  if (user?._id === comment?.author?._id) {
                    setSelectedComment(comment);
                    setModalVisible(true);
                  }
                }}
              >
                <Text className="font-bold text-base">
                  {comment?.author?.userName}
                </Text>
                <Text className=" font-semibold">{comment?.text}</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View className="flex items-center justify-center h-40">
            <Text className="text-gray-500">No comments yet.</Text>
          </View>
        )}
      </ScrollView>

      <View className="flex flex-row items-center p-4 border-t border-gray-300">
        {user?.profilePicture !== "" ? (
          <Image
            source={{ uri: user?.profilePicture }}
            resizeMode="stretch"
            style={{ width: 40, height: 40, borderRadius: 20 }}
          />
        ) : (
          <Image
            source={require("../assets/avatar.png")}
            style={{ width: 40, height: 40, borderRadius: 20 }}
            resizeMode="stretch"
          />
        )}
        <TextInput
          placeholder="Add a comment..."
          value={text}
          autoFocus
          onChangeText={changeEventHandler}
          className="flex-1 mx-3 border border-gray-300 rounded-full px-4 py-2"
        />
        <TouchableOpacity onPress={addComment} disabled={!text.trim()}>
          <Text
            className={`text-blue-500 font-bold ${
              !text.trim() ? "opacity-50" : ""
            }`}
          >
            Post
          </Text>
        </TouchableOpacity>
      </View>
      {/* Modal fo Delete Comment */}

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
                onPress={deleteComment}
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

export default CommentsModal;
