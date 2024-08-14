import React, { useEffect, useState } from "react";
import { userObject } from "../(auth)/Sign-in";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { Text, View, FlatList, TouchableOpacity, TextInput, Button } from "react-native";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { IP_ADDRESS } from "@env";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
//import SleepEnergyChart from "../../components/EnergyChart";

const ResidentProfile = () => {
  const { newUser, token } = userObject || {};
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();

  // States
  const [checkinResponses, setCheckinresponses] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [checkinReview, setCheckinReview] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [resident, setResident] = useState([]);
  const [selectedMood, setSelectedmood] = useState("");
  const [attendance, setAttendance] = useState("Yes");
  const [reason, setReason] = useState("");
  const [memeory, setMemory] = useState("");
  const [sleepPatten, setSleepPattern] = useState([]);
  const [enegyLevels, setEnergyLevels] = useState([]);
  const [physical, setPhysical] = useState(false);
  const [social, setSocial] = useState(false);
  const [pain, setPain] = useState("");
  const [painLevel, setPainlevel] = useState("");
  const [interaction, setInteraction] = useState("");
  const [activityRate, setActivityRate] = useState("");



  // Get check-in responses
  const getCheckinResponses = async () => {
    try {
      const reviewResponse = await axios.get(
        `http://${IP_ADDRESS}:3000/checkinreview/${id}`
      );

      if (reviewResponse.data.review) {
        if (reviewResponse.data.review.length !== 0) {
          setCheckinReview(reviewResponse.data.review);
        }
      }

      const response = await axios.get(
        `http://${IP_ADDRESS}:3000/checkinbyId/${id}`
      );
      console.log("checkin responses : " + response.data.checkin)
      if (response.data) {
        setCheckinresponses(response.data.checkin);
        formatResponses(response.data.checkin);
      } else {
        console.error(response.data, "no checkin found");
      }
    } catch (error) {
      console.error("error occurred when fetching checkin", error);
    } finally {
      setLoading(false);
    }
  };
  const formatResponses = (checkinResponses) => {
    // id = 1 how id you sleep will fetch sleep pattens , id = 3 how are your energy levels will fetch energy levels fro the past 7 days 
    // id = 5 do you feel heard by stuff will be handled on admin side 
    switch (checkinResponses.id) {
      case 2:
        //question = how did yesterdays activities make you feel 
        if (checkinResponses.selected_option === "good") {
          setActivityRate("Enjoyed yesterdays activities.")
        } else if (checkinResponses.selected_option === "morbid") {
          setActivityRate("Participated in yesterdays activities but did not enjoy.")
        } else if (checkinResponses.selected_option === "bad") {
          setActivityRate("Attended yesterdays activities and dreaded the experience.")
        }
        break;
      case 4:
        // question = did you have any interesting interactions
        if (checkinResponses.selected_option === "yes") {
          setInteraction("Had interactions during activities")
        } else if (checkinResponses.selected_option === "no") {
          setInteraction("Did not interact with others")
        }
        break;
      case 6:
        //question = click on the green circle
        if (checkinResponses.selected_option === "green") {
          setMemory("Has great memory recollection")
        } else if (checkinResponses.selected_option === "yellow") {
          setMemory("Memory recollection is good but should monitor")
        } else if (checkinResponses.selected_option === "blue") {
          setMemory("Memory recollection is bad, monitor closely")
        } else if (checkinResponses.selected_option === "red") {
          setMemory("No memory recollection, book consultation with doctor ")
        }
        break;
      case 7:
        // question = have you experienced any pain or discomfort
        if (checkinResponses.selected_option === "yes") {
          setPhysical(true);
        } else if (checkinResponses.selected_option === "no") {
          setPhysical(false);
        }
        break;
      case 8:
        // question = where do you feel the most pain 
        setPain(checkinResponses.selected_option + " pain");
        break;
      case 9:
        // question = how bad is the pain
        if (checkinResponses.selected_option === "good") {
          setPainlevel("Acute pain")
        } else if (checkinResponses.selected_option === "morbid") {
          setPainlevel("Chronic pain,resident should be monitored closely")
        } else if (checkinResponses.selected_option === "bad") {
          setPainlevel("Severe pain, resident should be checked and book consultation with doctor")
          // set social to false and the reason is 'could not attend due to physical pain'
          if (attendance === "Yes") {
            setSocial(false);
            setReason("Could not attend activities due to physical health")
          }
        }
        break;

      default:
        null
        break;
    }
  }
  // Get resident information
  const getResidentInfo = async () => {
    try {
      const response = await axios.get(
        `http://${IP_ADDRESS}:3000/residentInfo/${id}`
      );
      console.log("this is resident info: " + response.data.resident + "the id is : " + id)
      if (response.data) {
        setResident(response.data.resident);
        console.log("this is set resident info: " + resident);
      } else {
        console.error(response.data, "no resident found");
      }
      //get resident attandence
      //getAttendance(); remember to add api end point 
      // set view 
      if (attendance === "Yes") {
        setSocial(true);
      } else if (attendance === "No") {
        setSocial(false);
        setReason("Did not attend any activities")
      }
    } catch (error) {
      console.error("error occurred when fetching resident", error);
    } finally {
      setLoading(false);
    }
  };
  //get resident attendance to activities 
  const getAttendance = async () => {
    try {
      const attendanceResponse = await axios.get(`http://${IP_ADDRESS}:3000/residentAttendance/${resident.id}`);// remember to create api endpoint 
      console.log("the attendance:" + attendanceResponse.data)
      if (attendanceResponse.data.attendance.length > 0) {
        setAttendance("Yes");
      } else {
        setAttendance("No");
      }
    } catch (error) {
      console.error("Error", "error occured fetching resident attendance")
    }
  }

  //get resident sleep pattern
  const getSleepPattern = async (id) => {
    try {
      const response = await axios.get(`http://${IP_ADDRESS}:3000/sleepPattern/${id}`);
      console.log("sleep patten :" + response.data.scores)
      if (response.data) {
        setSleepPattern(response.data.scores);
      } else {
        setSleepPattern([]);
      }
    } catch (error) {
      console.error("Error", "error occured fetching resident sleep pattern")
    }
  }

  //get resident energy pattern
  const getEnegyLevels = async (id) => {
    try {
      const response = await axios.get(`http://${IP_ADDRESS}:3000/energyLevels/${id}`);
      console.log("energy patten :" + response.data.scores)
      if (response.data) {
        setEnergyLevels(response.data.scores);
      } else {
        setEnergyLevels([]);
      }
    } catch (error) {
      console.error("Error", "error occured fetching resident energy pattern")
    }
  }

  // To return responses
  useEffect(() => {
    getCheckinResponses();
    getResidentInfo();
  }, []);

  useEffect(() => {

    getEnegyLevels(resident.id);
    getSleepPattern(resident.id);

  }, []);

  // Submit a review for check-in
  const submitReview = async () => {
    try {
      await axios.post(`http://${IP_ADDRESS}:3000/reviewcheckin`, {
        checkin_id: id,
        review: reviewText,
      });

      setTimeout(() => {
        Toast.show({
          type: "success",
          text1: "Review submitted",
          text2: "Done!",
        });
        router.back();
      }, 1000);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // back to previous page 
  const handleBackButton = () => {
    navigation.goBack();
  };

  // To filter responses by mood
  const searchFilter = (item) => {
    const query = selectedMood;
    const isMatch = item.mood_type.includes(query);
    return isMatch;
  };

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${day}-${month}-${year}`;
  }

  // Filtered check-ins
  const Checkins = selectedMood
    ? checkinResponses.filter(searchFilter)
    : checkinResponses;

  const renderResponseItem = ({ item }) => (
    <View className="p-4 bg-[#fafbfb] border border-gray-300 mb-1 rounded-md">
      <View className="bg-[#fafbfb]">
        <Text className="font-bold text-center text-xl text-[#0b4dad]">{item.mood_type}</Text>
      </View>
      <View>
        <Text className="font-bold text-lg">Question: {item.question}</Text>
      </View>
      <View className="bg-white w-full">
        <Text className="text-lg">Response: {item.selected_option}</Text>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  } else if (newUser.userType === "Caregiver") {
    return (
      // Renders view for caregiver
      <SafeAreaView className="flex-1 bg-[#fafbfb]">
        <View className="flex-row items-center justify-center pt-6 mb-6 px-4">
          <TouchableOpacity
            onPress={handleBackButton}
            className="absolute left-10 top-10"
          >
            <FontAwesome name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-3xl font-bold py-2 px-4 rounded-xl shadow-md">
            Carewise
          </Text>
        </View>

        <View className="flex-row items-center">
          <Text className="text-[18px] font-pbold mb-[5px]">
            {resident.first_name}'s Wellbeing
          </Text>
        </View>
        <View className="flex-1 p-5">

          {social ? (
            <View>
              <View className="p-4 bg-gray-200 border border-gray-300 mt-1 mb-1 rounded-md">
                <Text className="font-bold text-center mb-2 mt-2">{interaction}</Text>
              </View>
              <View className="p-4 bg-gray-200 border border-gray-300 mt-2 mb-2 rounded-md">
                <Text className="font-bold text-center mb-2 mt-2">{activityRate}</Text>
              </View>
            </View>
          ) : (
            <>
              <View className="p-4 bg-gray-200 border border-gray-300 mt-2 mb-1 rounded-md">
                <Text className="font-bold text-center mb-2 mt-2">{reason}</Text>
              </View>
            </>
          )}

          {physical ? (
            <View>
              <View className="p-4 bg-gray-200 border border-gray-300 mt-2 mb-1 rounded-md">
                <Text className="font-bold text-center mb-2 mt-2">{pain}</Text>
              </View>
              <View className="p-4 bg-gray-200 border border-gray-300 mt-2 mb-1 rounded-md">
                <Text className="font-bold text-center mb-2 mt-2">{painLevel}</Text>
              </View>
            </View>
          ) : (
            <>
              <View className="p-4 bg-gray-200 border border-gray-300 mt-2 mb-1 rounded-md">
                <Text className="font-bold text-center mb-2 mt-2">Pain free</Text>
              </View>
            </>
          )}
          <View className="p-4 bg-gray-200 border border-gray-300 mt-2 mb-1 rounded-md">
            <Text className="font-bold text-center mb-2 mt-2">{memeory}</Text>
          </View>
          {checkinReview ? (
            <View className="p-4 bg-primary border border-gray-300 mb-1 rounded-md">
              <Text className="font-bold text-center mb-2">
                Check-in Notes
              </Text>
              <Text className="text-gray-700">
                Notes: {checkinReview.review}
              </Text>
              <Text className="text-gray-500 text-sm mt-2">
                Note Date: {formatDate(new Date(checkinReview.datecreated))}
              </Text>
            </View>
          ) : (
            <>
              <TextInput
                className="h-10 border-2 rounded-md border-primary mb-2 px-2.5"
                value={reviewText}
                onChangeText={setReviewText}
                placeholder="Enter Notes "
              />
              <Button
                title="Submit Note"
                className="h-10 border-2 rounded-md border-primary mb-2 px-2.5"
                onPress={submitReview}
              />
            </>
          )}

        </View>
      </SafeAreaView>
    );
  } else if (newUser.userType === "Family_Member") {
    // Renders view for family member
    return (
      <SafeAreaView className="flex-1 justify-center items-center pt-5">
        <View className="flex-row items-center justify-center pt-6 mb-6 px-4">
          <TouchableOpacity
            onPress={handleBackButton}
            className="absolute left-10 top-10"
          >
            <FontAwesome name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-3xl font-bold bg-white py-2 px-4 rounded-xl shadow-md">
            Carewise
          </Text>
        </View>
        <View></View>
        <View className="flex-1 p-4">
          <FlatList
            data={checkinResponses}
            keyExtractor={(item) => item.id}
            renderItem={renderResponseItem}
            className="mb-4"
          />
        </View>
      </SafeAreaView>
    );
  }
};

export default ResidentProfile;