import { Image, ScrollView, StatusBar, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants/images";
import CustomButton from "../components/CustomButton";
import { useRouter } from "expo-router";

export default function App() {
  const router = useRouter();
  return (
    <SafeAreaView className="h-full bg-[#fafbfb]">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full justify-center items-center min-h-[85vh] px-4">
          <Image
            source={images.image3}
            className="max-w-[380px] w-full h-[300px]"
            resizeMode="contain"
          />

          <View className="relative mt-5">
            <Text className="text-3xl text-black font-bold text-center">
              Welcome to <Text className="text-[#0b4dad] text-4xl">Carewise</Text>{" "}
            </Text>
          </View>

          <CustomButton
            title="Continue with Email"
            handlePress={() => router.push("/Sign-in")}
            containerStyles="w-full mt-7 "
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
