import React, { useState, useEffect } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { IP_ADDRESS } from "@env";
import {
  Text,
  TouchableOpacity,
  FlatList,
  View,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { userObject } from "./(auth)/Sign-in";
import { router } from "expo-router";
import { useRoute, useNavigation } from "@react-navigation/native";

const viewCheckin = () => {
  const { newUser, token } = userObject || {};
  const [checkin, setCheckin] = useState([]);
  const [resident, setResident] = useState(null);
  const [residentCheckins, setResidentCheckins] = useState([]);
  const [checkinmoods, setCheckinmoods] = useState([]);
  const [checkinreview, setCheckinreview] = useState(null);
  const [isLoading, setLoading] = useState(true);


  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params || {};

  //reviewd resident checkins
  const getResidentCheckins = async () => {
    try {
      const residentResponse = await axios.get(
        `http://${IP_ADDRESS}:3000/familyResident/${newUser.id}`
      );

      if (residentResponse.data.resident)
        setResident(residentResponse.data.resident);

      let id = residentResponse.data.resident.id;
      console.log("This is the id:", id);

      const checkinResponse = await axios.get(
        `http://${IP_ADDRESS}:3000/checkinbyresident/${id}`
      );

      if (checkinResponse.data.checkins) {
        console.log("checkinResponse:", checkinResponse.data.checkins);
        setResidentCheckins(checkinResponse.data.checkins);
        if (checkinResponse.data.checkins.length > 0) {
          for (let index = 0; index < checkinResponse.data.checkins.length; index++) {
            getCheckinmoods(checkinResponse.data.checkins[index].checkin_id);
          }
        }

      }

      console.log("Done inputting checkins");
      console.log("Resident checkins: ", residentCheckins);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch checkin");
      console.error("error occured when fetching checkins", error);
    } finally {
      setLoading(false);
    }
  };
  //resident checkins awaiting review
  const getCaregiverCheckins = async () => {

    try {
      console.log(newUser.id);
      console.log("this is the resident id: " + id);
      const response = await axios.get(
        `http://${IP_ADDRESS}:3000/ResidentDailyCheckin/${id}`
      );

      console.log(
        "This is the checkin made by this user ",
        response.data
      );

      // if (response.data) {
      setCheckin(response.data.newCheckin[0]);
      console.log("Set checkin: ", response.data.newCheckin[0]);
      //   } else {
      //console.log(checkins, "no checkins found");
      // }
    } catch (error) {
      console.error("error occured when fetching checkins", error);
    } finally {
      setLoading(false);
    }
  };
  //moods
  const getCheckinmoods = async (checkin_id) => {

    try {
      const Moodresponse = await axios.get(`http://${IP_ADDRESS}:3000/checkinmoods/${checkin_id}`);
      console.log("moods: " + Moodresponse.data.scores)
      if (Moodresponse.data) {
        setCheckinmoods(Moodresponse.data.scores);
      } else {
        setCheckinmoods([]);
      }
    } catch (error) {
      console.error("error occured fetching mood scores")
    }
  }
  // format date 
  function formatDate(isoDateString) {
    const originalTime = new Date(isoDateString);
    const day = originalTime.getDate();
    const month = originalTime.getMonth() + 1;
    const year = originalTime.getFullYear();
    const formattedTime = `${day}-${month}-${year}`;
    return formattedTime;
  }
  //when resident is clicked // change it to route to
  const handlePress = (item) => {
    router.push(`checkinProfile/${item.checkin_id}`);
  };
  // change is it causes errors
  useEffect(() => {
    if (newUser?.userType === "Caregiver") {
      getCaregiverCheckins();
    }
  }, [newUser?.userType]);

  useEffect(() => {
    if (newUser?.userType === "Caregiver" && checkin) {
      getCheckinmoods(checkin.checkin_id);
    }
  }, [checkin])


  useEffect(() => {
    if (newUser?.userType === "Family_Member") {
      getResidentCheckins();
    }
  }, [newUser?.userType]);


  // back to previous page 
  const handleBackButton = () => {
    navigation.goBack();
  };

  //set checkin mood scores 
  const renderMoods = (checkinmoods) => {

    const setColour = (score) => {
      if (score < 4) {
        return "bg-red-400"
      } else if (score >= 4 && score < 7) {
        return "bg-orange-400"
      } else if (score > 7) {
        return "bg-green-400"
      }
    };
    const setText = (score) => {

      if (score < 4) {
        return 'UNHEALTHY';
      } else if (score >= 4 && score < 7) {
        return 'MODERATE'
      } else if (score > 7) {
        return 'HEALTHY';
      }
    }

    return (
      <View className="p-4">
        {checkinmoods.map(({ id, mood_type, totalscore }) => (
          <View
            key={id}
            className={`flex justify-between items-center p-4 mb-6 text-black rounded-md  w-72 ${setColour(totalscore)}`}
          >
            <Text className="font-semibold uppercase">{mood_type}</Text>
            <Text className="font-semibold">{setText(totalscore)}</Text>
          </View>
        ))}
      </View>
    )
  }

  // useEffect(() => {

  // }, []);
  // renders reviewed checkin for family member // need to change to profile
  const renderResidentItem = ({ item }) => {
    // getCheckinmoods(item.checkin_id)
    setCheckinreview(item.review);
    return (
      <View>
        <TouchableOpacity
          className="my-[10px] mx-[20px] bg-[#F0F0F0] p-[10px] border-gray-100 shadow-gray-400 border-b-8 shadow-md "
          onPress={() => handlePress(item)}
        >
          <View className="flex-row items-center   ">
            <View>
              {renderMoods(checkinmoods)}
              {checkinreview ? (

                <Text className="text-[18px] font-pbold mb-[5px]">
                  Note: {item.review}
                </Text>
              ) : (
                <Text className="text-[18px] font-pbold mb-[5px]">
                  Note: Notes not submitted.
                </Text>
              )}
              <Text className="text-[16px] text-[#888]">
                "Date:"{formatDate(item.date)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

      </View>
    );
  };


  if (isLoading)
    return (
      <View className="flex-row items-center text-[#0b4dad]">
        <Text>loading...</Text>
      </View>
    );

  // screen to render if caregiver is logged in
  if (newUser.userType === "Caregiver" && isLoading === false) {
    return (

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
        {checkin ? (
          <>
            <View className="flex-row items-center justify-center mb-3">
              <Image
                source={{ uri: checkin.image_url }}
                className="w-[60px] h-[60px] rounded-[40px] mr-[10px]"
              />
              <View >
                <Text className="text-[18px] font-pbold mb-[5px]">
                  {checkin.first_name} {checkin.last_name}
                </Text>
              </View>
            </View>
            <View></View>
            <TouchableOpacity
              className="my-[10px] mx-[20px] bg-[#F0F0F0] p-[10px] border-slate-200 shadow-gray-400 border-b-8 shadow-md "
              onPress={() => handlePress(checkin)}
            >
              <Text className="text-lg text-[#888] text-center">
                Date:{formatDate(checkin.date)}
              </Text>
              <View className="flex-row items-center">
                {renderMoods(checkinmoods)}
                <View>
                </View>
              </View>

            </TouchableOpacity>
          </>
        ) : (
          <View>
            <Text className="text-black text-xl font-bold mt-2">
              Resident wellbeing report not available
            </Text>
          </View>
        )}
      </SafeAreaView>
    );
  }

  if (newUser.userType === "Family_Member" && isLoading === false) {

    return (
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
        <View></View>

        <View className="flex-1 justify-center items-center bg-[#fafbfb] pt-5">
          {resident ? (
            <View>
              <Text className="text-black-300 text-xl font-bold mt-2 text-center">
                {resident.first_name} {resident.last_name}'s Wellbeing monitor
              </Text>

              <FlatList
                data={residentCheckins}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderResidentItem}
                contentContainerStyle={{ paddingVertical: 10 }}
              />
            </View>
          ) : (
            <View>
              <Text className="text-white text-xl font-bold mt-2">
                Resident wellbeing report not available
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }
};
export default viewCheckin;