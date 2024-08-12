import React, { useState, useEffect } from "react";
import axios from "axios";
import { View, Text, Image } from "react-native";
import Question from "../components/Question";
import { IP_ADDRESS } from "@env";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../components/CustomButton";
import { useRoute, useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import { images } from "../constants/images";
import tw from 'twrnc';


const Checkin = () => {
  const route = useRoute();
  const { residentData } = route.params || {};
  const navigation = useNavigation();

  const [checkin_id, setCheckin_id] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [ischeckin, setIsCheckin] = useState(false);
  const [isCheckinCompleted, setIsCheckinCompleted] = useState(false);

  // fetches the questions for resident to complete
  useEffect(() => {
    axios
      .get(`http://${IP_ADDRESS}:3000/questions`)
      .then((response) => {
        const formattedQuestions = response.data.questions;
        setQuestions(formattedQuestions);
      })
      .catch((error) => console.error("Error fetching questions:", error));
  }, []);

  useEffect(() => {
    axios
      .get(`http://${IP_ADDRESS}:3000/getcheckin/${residentData.id}`)
      .then((response) => {
        setCheckin_id(response.data.id);
      })
      .catch((err) => console.error("error fetching checkin", err));
  }, []);
  // submits checkin
  const submitCheckin = async (selectedOption) => {
    const currentQuestion = questions[currentQuestionIndex];

    // sets score for residents selected response
    if (selectedOption === "yes" || selectedOption === "happy") {
      setScore(1);
    } else if (selectedOption === "no" || selectedOption === "sad") {
      setScore(0);
    } else {
      setScore(1);
    }
    // submit checkin
    axios
      .post(`http://${IP_ADDRESS}:3000/submitcheckin`, {
        question_id: currentQuestion.id,
        selected_option: selectedOption,
        checkin_id: checkin_id,
        score: score,
      })
      .then((response) => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          setIsCheckinCompleted(true);

          router.replace("/home");
        }
      })
      .catch((error) => console.error("Error saving response:", error));
  };

  if (!residentData) {
    return (
      <SafeAreaView>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }
  if (ischeckin === true) {
    return (
      <SafeAreaView className="flex-1">
        <View className="flex-1 justify-center">
          {questions.length > 0 && !isCheckinCompleted ? (
            <Question
              question={questions[currentQuestionIndex]}
              onAnswer={submitCheckin}
            />
          ) : (
            <>
              <SafeAreaView>
                <Text>Loading...</Text>
              </SafeAreaView>
            </>
          )}
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 justify-center items-center bg-[source('images.checkinpic')}">
        <Image
          source={images.checkinpic}
          className="w-52 h-52 rounded-md"

        />
        <View className="flex-row items-center justify-center">
          <Text className="font-bold justify-center text-2xl">
            Good day {residentData.first_name} {residentData.last_name}
          </Text>
        </View>
        <CustomButton
          title="Complete checkin for today"
          handlePress={() => setIsCheckin(true)}
          containerStyles="w-11/12 mt-7 justify-center"
        />
      </View>
    </SafeAreaView>
  );
};

/*background image*/
/*<SafeAreaView style={tw`flex-1`}>
<ImageBackground
  source={images.checkinpic}
  style={tw`flex-1 justify-center items-center`}
>
  <Image
    source={images.checkinpic}
    style={tw`w-52 h-52 rounded-md`}
  />
  <View style={tw`flex-row items-center justify-center mt-4`}>
    <Text style={tw`font-bold text-2xl`}>
      Good day {residentData.first_name} {residentData.last_name}
    </Text>
  </View>
  <CustomButton
    title="Complete checkin for today"
    handlePress={() => setIsCheckin(true)}
    containerStyles={tw`w-11/12 mt-7 justify-center`}
  />
</ImageBackground>
</SafeAreaView>*/


export default Checkin;
