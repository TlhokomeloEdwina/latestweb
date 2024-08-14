import React, { useState, useEffect } from "react";
import axios from "axios";
import { View, Text, Image, Alert } from "react-native";
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
  const [attendence, setAttendence] = useState("No");
  const [isCheckinCompleted, setIsCheckinCompleted] = useState(false);

  // creates checkin if user chooses to complete checkin 
  const createCheckin = async () => {
    // not sure if the creation should be done when the resident chooses to complete the checkin or done separate 
    try {
      const caregiver = await axios.get(
        `http://${IP_ADDRESS}:3000/caregiverInfo/${residentData.id}`
      );

      if (caregiver.data) {
        const caregiver_id = caregiver.data.caregiver.caregiver_id;
        const checkin = await axios.post(
          `http://${IP_ADDRESS}:3000/createCheckin`,
          {
            resident_id: residentData.id,
            caregiver_id: caregiver_id,
          }
        );
        // get checkin if it was created, might cause issues
        if (checkin.data) {
          console.log("checkin created");
          try {
            const checkinresponse = await axios.get(`http://${IP_ADDRESS}:3000/getcheckin/${residentData.id}`);
            if (checkinresponse.data) {
              //if checkin exists allow resident to complete checkin 
              setCheckin_id(checkinresponse.data.id);
              setIsCheckin(true);
            } else {
              setCheckin_id(null);
              setIsCheckin(false);
            }
          } catch (error) {
            console.error("error fetching checkin", err)
          }
        } else {
          Alert.alert("Checkin does not exist");
          router.replace("/home"); // to avoid it causing an error 
        }
      } else {
        Alert.alert("Checkin was not created because caregiver not found");
        router.replace("/home"); // to avoid it causing an error 
      }
    } catch (error) {
      console.error("Error creating checkin: ", error);
      Alert.alert("Error", "Failed to create checkin, try again");
      router.replace("/home"); // to avoid it causing an error 
    }
  };

  // if resident chooses to skip the checkin
  const handleSkip = () => {
    Alert.alert("Warning", "Checkin skipped remember to complete before end of day");
    setIsCheckin(false);
    router.replace("/home");
  }

  // fetches the questions for resident to complete
  useEffect(() => {
    axios
      .get(`http://${IP_ADDRESS}:3000/questions`)
      .then((response) => {
        const formattedQuestions = response.data.questions;
        setQuestions(formattedQuestions);
        // getAttendence();
      })
      .catch((error) => console.error("Error fetching questions:", error));
  }, []);

  /* useEffect(() => {
     axios
       .get(`http://${IP_ADDRESS}:3000/getcheckin/${residentData.id}`)
       .then((response) => {
         setCheckin_id(response.data.id);
       })
       .catch((err) => console.error("error fetching checkin", err));
   }, []);
   */

  const getAttendence = async () => {
    try {
      const attendenceResponse = await axios.get(`http://${IP_ADDRESS}:3000/residentAttendence/${residentData.id}`);
      if (attendenceResponse.data.length > 0) {
        setAttendence("Yes");
      } else {
        setAttendence("No");
      }
    } catch (error) {
      console.error("Error", "error occured fetching resident attendence")
    }
  }

  const calculateScore = (currentQuestion, selectedOption) => {

    switch (currentQuestion.question_type) {
      case "scale":

        if (currentQuestion.id === 2) {
          // checks if resident attended the social activities, if they lie scores are set to one
          if (attendence === "Yes") {
            if (selectedOption === "good") {
              setScore(3);
            } else if (selectedOption === "morbid") {
              setScore(2);
            } else {
              setScore(1);
            }
          } else if (attendence === "No") {
            if (selectedOption === "good") {
              setScore(1);
            } else if (selectedOption === "morbid") {
              setScore(1);
            } else {
              setScore(1);
            }
          }
        } else {
          if (selectedOption === "good") {
            setScore(3);
          } else if (selectedOption === "morbid") {
            setScore(2);
          } else {
            setScore(1);
          }
        }
        break;
      case "yes_no":

        if (currentQuestion.id === 7) { // not sure now if its 6 or 7 , if using index then it should be 6 else if using question id then it should be 7
          if (selectedOption === "yes") {
            setScore(1);
          } else if (selectedOption === "no") {
            setScore(9); // the do you feel any pain or discomfort question ( sets the score to 9 if they are pain free since it skips question 8 and 9 )
          }
        } else if (currentQuestion.id === 4) {// checks if resident attended the social activities, if they lie scores are set to one  
          if (attendence === "Yes") {
            if (selectedOption === "yes") {
              setScore(3);
            } else if (selectedOption === "no") {
              setScore(1);
            }
          } else if (attendence === "No") {
            if (selectedOption === "yes") {
              setScore(1);
            } else if (selectedOption === "no") {
              setScore(1);
            }
          }

        } else {
          if (selectedOption === "yes") {
            setScore(3);
          } else if (selectedOption === "no") {
            setScore(1);
          }
        }
        break;
      case "choice":
        if (selectedOption === "red" || selectedOption === "blue" || selectedOption === "never") {
          setScore(1);
        } else if (selectedOption === "yellow" || selectedOption === "sometimes" || selectedOption === "rearly") {
          setScore(1);
        } else if (selectedOption === "green" || selectedOption === "always") {
          setScore(3);
        } else {
          setScore(2);
        }
        break;
      case "body":
        if (selectedOption === "Head" || selectedOption === "Back"
          || selectedOption === "Chest") {
          setScore(1);
        } else if (selectedOption === "Stomach" || selectedOption === "Hips" || selectedOption === "Back Neck" ||
          selectedOption === "Neck" || selectedOption === "Back Hips" || selectedOption === "Neck"
        ) {
          setScore(1);
        } else {
          setScore(2);
        }
        break;
      default:
        return null;
    }
  }

  // submits checkin
  const submitCheckin = async (selectedOption) => {
    const currentQuestion = questions[currentQuestionIndex];

    // sets the score not sure if it works fine or should be in use effect  
    calculateScore(currentQuestion, selectedOption);

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
          // checks if the pain question has been reached 
          if (currentQuestionIndex === 6 && selectedOption === "No") { // since index starts at 0 - 8, 
            setIsCheckinCompleted(true); // if resident feels no pain end checkin and route home
            router.replace("/home");
          } else {
            setCurrentQuestionIndex(currentQuestionIndex + 1); // not sure if should be outside of if statement or duplicated outside of statement
          }

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
        <View classname="flex-row justify-around items-center">

          <CustomButton
            title="Complete checkin"
            handlePress={() => createCheckin()}
            containerStyles="w-11/12 mt-7 justify-center"
          />

          <CustomButton
            title="Skip"
            handlePress={() => handleSkip()}
            containerStyles="w-1/4 mt-7 ml-2 "
          />
        </View>

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
