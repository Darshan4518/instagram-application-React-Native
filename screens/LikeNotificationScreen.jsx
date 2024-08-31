import { View, Text, Pressable, Image, FlatList } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

const LikeNotificationScreen = () => {
  const navigation = useNavigation();
  const { likeNotify } = useSelector((store) => store.rtmLikeNotify);

  const renderItem = ({ item }) => {
    return (
      <View className="flex-row items-center justify-between p-4 ">
        <View className="flex-row items-center gap-x-4">
          {item?.userDetails?.profilePicture !== "" ? (
            <Image
              source={{ uri: item?.userDetails?.profilePicture }}
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <Image
              source={require("../assets/avatar.png")}
              style={{ width: 60, height: 60, borderRadius: 30 }}
              resizeMode="stretch"
            />
          )}
          <Text className="text-base font-medium">
            {item?.userDetails?.userName} _liked your post
          </Text>
        </View>

        <Image
          source={{ uri: item?.post?.image }}
          className="w-12 h-12 rounded-md"
        />
      </View>
    );
  };

  return (
    <SafeAreaView>
      <View className="p-4 flex-row items-center gap-x-4">
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color="black" />
        </Pressable>
        <Text className="text-lg font-bold">Notifications</Text>
      </View>

      <FlatList
        data={likeNotify}
        keyExtractor={(item) => item?._id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View className="items-center justify-center py-6">
            <Text>No notifications available</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default LikeNotificationScreen;
