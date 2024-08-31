import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useSelector } from "react-redux";
import Toast from "react-native-simple-toast";

const Signup = () => {
  const { user } = useSelector((store) => store.auth);
  const navigation = useNavigation();

  useEffect(() => {
    if (user) {
      navigation.navigate("MainTabs");
    }
  }, [user, navigation]);

  const [loading, setLoading] = useState(false);
  const [passwordType, setPasswordType] = useState(true);
  const [input, setInput] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const inputFieldHandler = (name, value) => {
    setInput({ ...input, [name]: value });
  };

  const formHandler = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        "https://instagram-olwk.onrender.com/api/v1/user/register",
        input
      );
      if (res.status === 201) {
        navigation.navigate("Login");
        Toast.showWithGravity(
          res.data.message || "Registered Successfully",
          Toast.LONG,
          Toast.BOTTOM
        );
        setInput({
          userName: "",
          email: "",
          password: "",
        });
      }
    } catch (error) {
      Toast.showWithGravity(
        error.message || "Something went wrong",
        Toast.LONG,
        Toast.BOTTOM
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center px-4 py-16 bg-gray-100">
      <View className="w-full max-w-lg">
        <Text className="text-center text-2xl font-bold text-indigo-600">
          Start Your Journey Now
        </Text>
        <Text className="text-center mt-4 text-gray-500">
          Create an account and connect with people around the world. Share your
          moments, follow your favorite creators, and stay updated with the
          latest trends.
        </Text>

        <View className="mt-6 space-y-4 p-4 bg-white rounded-lg shadow-lg">
          <Text className="text-center text-lg font-medium">
            Sign up to your account
          </Text>

          <View className="relative">
            <TextInput
              placeholder="Enter username"
              value={input.userName}
              onChangeText={(value) => inputFieldHandler("userName", value)}
              className="w-full rounded-lg border-gray-200 p-4 text-sm"
            />
            <Icon
              name="account-outline"
              size={20}
              style={{
                position: "absolute",
                right: 16,
                top: 18,
                color: "gray",
              }}
            />
          </View>

          <View className="relative">
            <TextInput
              placeholder="Enter email"
              value={input.email}
              onChangeText={(value) => inputFieldHandler("email", value)}
              className="w-full rounded-lg border-gray-200 p-4 text-sm"
            />
            <Icon
              name="email-outline"
              size={22}
              style={{
                position: "absolute",
                right: 16,
                top: 18,
                color: "gray",
              }}
            />
          </View>

          <View className="relative">
            <TextInput
              placeholder="Enter password"
              value={input.password}
              secureTextEntry={passwordType}
              onChangeText={(value) => inputFieldHandler("password", value)}
              className="w-full rounded-lg border-gray-200 p-4 text-sm"
            />
            <TouchableOpacity
              style={{ position: "absolute", right: 16, top: 18 }}
              onPress={() => setPasswordType(!passwordType)}
            >
              <Icon
                name={passwordType ? "eye-outline" : "eye-off-outline"}
                size={22}
                color="gray"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={formHandler}
            className="w-full bg-indigo-600 py-3 rounded-lg"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-center text-white font-medium">
                Create Account
              </Text>
            )}
          </TouchableOpacity>

          <Text className="text-center text-sm text-gray-500">
            Already have an account?
            <Text
              onPress={() => navigation.navigate("Login")}
              className="text-blue-500 font-semibold"
            >
              Sign In
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Signup;
