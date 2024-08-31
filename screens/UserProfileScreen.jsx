import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useDispatch, useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import Feather from "@expo/vector-icons/Feather";
import Fontisto from "@expo/vector-icons/Fontisto";
import Octicons from "@expo/vector-icons/Octicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ScrollView } from "react-native-gesture-handler";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  followFailure,
  followRequest,
  followSuccess,
  setAuthUser,
  unfollowSuccess,
} from "../redux/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { setSelectedUser } from "../redux/chatSlice";
import { setPosts } from "../redux/postsSlice";
import Toast from "react-native-simple-toast";
const UserProfileScreen = () => {
  const route = useRoute();
  const { id } = route.params;
  const navigation = useNavigation();
  useEffect(() => {
    if (!id) {
      navigation.goBack();
    }
  }, [id]);
  const dispatch = useDispatch();
  const { user, userProfile } = useSelector((store) => store.auth);

  const [selectedTab, setSelectedTab] = useState("post");
  const { loading } = useGetUserProfile(id);

  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [isRequestInProgress, setIsRequestInProgress] = useState(false);

  const isLoggedUser = user?._id === userProfile?._id;

  useEffect(() => {
    setIsFollowing(userProfile?.followers?.includes(user?._id) || false);
    setFollowerCount(userProfile?.followers?.length || 0);
  }, [userProfile, user, id]);

  const followOrUnfollowUser = async () => {
    if (isRequestInProgress) return;
    setIsRequestInProgress(true);
    dispatch(followRequest());
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.post(
        `https://instagram-olwk.onrender.com/api/v1/user/followorunfollow/${id}`,
        {},
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status == 200) {
        const { action, user: updatedUser } = res.data;

        if (action === "follow") {
          setIsFollowing(true);
          setFollowerCount((prev) => prev + 1);
          dispatch(followSuccess(updatedUser));
          Toast.showWithGravity("Following ", Toast.LONG, Toast.BOTTOM);
        } else if (action === "unfollow") {
          setIsFollowing(false);
          setFollowerCount((prev) => prev - 1);
          dispatch(unfollowSuccess(updatedUser));
          Toast.showWithGravity("Unfollowed ", Toast.LONG, Toast.BOTTOM);
        }
      }
    } catch (error) {
      dispatch(followFailure(error.message));
      Toast.showWithGravity(
        error.message || "Somthing went wrong",
        Toast.LONG,
        Toast.BOTTOM
      );
    } finally {
      setIsRequestInProgress(false);
    }
  };

  // log out
  const logoutHandler = async () => {
    const token = await AsyncStorage.getItem("token");

    try {
      const res = await axios.get(
        "https://instagram-olwk.onrender.com/api/v1/user/logout",
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedUser(null));
        dispatch(setPosts([]));
        navigation.navigate("Login");
        Toast.showWithGravity(
          res.data.message || " Logout successfully",
          Toast.LONG,
          Toast.BOTTOM
        );
      } else {
        Toast.showWithGravity(
          error.message || "logout failed",
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
    <ScrollView showsVerticalScrollIndicator={false}>
      <SafeAreaView>
        {loading ? (
          <View className=" flex-1 justify-center items-center my-4 ">
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <View className="space-y-4 p-3 relative">
            <View className="flex-row items-center justify-between ">
              <View className="flex-row gap-x-6 items-center">
                <Pressable onPress={() => navigation.goBack()}>
                  <Ionicons name="arrow-back" size={30} color="black" />
                </Pressable>
                <Text className="font-bold text-xl">
                  {userProfile?.userName}
                </Text>
              </View>
              {isLoggedUser ? (
                <View className="flex-row gap-x-6">
                  <Pressable onPress={() => navigation.navigate("Upload")}>
                    <Feather name="plus-square" size={26} color="black" />
                  </Pressable>
                  <Pressable onPress={logoutHandler}>
                    <SimpleLineIcons name="logout" size={24} color="black" />
                  </Pressable>
                </View>
              ) : null}
            </View>

            <View className="gap-x-3 flex-row items-center justify-evenly">
              {userProfile?.profilePicture !== "" ? (
                <Image
                  source={{ uri: userProfile?.profilePicture }}
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
              <TouchableOpacity className="flex items-center">
                <Text className="font-bold text-base">
                  {userProfile?.posts?.length}
                </Text>
                <Text className="font-semibold">Posts</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex items-center">
                <Text className="font-bold text-base">{followerCount}</Text>
                <Text className="font-semibold">Followers</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex items-center">
                <Text className="font-bold text-base">
                  {userProfile?.following?.length}
                </Text>
                <Text className="font-semibold">Following</Text>
              </TouchableOpacity>
            </View>

            <View className="max-w-[60vw]">
              <Text className="font-semibold" numberOfLines={6}>
                {userProfile?.bio}
              </Text>
            </View>

            {isLoggedUser ? (
              <View className="flex-row justify-evenly items-center gap-x-4">
                <TouchableOpacity
                  className="bg-slate-200 py-3 w-[35%] rounded-lg"
                  onPress={() => navigation.navigate("EditProfileScreen")}
                >
                  <Text className="font-bold text-center">Edit profile</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-slate-200 py-3 w-[35%] rounded-lg">
                  <Text className="font-bold text-center">Share profile</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-slate-200 py-2 w-[15%] rounded-lg flex-row items-center justify-center">
                  <Feather name="user-plus" size={24} color="black" />
                </TouchableOpacity>
              </View>
            ) : (
              <View className="flex-row justify-evenly items-center gap-x-3">
                <TouchableOpacity
                  className={`${
                    isFollowing
                      ? "bg-gray-400 hover:bg-gray-300"
                      : "bg-blue-500 hover:bg-blue-300"
                  } py-3 w-[35%] rounded-lg`}
                  onPress={followOrUnfollowUser}
                  disabled={isRequestInProgress}
                >
                  <Text className="font-bold text-center">
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-slate-200 py-3 w-[35%] rounded-lg">
                  <Text className="font-bold text-center">Message</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-slate-200 py-2 w-[15%] flex-row items-center justify-center rounded-lg">
                  <Feather name="user-plus" size={24} color="black" />
                </TouchableOpacity>
              </View>
            )}
            <View className="flex-row justify-evenly gap-x-8 items-center pt-3 border-b border-gray-300">
              <Pressable
                className={`${
                  selectedTab === "post" ? "border-b-2 border-black" : ""
                } pb-2 px-3`}
                onPress={() => setSelectedTab("post")}
              >
                <Fontisto name="nav-icon-grid" size={24} color="black" />
              </Pressable>
              <Pressable
                className={`${
                  selectedTab === "reels" ? "border-b-2 border-black" : ""
                } pb-2 px-3`}
                onPress={() => setSelectedTab("reels")}
              >
                <Octicons name="video" size={28} color="black" />
              </Pressable>
              <Pressable
                className={`${
                  selectedTab === "saved" ? "border-b-2 border-black" : ""
                } pb-2 px-3`}
                onPress={() => setSelectedTab("saved")}
              >
                <MaterialIcons name="bookmark" size={30} color="black" />
              </Pressable>
            </View>

            <View>
              {selectedTab === "post" ? (
                <View className="">
                  <View className="flex-wrap flex-row justify-start gap-1">
                    {userProfile?.posts?.map((post) => {
                      return (
                        <TouchableOpacity
                          key={post?._id}
                          onPress={() =>
                            navigation.navigate("userposts", { userProfile })
                          }
                        >
                          <Image
                            source={{ uri: post?.image }}
                            style={{
                              width: 120,
                              height: 120,
                              resizeMode: "stretch",
                            }}
                          />
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              ) : (
                <View className="flex flex-col items-center my-5">
                  <Text className="text-xl font-bold">Capture the moment</Text>
                  <Text className="text-xl font-bold">with a friend</Text>
                  <TouchableOpacity>
                    <Text className="text-base font-bold text-blue-500 my-3">
                      Create your first post
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        )}
      </SafeAreaView>
    </ScrollView>
  );
};

export default UserProfileScreen;
