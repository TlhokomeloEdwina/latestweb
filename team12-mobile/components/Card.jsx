import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "expo-router";

const ResidentCard = ({ resident }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("ResidentDetails", { residentData: resident })
      }
    >
      <View className="bg-white p-4 mb-2 rounded-lg shadow-md">
        <Image
          source={{ uri: resident.image_url }}
          className="w-16 h-16 rounded-full"
        />
        <Text className="text-lg font-bold mt-2">{`${resident.first_name} ${resident.last_name}`}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ResidentCard;
