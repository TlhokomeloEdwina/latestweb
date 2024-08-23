import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

const getInitials = (name) => {
  const names = name.split(" ");
  const initials = names.map((n) => n[0]).join("");
  return initials.toUpperCase();
};

const ResidentCard = ({ resident, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center p-4 bg-white rounded-lg shadow-md my-2"
    >
      {resident.image_url ? (
        <Image
          source={{ uri: resident.image_url }}
          className="w-16 h-16 rounded-full"
        />
      ) : (
        <View className="w-16 h-16 rounded-full bg-gray-200 justify-center items-center">
          <Text className="text-xl font-bold">
            {getInitials(`${resident.first_name} ${resident.last_name}`)}
          </Text>
        </View>
      )}
      <Text className="ml-4 text-xl font-semibold">
        {resident.first_name} {resident.last_name}
      </Text>
    </TouchableOpacity>
  );
};

export default ResidentCard;
