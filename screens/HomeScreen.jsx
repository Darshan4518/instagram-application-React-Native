import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Image,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import Post from "../components/Post";
import { useDispatch, useSelector } from "react-redux";
import { addPost, setPosts } from "../redux/postsSlice";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import SuggestedUsers from "../components/SuggestedUsers";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-simple-toast";
const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { posts } = useSelector((store) => store.posts);
  const { user } = useSelector((store) => store.auth);
  useEffect(() => {
    if (!user) {
      navigation.navigate("Login");
    }
  }, [user]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(5);
  const [loading, setLoading] = useState(false);

  const getPosts = async (page = 1) => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setError("No token found. Please login.");
        return;
      }

      const res = await axios.get(
        `https://instagram-olwk.onrender.com/api/v1/post/all?page=${page}&limit=${limit}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        if (page === 1) {
          dispatch(setPosts(res.data.posts));
        } else {
          dispatch(addPost(res.data.posts));
        }
        setTotalPages(res.data?.pagination?.totalPages || 1);
      }
    } catch (error) {
      Toast.showWithGravity(
        error.message || "Somthing went wrong",
        Toast.LONG,
        Toast.BOTTOM
      );
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages && !loading) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    if (currentPage <= totalPages) {
      getPosts(currentPage);
    }
    // const interval = setInterval(() => {
    //   getPosts(1);
    // }, 60000);

    // return () => clearInterval(interval);
  }, [currentPage, dispatch, user]);

  return (
    <SafeAreaView>
      {!loading && (
        <FlatList
          ListHeaderComponent={
            <View>
              <View className="my-4 flex-row items-center px-4 justify-between">
                <Image
                  source={require("../assets/instagramlogo.png")}
                  className="w-40 h-10 "
                  resizeMode="stretch"
                />
                <View className=" flex-row gap-x-6">
                  <Pressable
                    onPress={() => {
                      navigation.navigate("likeNotify");
                    }}
                  >
                    <MaterialIcons
                      name="favorite-border"
                      size={30}
                      color="black"
                    />
                  </Pressable>
                  <Pressable onPress={() => navigation.navigate("Search")}>
                    <FontAwesome name="search" size={26} color="black" />
                  </Pressable>
                </View>
              </View>
              <SuggestedUsers />
            </View>
          }
          data={posts}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item?._id}
          renderItem={({ item: post }) => <Post post={post} />}
          ListFooterComponent={() =>
            currentPage < totalPages && !loading ? (
              <View className="my-4 justify-center items-center">
                <TouchableOpacity onPress={handleLoadMore}>
                  <Text className="bg-blue-500 text-white px-4 py-2 rounded">
                    Load More
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null
          }
          ListEmptyComponent={() =>
            !loading && posts?.length === 0 ? (
              <View className="justify-center items-center my-4">
                <Text>No posts available</Text>
              </View>
            ) : null
          }
          ListFooterComponentStyle={{ marginBottom: 20 }}
        />
      )}
      {loading && (
        <View className="justify-center items-center my-4">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;
