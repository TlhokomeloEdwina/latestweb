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
    <SafeAreaView className="bg-[#fafbfb] h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-6 my-4">
          <View className="justify-center items-center ">
            <Image
              source={images.image3}
              resizeMode="contain"
              className="w-[140px] h-[140px]"
            />
            {/* <Text className="text-4xl  text-semibold mt-2 font-psemibold text-[#0b4dad]">
              Carewise
            </Text> */}
            <View className="relative mt-5">
              <Text className="text-5xl text-black font-bold">
                Sign up
              </Text>
              <Text className="text-center text-lg">Create your account</Text>
              {/* <Text className="text-base text-black text-semibold mt-6 font-pregular">
              Enter your email to sign up with the app
            </Text> */}
            </View>
          </View>
          <FormField
            title="Identity Number (ID)"
            value={form.id_number}
            handleChangeText={(e) => setForm({ ...form, id_number: e })}
            otherStyles="mt-7"
            placeholder="Enter your Id number"
          />
          <FormField
            title="First Name"
            value={form.first_name}
            handleChangeText={(e) => setForm({ ...form, first_name: e })}
            otherStyles="mt-7"
            placeholder="Enter your first name"
          />
          <FormField
            title="Last Name"
            value={form.last_name}
            handleChangeText={(e) => setForm({ ...form, last_name: e })}
            otherStyles="mt-7"
            placeholder="Enter your last name"
          />
          <FormField
            title="Email"
            type="email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyBoardType="email-address"
            placeholder="Enter your email"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
            placeholder="Enter your password"
          />

          <FormField
            title="Gender"
            value={form.gender}
            handleChangeText={(value) => {
              setForm({ ...form, gender: value });
            }}
            otherStyles="mt-7"
            placeholder="Select gender"
          />

          <FormField
            title="Contact Number"
            type="phone"
            value={form.contact_number}
            handleChangeText={(e) => setForm({ ...form, contact_number: e })}
            otherStyles="mt-7"
            placeholder="Enter your contact number"
          />

          <Text className="mt-7 -mb-2 flex-1 text-lg text-black font-pmedium ">Image</Text>
          <View className="  p-4 mt-5" style={[{ width: '100%', backgroundColor: "#dbeafe", borderRadius: 24, height: 75, alignItems: 'left', justifyContent: 'center' }]}>

            <TouchableOpacity
              onPress={pickImage}
            >
              <Text style={{ color: '#6b7280', fontSize: 16 }}>Click to pick Image profile</Text>
            </TouchableOpacity>

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
            containerStyles="mt-10 bg-[#0b4dad]"
            isLoading={isRegistering}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-[#a1a1aa]  font-pregular">
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
