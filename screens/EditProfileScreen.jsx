import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { setAuthUser } from "../redux/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-simple-toast";
const EditProfile = () => {
  const navigation = useNavigation("");
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(null);
  const [bio, setBio] = useState(user?.bio || "");
  const [gender, setGender] = useState(user?.gender || "");

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedFile(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem("token");

    const formData = new FormData();

    formData.append("bio", bio);
    formData.append("gender", gender);

    if (selectedFile) {
      const fileName = selectedFile.split("/").pop();
      const fileType = fileName.split(".").pop();
      formData.append("profilePicture", {
        uri: selectedFile,
        name: fileName,
        type: `image/${fileType}`,
      });
    }

    try {
      const res = await axios.put(
        "https://instagram-olwk.onrender.com/api/v1/user/profile/edit",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        dispatch(setAuthUser({ ...user, ...res.data.user }));
        navigation.goBack();

        Toast.showWithGravity(
          res.data.message || "Profile updated successfully",
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
    <ScrollView className="p-4">
      <View className="mx-auto w-full">
        <Text className="text-2xl font-bold my-3">Edit Profile</Text>

        <View className="p-4 bg-slate-200 w-full flex flex-col sm:flex-row items-center justify-between rounded-2xl">
          <View className="flex items-center gap-x-4 mb-4 sm:mb-0">
            {user?.profilePicture !== "" ? (
              <Image
                source={{ uri: user?.profilePicture }}
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
            <Text className="text-xl font-semibold">{user?.userName}</Text>
          </View>
          <View className="flex flex-col sm:flex-row items-center gap-x-4">
            <TouchableOpacity
              onPress={handleImagePick}
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              <Text className="text-white">Change Photo</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="my-3">
          <Text className="text-lg font-semibold text-gray-700 my-3">Bio</Text>
          <TextInput
            value={bio}
            onChangeText={(text) => setBio(text)}
            multiline
            className="bg-slate-200 p-3 w-full rounded-2xl"
            placeholder="Enter your bio"
          />
        </View>

        <View className="my-3">
          <Text className="text-lg font-semibold text-gray-700 my-3">
            Gender
          </Text>
          <View className="bg-slate-200 rounded-2xl">
            <Picker
              selectedValue={gender}
              onValueChange={(itemValue) => setGender(itemValue)}
              className="w-full"
            >
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
              <Picker.Item label="Other" value="other" />
            </Picker>
          </View>
        </View>

        <View className="my-10">
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-blue-500 py-3 rounded-lg"
          >
            <Text className="text-white text-center">Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default EditProfile;
