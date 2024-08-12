import { TouchableOpacity, Text } from "react-native";
import React from "react";

const FlexButton = ({
  title,
  handlePress,
  containerStyles,
  isLoading,
  textStyles,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`border-2 border-cyan-400 rounded-md min-h-[62px] w-fit px-3 justify-center items-center ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
      disabled={isLoading}
    >
      <Text className={`text-white font-psemibold text-lg ${textStyles}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default FlexButton;
