import React, { useEffect, useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image, View, Text, TouchableOpacity, Modal } from "react-native";
import { setPosts } from "../redux/postsSlice";
import Feather from "@expo/vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Octicons from "@expo/vector-icons/Octicons";
import Toast from "react-native-simple-toast";

const Post = ({ post }) => {
  const { posts } = useSelector((store) => store.posts);
  const navigation = useNavigation();
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [like, setLike] = useState(post?.likes?.includes(user?._id) || false);
  const [likeCount, setLikeCount] = useState(post?.likes?.length);
  const [isModalVisible, setModalVisible] = useState(false);

  const getToken = async () => {
    return await AsyncStorage.getItem("token");
  };

  const deletePost = async () => {
    try {
      const token = await getToken();
      const res = await axios.delete(
        `https://instagram-olwk.onrender.com/api/v1/post/delete/${post?._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.status === 201) {
        dispatch(setPosts(posts.filter((p) => p?._id !== post?._id)));
        Toast.showWithGravity(
          res.data.message || "post deleted successfully",
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

  const likeOrDislike = async () => {
    try {
      const token = await getToken();
      const action = like ? "dislike" : "like";
      const res = await axios.get(
        `https://instagram-olwk.onrender.com/api/v1/post/${post?._id}/${action}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.status === 201) {
        setLike(!like);
        setLikeCount((prevCount) => (like ? prevCount - 1 : prevCount + 1));

        const updatedLikes = like
          ? post.likes.filter((id) => id !== user._id)
          : [...post.likes, user._id];
        const updatedData = posts?.map((p) =>
          p._id === post._id ? { ...p, likes: updatedLikes } : p
        );
        dispatch(setPosts(updatedData));
        Toast.showWithGravity(
          res.data.message || "liked",
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
  const handlePress = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View className="space-y-4 mb-6">
      <View className="flex flex-row gap-x-3 items-center justify-between px-4">
        <View className="flex flex-row gap-x-2 items-center">
          {post?.author?.profilePicture !== "" ? (
            <Image
              source={{ uri: post?.author?.profilePicture }}
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
          <Text className="text-lg font-bold capitalize">
            {post?.author?.userName}
          </Text>
        </View>
        <TouchableOpacity onPress={handlePress}>
          <Entypo name="dots-three-vertical" size={20} color="black" />
        </TouchableOpacity>
      </View>

      <View className="w-full">
        <Image
          source={{ uri: post?.image }}
          style={{ width: "100%", height: 400, resizeMode: "stretch" }}
        />
      </View>

      <View className="flex flex-row items-center justify-between px-4">
        <View className="flex flex-row items-center gap-x-6">
          <TouchableOpacity
            className="flex flex-row items-center gap-x-1"
            onPress={likeOrDislike}
          >
            <MaterialIcons
              name={like ? "favorite" : "favorite-border"}
              size={32}
              color={like ? "red" : "black"}
            />
            <Text className="text-lg">{likeCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex flex-row items-center gap-x-1"
            onPress={() => navigation.navigate("CommentModal", { post: post })}
          >
            <Feather name="message-circle" size={30} color="black" />
            <Text className="text-lg">{post?.comments?.length}</Text>
          </TouchableOpacity>

          <MaterialCommunityIcons name="send-outline" size={30} color="black" />
        </View>

        <Feather name="bookmark" size={30} color="black" />
      </View>

      <View className="px-4 space-y-1">
        <View className="flex-row">
          <Text className="font-bold text-lg">{post?.author?.userName}</Text>
          <Text className="ml-2 text-lg">{post?.caption}</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("CommentModal", { post: post })}
        >
          <Text className="text-base text-gray-600">View all comments</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end   items-center bg-transparent bg-opacity-20">
          <View className="bg-white rounded-lg p-4 pb-13 w-[100%] space-y-8">
            <View className=" flex-row justify-evenly">
              <TouchableOpacity>
                <View className="flex flex-col items-center mb-2">
                  <View className=" p-3 border border-gray-600 rounded-full">
                    <Feather name="bookmark" size={30} />
                  </View>
                  <Text className="my-2 text-base font-bold">Save</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity>
                <View className="flex flex-col items-center mb-2">
                  <View className=" p-3 border border-gray-600 rounded-full">
                    <MaterialCommunityIcons
                      name="repeat-variant"
                      size={30}
                      color="black"
                    />
                  </View>
                  <Text className="my-2 font-bold text-base">Remix</Text>
                </View>
              </TouchableOpacity>
            </View>

            {post?.author?._id === user?._id && (
              <TouchableOpacity onPress={deletePost}>
                <View className="flex flex-row items-center ">
                  <MaterialIcons name="delete-outline" size={30} color="red" />
                  <Text className="ml-2 text-lg font-bold text-red-200">
                    Delete Post
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            {post?.author?._id !== user?._id && (
              <TouchableOpacity>
                <View className="flex flex-row items-center ">
                  <Feather name="user-plus" size={28} color="black" />
                  <Text className="ml-3 text-lg font-bold">Follow</Text>
                </View>
              </TouchableOpacity>
            )}

            <TouchableOpacity>
              <View className="flex flex-row items-center ">
                <FontAwesome5 name="user-circle" size={26} color="black" />
                <Text className="ml-3 text-lg font-bold">
                  About this account
                </Text>
              </View>
            </TouchableOpacity>
            {post?.author?._id !== user?._id && (
              <TouchableOpacity>
                <View className="flex flex-row items-center ">
                  <Octicons name="report" size={25} color="red" />
                  <Text className="ml-3 text-lg font-bold text-red-200">
                    Report
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={handlePress}>
              <View className="flex flex-row items-center">
                <MaterialCommunityIcons name="close" size={30} color="blue" />
                <Text className="ml-2 text-lg font-bold text-blue-800">
                  Cancel
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Post;
