import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { userObject } from "./(auth)/Sign-in";
import call from "react-native-phone-call";

const ActionButton = ({
  iconName,
  iconSize,
  iconColor,
  buttonText,
  handlePress,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      className=" rounded-lg p-4 items-center justify-center w-52 h-48 my-3 mx-3 bg-violet-600 border-violet-500 shadow-gray-400 border-b-8 shadow-md "
    >
      <FontAwesome name={iconName} size={50} color={"white"} />
      <Text className="text-xl font-bold mt-5 text-white">{buttonText}</Text>
    </TouchableOpacity>
  );
};

const ResidentDetailsPage = () => {
  const route = useRoute();
  const { residentData } = route.params || {};

  const { newUser, token } = userObject;
  const navigation = useNavigation();

  if (!residentData) {
    return (
      <SafeAreaView>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  const { first_name, last_name } = residentData;

  const handleBackButton = () => {
    navigation.goBack();
  };

  const getInitials = (name) => {
    const names = name.split(" ");
    const initials = names.map((n) => n[0]).join("");
    return initials.toUpperCase();
  };

  if (newUser.userType === "Family_Member") {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-row items-center justify-center pt-6 mb-6 px-4">
          <TouchableOpacity
            onPress={handleBackButton}
            className="absolute left-10 top-10"
          >
            <FontAwesome name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-3xl font-bold  py-2 px-4 rounded-xl shadow-md">
            Carewise
          </Text>
        </View>

        <View className="flex items-center justify-center">
          <View className=" rounded-xl p-4 flex items-center">
            <View className="w-24 h-24 rounded-full  flex items-center justify-center">
              {residentData.image_url ? (
                <View className="flex flex-row">
                  <Image
                    source={{ uri: residentData.image_url }}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <Text className="text-xl font-bold mt-6"> {first_name}</Text>
                  <Text className="text-xl font-bold mt-6"> {last_name}</Text>
                </View>
              ) : (
                <View className="flex flex-row ">
                  <View className="w-20 h-20 rounded-full flex items-center justify-center bg-gray-600">
                    <Text className="text-black text-2xl font-bold">
                      {getInitials(`${first_name} ${last_name}`)}
                    </Text>
                  </View>
                  <Text className="text-xl font-bold mt-6"> {first_name} </Text>
                  <Text className="text-xl font-bold mt-6"> {last_name} </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View className="flex items-center justify-center ">
          <View className="flex flex-col">
            <View className="flex-row space-x-2 mb-4  ">
              <ActionButton
                iconName="check-circle"
                iconSize={30}
                iconColor="black"
                buttonText="Check-in"
                handlePress={() => router.push("/checkinView")}
              />
            </View>
            <View className="flex-row space-x-8 mb-4">
              <ActionButton
                iconName="users"
                iconSize={30}
                iconColor="black"
                buttonText="Visit"
                handlePress={() => router.push("/booking")}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (newUser.userType === "Caregiver") {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-row items-center justify-center pt-6 mb-6 px-4">
          <TouchableOpacity
            onPress={handleBackButton}
            className="absolute left-4 top-4"
          >
            <FontAwesome name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-3xl font-bold py-2 px-4 rounded-xl shadow-md">
            Carewise
          </Text>
        </View>

        <View className="flex items-center justify-center">
          <View className=" rounded-xl p-4 flex items-center">
            <View className="w-24 h-24 rounded-full  flex items-center justify-center">
              {residentData.image_url ? (
                <View className="flex flex-row">
                  <Image
                    source={{ uri: residentData.image_url }}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <Text className="text-xl font-bold mt-6"> {first_name}</Text>
                  <Text className="text-xl font-bold mt-6"> {last_name}</Text>
                </View>
              ) : (
                <View className="flex flex-row">
                  <View className="w-20 h-20 rounded-full flex items-center justify-center bg-gray-100">
                    <Text className="text-black text-2xl font-bold">
                      {getInitials(`${first_name} ${last_name}`)}
                    </Text>
                  </View>
                  <Text className="text-xl font-bold mt-6"> {first_name} </Text>
                  <Text className="text-xl font-bold mt-6"> {last_name} </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View className="flex items-center justify-center ">
          <View className="flex flex-col">
            <View className="flex-row space-x-2 mb-4">
              <ActionButton
                iconName="check-circle"
                iconSize={30}
                iconColor="black"
                buttonText="Check-in"
                //handlePress={() => router.push("/checkinView")}
                handlePress={() =>
                  navigation.navigate("checkinView", {
                    id: residentData.id,
                  })
                }
              />
              {/* <ActionButton
                iconName="phone"
                iconSize={30}
                iconColor="black"
                buttonText="Call"
                handlePress={() => call(callArgs).catch(console.error)}
              />*/}
            </View>
            <View className="flex-row space-x-8 mb-4 ">
              <ActionButton
                iconName="tasks"
                iconSize={30}
                iconColor="black"
                buttonText="Activity"
                handlePress={() => router.push("/booking")}
              />
              {/*<ActionButton
                iconName="users"
                iconSize={30}
                iconColor="black"
                buttonText="Visit"
                handlePress={() => router.push("/booking")}
              />*/}
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
};

export default ResidentDetailsPage;
