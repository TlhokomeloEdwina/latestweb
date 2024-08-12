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

      if (response.data) {
        setCheckinresponses(response.data.checkin);
      } else {
        console.error(response.data, "no checkin found");
      }
    } catch (error) {
      console.error("error occurred when fetching checkin", error);
    } finally {
      setLoading(false);
    }
  };

  // Get resident information
  const getResidentInfo = async () => {
    try {
      const response = await axios.get(
        `http://${IP_ADDRESS}:3000/residentInfo/${id}`
      );
      console.log("this is resident info: " + response + "the id is : " + id)
      if (response.data) {
        setResident(response.data.resident);
        console.log("this is set resident info: " + resident);
      } else {
        console.error(response.data, "no resident found");
      }
    } catch (error) {
      console.error("error occurred when fetching resident", error);
    } finally {
      setLoading(false);
    }
  };

  // To return responses
  useEffect(() => {
    getCheckinResponses();
  }, []);

  useEffect(() => {
    getResidentInfo();
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
  } else if (newUser.userType === "Caregiver" && !isLoading) {
    return (
      // Renders view for caregiver
      <SafeAreaView className="flex-1">
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
        <View></View>
        <View className="flex-1 p-4 text-xl">
          <Picker
            selectedValue={selectedMood}
            onValueChange={(itemValue, itemIndex) => setSelectedmood(itemValue)}
          >
            <Picker.Item label="Select state" value="" style={{
              fontSize: 18,
              fontWeight: 'bold',
            }} />
            <Picker.Item label="SOCIAL" value="social" />
            <Picker.Item label="PHYSICAL" value="physical" />
            <Picker.Item label="MENTAL" value="mental" />
          </Picker>
          <FlatList
            data={Checkins}
            keyExtractor={(item) => item.id}
            renderItem={renderResponseItem}
            className="mb-4 text-lg"
          />
          {checkinReview ? (
            <View className="p-4 bg-[#0b4dad] border border-gray-300 mb-1 rounded-xl">
              <Text className="font-bold text-center text-xl mb-2 text-[#fafbfb]">
                Check-in Notes
              </Text>
              <Text className="text-[#fafbfb] text-lg">
                Notes: {checkinReview.review}
              </Text>
              <Text className="text-[#fafbfb] text-base mt-2">
                Note Date: {formatDate(new Date(checkinReview.datecreated))}
              </Text>
            </View>
          ) : (
            <>
              <TextInput
                className="h-10 border-2 rounded-md border-primary mb-2 px-2.5"
                value={reviewText}
                onChangeText={setReviewText}
                placeholder="Add checkin notes"
              />
              <Button
                title="Add Notes"
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