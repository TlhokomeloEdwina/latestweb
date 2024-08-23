import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const CircleButton = ({ iconName, onPress, color, background, title }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`rounded-[30px] items-center justify-center w-[159px] h-40 border  ${background} mx-2 my-5 ml-[10px] opacity-[0.9] mb-2`}
      activeOpacity={0.7}
    >
      <View className="rounded-md">
        <View className="items-center justify-center mx-[25px] my-[25px]">
          <FontAwesome name={iconName} size={65} color={"black"} />
          {title && <Text className="text-[22px] mt-3 text-black">{title}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CircleButton;
