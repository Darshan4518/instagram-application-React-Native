import { View, Text, Pressable } from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import Post from "../components/Post";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

const UserPosts = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userProfile } = route.params;
  return (
    <ScrollView>
      <SafeAreaView>
        <View className=" my-3 px-3 flex-row items-center justify-between">
          <Pressable onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={30} color="black" />
          </Pressable>
          <Text className=" font-bold text-lg">Posts</Text>
        </View>
        {userProfile?.posts?.length > 0 &&
          userProfile?.posts?.map((post) => {
            return <Post post={post} key={post?._id} />;
          })}
        {userProfile?.posts?.length == 0 && (
          <View>
            <Text>Posts not found</Text>
          </View>
        )}
      </SafeAreaView>
    </ScrollView>
  );
};

export default UserPosts;
