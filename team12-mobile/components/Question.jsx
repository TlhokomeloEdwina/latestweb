import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const Question = ({ question, onAnswer }) => {
  // returns response type
  const responseOptions = () => {
    switch (question.question_type) {
      case "choice":
        return (
          <View className="w-full flex-row justify-around  ">
            {JSON.parse(question.options).map((option, index) => (
              <TouchableOpacity
                key={index}
                className="bg-[#0b4dad] rounded-full p-3 w-[118px] h-[118px]  justify-center items-center"
                onPress={() => onAnswer(option)}
              >
                <Text className="text-white text-lg">{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      case "yes_no":
        return (
          <View className="w-full flex-row justify-around ">
            <TouchableOpacity
              className="rounded-full items-center justify-center w-[159px] h-40 border  ${background} mx-2 my-5 ml-[10px] opacity-[0.9] bg-[#0b4dad] border-[#0b4dad] shadow-gray-400 border-b-8 shadow-md"
              onPress={() => onAnswer("yes")}
            >
              <Text className="text-white text-2xl font-bold">YES</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="rounded-full items-center justify-center w-[159px] h-40 border  ${background} mx-2 my-5 ml-[10px] opacity-[0.9] bg-[#0b4dad] border-[#0b4dad] shadow-gray-400 border-b-8 shadow-md"
              onPress={() => onAnswer("no")}
            >
              <Text className="text-white text-2xl font-bold">NO</Text>
            </TouchableOpacity>
          </View>
        );
      case "scale":
        return (
          <View className="w-full flex-row justify-around">
            <TouchableOpacity onPress={() => onAnswer("happy")}>
              <FontAwesome name="smile-o" size={122} color="#4ade80" />
              <Text className="text-center text-xl font-bold ">HAPPY</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onAnswer("morbid")}>
              <FontAwesome name="meh-o" size={120} color="#fb923c" />
              <Text className="text-center text-xl font-bold">MORBID</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onAnswer("sad")}>
              <FontAwesome name="frown-o" size={120} color="red" />
              <Text className="text-center text-xl font-bold">SAD</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };
  // returns question with response option
  return (
    <View className="flex-1 justify-center items-center bg-white p-4">
      <Text className="text-4xl font-bold text-center mb-8">
        {question.question}
      </Text>
      {responseOptions()}
    </View>
  );
};
export default Question;
