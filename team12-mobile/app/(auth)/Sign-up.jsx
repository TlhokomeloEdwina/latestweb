import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Button,
} from "react-native";
import Reac, { useState } from "react";
import { images } from "../../constants/images";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { Link, router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { IP_ADDRESS } from "@env";

const SignUp = () => {
  const [form, setForm] = useState({
    id_number: "",
    first_name: "",
    last_name: "",
    gender: "",
    contact_number: "",
    email: "",
    password: "",
    image_url: "",
    expoDeviceToken: "",
    userType: "Family_Member",
  });
  const [isRegistering, setRegistering] = useState(false);
  const [image, setImage] = useState(null);

  const genderData = [
    { key: "1", value: "male" },
    { key: "2", value: "female" },
    { key: "3", value: "other" },
  ];

  const Register = async () => {
    setRegistering(true);

    const {
      id_number,
      first_name,
      last_name,
      gender,
      contact_number,
      email,
      password,
      image_url,
      expoDeviceToken,
      userType,
    } = form;

    try {
      const response = await axios.post(`http://${IP_ADDRESS}:3000/user`, {
        id_number: id_number,
        first_name: first_name,
        last_name: last_name,
        gender: gender,
        contact_number: contact_number,
        password: password,
        email: email,
        image_url: image_url,
        expoDeviceToken: expoDeviceToken,
        userType: userType,
      });

      setForm(true);
      router.replace("/Sign-in");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to sign up. Please try again");
    } finally {
      setRegistering(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);
    console.log(form);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setForm({ ...form, image_url: result.assets[0].uri });
    }
  };

  const [value, setValue] = useState(null);

  const renderItem = (item) => {
    return (
      <View className="p-4 flex-row justify-between items-center">
        <Text className="flex-1 text-lg">{item.label}</Text>
        {item.value === value && (
          <AntDesign className="mr-1" color="black" name="Safety" size={20} />
        )}
      </View>
    );
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-6 my-6">
          <View className="justify-center items-center ">
            <Image
              source={images.logo}
              resizeMode="contain"
              className="w-[115px] h-[35px] mt-2"
            />
            <Text className="text-2xl text-black text-semibold mt-10 font-psemibold">
              Carewise
            </Text>

            <Text className="text-xl text-black text-semibold mt-10 font-psemibold">
              Create an Account
            </Text>
            <Text className="text-m text-black text-semibold mt-10 font-pregular">
              Enter your email to sign up with the app
            </Text>
          </View>
          <FormField
            title="Identity Number (ID)"
            value={form.id_number}
            handleChangeText={(e) => setForm({ ...form, id_number: e })}
            otherStyles="mt-10"
            placeholder="enter your Id number"
          />
          <FormField
            title="First Name"
            value={form.first_name}
            handleChangeText={(e) => setForm({ ...form, first_name: e })}
            otherStyles="mt-10"
            placeholder="enter your first name"
          />
          <FormField
            title="Last Name"
            value={form.last_name}
            handleChangeText={(e) => setForm({ ...form, last_name: e })}
            otherStyles="mt-10"
            placeholder="enter your last name"
          />
          <FormField
            title="Gender"
            value={form.gender}
            handleChangeText={(value) => {
              setForm({ ...form, gender: value });
            }}
            otherStyles="mt-10 "
            placeholder="select gender"
          />

          <FormField
            title="Contact Number"
            type="phone"
            value={form.contact_number}
            handleChangeText={(e) => setForm({ ...form, contact_number: e })}
            otherStyles="mt-10"
            placeholder="enter your contact number"
          />
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

          <View className="flex-1 items-center justify-center  rounded-lg p-4">
            <Button
              title="Pick Image Profile"
              onPress={pickImage}
              className="mb-4 bg-black-200"
            />

            {image && (
              <Image
                source={{ uri: image }}
                style={{ width: 200, height: 200, borderRadius: 10 }}
              />
            )}
          </View>

          <CustomButton
            title="Sign Up"
            handlePress={Register}
            containerStyles="mt-7"
            isLoading={isRegistering}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Have an account already?
            </Text>
            <Link
              href="/Sign-in"
              className="text-lg font-psemibold text-[#7B68EE]"
            >
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
