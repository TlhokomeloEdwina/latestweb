import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Body from "./body";

const Question = ({ question, onAnswer }) => {
  // returns response type

  switch (question.question_type) {
    case "choice":
      return (
        //added flex wrap and gap-5, mb-4 and my-auto , make sure it works- from basic alert 
        <View className="flex-1 gap-5, mb-4 and my-auto justify-center items-center bg-[#fafbfb] p-4">
          <Text className="text-[40px]  font-bold text-center mb-8">
            {question.question}
          </Text>

          <View className="w-full  justify-evenly px-8 py-8 pt-8 flex-none">
            {JSON.parse(question.options).map((option, index) => (

              <TouchableOpacity
                key={index}
                className="rounded-full items-center justify-center w-[159px] h-40 border  ${background} mx-8 my-8 ml-8 mr-8 opacity-[0.9] bg-[#0b4dad] border-[#0b4dad] shadow-gray-400 border-b-8 shadow-md  "
                onPress={() => onAnswer(option)}
                numColumns={2}
              >
                <Text className="text-white text-2xl">{option}</Text>
              </TouchableOpacity>

            ))}
          </View>
        </View>
      )
    case "yes_no":
      return (
        <View className="flex-1 justify-center items-center bg-[#fafbfb] p-4">
          <Text className="text-[40px]  font-bold text-center mb-8">
            {question.question}
          </Text>
          <View className="w-full flex-row justify-around ">
            <TouchableOpacity
              className="rounded-full items-center justify-center w-[159px] h-40 border  ${background} mx-2 my-5 ml-[10px] opacity-[0.9] bg-[#0b4dad] border-[#0b4dad] shadow-gray-400 border-b-8 shadow-md"
              onPress={() => onAnswer("yes")}
            >
              <Text className="text-white text-[28px] font-bold">YES</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="rounded-full items-center justify-center w-[159px] h-40 border  ${background} mx-2 my-5 ml-[10px] opacity-[0.9] bg-[#0b4dad] border-[#0b4dad] shadow-gray-400 border-b-8 shadow-md"
              onPress={() => onAnswer("no")}
            >
              <Text className="text-white text-[28px] font-bold">NO</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    case "scale":
      return (
        <View className="flex-1 justify-center items-center bg-[#fafbfb] p-4">
          <Text className="text-[40px] font-bold text-center mb-8">
            {question.question}
          </Text>
          <View className="w-full flex-row justify-around">
            <TouchableOpacity onPress={() => onAnswer("good")}>
              <FontAwesome name="smile-o" size={122} color="#4ade80" />
              <Text className="text-center text-[22px] font-bold ">GOOD</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onAnswer("morbid")}>
              <FontAwesome name="meh-o" size={120} color="#fb923c" />
              <Text className="text-center text-xl font-bold">MORBID</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onAnswer("bad")}>
              <FontAwesome name="frown-o" size={120} color="red" />
              <Text className="text-center text-xl font-bold">BAD</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    case "body":
      return (
        <View className="flex-1 justify-center items-center bg-[#fafbfb] p-4">
          <Body question={question} onAnswer={onAnswer} />
        </View>
      );

    default:
      return null;
  }
  // returns question with response option

};
export default Question;