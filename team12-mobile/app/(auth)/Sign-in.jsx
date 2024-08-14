import { View, Text, ScrollView, Image, Alert, Platform } from "react-native";
import React, { useEffect } from "react";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants/images";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { Link, router } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IP_ADDRESS, PROJECT_ID } from "@env";
import { useNavigation } from "@react-navigation/native";

//Notifications
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

export let userObject = "";

const SignIn = () => {
  const navigation = useNavigation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLogin, setLoggin] = useState(false);
  const [expoToken, setExpoPushToken] = useState("");

  //Storing token in local storage
  const storeSession = async (token, newUser) => {
    try {
      const timeStamp = Date.now();
      await AsyncStorage.multiSet([
        ["authToken", token],
        ["loginTime", timeStamp.toString()],
        ["user", JSON.stringify(newUser)],
      ]);
    } catch (error) {
      console.error("Error storing user session", error);
    }
  };

  //to check if the session expired or not since it is 5 minute(for now)
  const checkSessionValidity = async () => {
    try {
      const values = await AsyncStorage.multiGet(["authToken", "loginTime"]);
      const token = values[0][1];
      const loginTime = parseInt(values[1][1], 10);
      const currentTime = Date.now();

      const sessionValidity = 3 * 60 * 1000;
      if (token && currentTime - loginTime < sessionValidity) {
        return token; //session is still valid
      } else {
        await AsyncStorage.multiRemove(["authToken", "loginTime", "user"]);
        return null;
      }
    } catch (error) {
      console.error("Error checking session validity, ", error);
      return null;
    }
  };

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const Login = async () => {
    setLoggin(true);
    const { email, password } = form;

    try {
      const loginResponse = await axios.post(
        `http://${IP_ADDRESS}:3000/login`,
        { email, password }
      );

      userObject = loginResponse.data;
      userObject.newUser.expoDeviceToken = expoToken;
      const { token, newUser } = loginResponse.data;
      await storeSession(token, newUser);

      const updateTokenResponse = await axios.post(
        `http://${IP_ADDRESS}:3000/updateToken`,
        {
          id: userObject.newUser.id,
          token: userObject.newUser.expoDeviceToken.data,
        }
      );

      setForm(true);

      if (userObject.newUser.userType === "Resident") {
        const response = await axios.get(
          `http://${IP_ADDRESS}:3000/checkindate/${userObject.newUser.id}`
        );

        if (response.data.newCheckin.length === 0) {
          // await createCheckin();
          navigation.navigate("checkin", {
            residentData: userObject.newUser,
          });

        } else {
          const datecreated = response.data.newCheckin[0].datecreated;
          const formattedDatecreated = formatDate(new Date(datecreated));
          const formattedCurrentDate = formatDate(new Date());

          if (formattedDatecreated === formattedCurrentDate) {
            router.push("/home");
          } else {
            //await createCheckin();
            navigation.navigate("checkin", {
              residentData: userObject.newUser,
            });
          }
        }
      } else {
        router.push("/home");
      }
    } catch (error) {
      console.error("Error logging In: ", error);
      Alert.alert("Error", "Failed to login, try again");
    } finally {
      setLoggin(false);
    }
  };
  /*
    const createCheckin = async () => {
      try {
        const caregiver = await axios.get(
          `http://${IP_ADDRESS}:3000/caregiverInfo/${userObject.newUser.id}`
        );
  
        if (caregiver.data) {
          const caregiver_id = caregiver.data.caregiver.caregiver_id;
          const checkin = await axios.post(
            `http://${IP_ADDRESS}:3000/createCheckin`,
            {
              resident_id: userObject.newUser.id,
              caregiver_id: caregiver_id,
            }
          );
  
          if (checkin.data) {
            console.log("checkin created");
            navigation.navigate("checkin", {
              residentData: userObject.newUser,
            });
          } else {
            Alert.alert("Checkin was not created");
          }
        } else {
          Alert.alert("Checkin was not created because caregiver not found");
        }
      } catch (error) {
        console.error("Error creating checkin: ", error);
        Alert.alert("Error", "Failed to create checkin, try again");
      }
    };
  */
  useEffect(() => {
    const checkSession = async () => {
      const token = await checkSessionValidity();
      if (token) {
        console.log("User Object: ", userObject);
        console.log("Expo token: ", userObject.newUser.expoDeviceToken.data);
        router.replace("/home");
      }
    };
    checkSession();
  }, []);

  //Notifications
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: true,
    }),
  });

  function handleRegistrationError(errorMessage) {
    alert(errorMessage);
    throw new Error(errorMessage);
  }

  async function registerForPushNotificationAsync() {
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        handleRegistrationError(
          "Permuisson not granted to get push token for push notification"
        );
        return;
      }

      const projectId = PROJECT_ID;
      if (!projectId) {
        handleRegistrationError("Project Id not found");
      }

      try {
        const Pushtoken = await Notifications.getExpoPushTokenAsync({
          projectId,
        });

        return Pushtoken;
      } catch (error) {
        handleRegistrationError(error);
      }
    }
  }

  useEffect(() => {
    registerForPushNotificationAsync()
      .then((token) => setExpoPushToken(token ?? ""))
      .catch((error) => setExpoPushToken(`${error}`));
  });

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-6 my-4">
          <View className="justify-center items-center ">
            <Image
              source={images.image3}
              resizeMode="contain"
              className="w-20 h-20"
            />

            <Text className="text-3xl text-black text-semibold mt-10 font-psemibold">
              Log in to Carewise
            </Text>
          </View>
          <FormField
            title="Email"
            type="email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyBoardType="email-address"
            placeholder="enter your email"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
            placeholder="enter your password"
          />

          <CustomButton
            title="Sign In"
            handlePress={Login}
            containerStyles="mt-7 text-white"
            isLoading={isLogin}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-[#bfcddb] font-pregular">
              Don't have an account?
            </Text>
            <Link
              href="/Sign-up"
              className="text-lg font-psemibold text-[#0b4dad]"
            >
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
