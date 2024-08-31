import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Image, TouchableOpacity, TextInput } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-simple-toast";
const UploadScreen = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [caption, setCaption] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    })();
  }, []);

  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    } else {
      setSelectedImage(null);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!selectedImage) {
        selectImage();
      }
    }, [selectedImage])
  );

  const handleImageRemove = () => {
    setSelectedImage(null);
    setCaption("");
    selectImage();
  };

  const handlePostClick = async () => {
    const formData = new FormData();
    formData.append("image", {
      uri: selectedImage,
      name: "photo.jpg",
      type: "image/jpeg",
    });
    formData.append("caption", caption);
    const token = await AsyncStorage.getItem("token");
    try {
      const res = await axios.post(
        `https://instagram-olwk.onrender.com/api/v1/post/addpost`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status == 201) {
        navigation.goBack();
        handleImageRemove();
        Toast.showWithGravity(
          res.data.message || "post added successfully",
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
    <View className="max-w-full mt-2 flex-1 items-center my-10">
      {selectedImage ? (
        <View className="relative my-4">
          <Image
            source={{ uri: selectedImage }}
            style={{
              width: 330,
              height: "80%",
              borderRadius: 10,
            }}
            resizeMode="stretch"
          />
          <TextInput
            placeholder="Write a caption..."
            multiline
            value={caption}
            onChangeText={setCaption}
            className=" my-5 max-w-[80%] break-words placeholder:font-bold placeholder:text-base"
          />
          <View className="flex flex-row justify-between mt-4">
            <TouchableOpacity onPress={handleImageRemove}>
              <Text className="text-red-500 text-base">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePostClick}>
              <Text className="text-blue-500 text-base">Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity onPress={selectImage} className="border p-4 rounded">
          <Text className="text-center text-gray-600">Select an Image</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default UploadScreen;
