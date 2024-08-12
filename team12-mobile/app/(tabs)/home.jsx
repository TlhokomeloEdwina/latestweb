import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Vibration,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { router, useNavigation } from "expo-router";
import axios from "axios";
import CircleButton from "../../components/CircleButton";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { IP_ADDRESS } from "@env";
import * as Notifications from "expo-notifications";
import { userObject } from "../(auth)/Sign-in";
import { images } from "../../constants/images";
import { icons } from "../../constants/icons";
import Toast from "react-native-toast-message";
import ResidentCard from "../../components/ResidentCard";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import call from "react-native-phone-call";
import {
  setNotificationHandler,
  scheduleNotificationAsync,
} from "expo-notifications";
import Activity from "../../components/Activity";
import { Audio } from "expo-av";

function useNotificationObserver() {
  useEffect(() => {
    let isMounted = true;

    async function handleInitialNotification() {
      const response = await Notifications.getLastNotificationResponseAsync();
      if (isMounted && response?.notification) {
        const url = response.notification.request.content.data?.url;
        if (url) {
          router.push(url);
        }
      }
    }

    handleInitialNotification();

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const url = response.notification.request.content.data?.url;
        if (url) {
          router.push(url);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);
}

const Home = () => {
  const navigation = useNavigation();
  const [dropDownScreen, setDropDownScreen] = useState(false);
  const [cottageData, setCottageData] = useState(null);
  const [peopleData, setPeopleData] = useState([]);
  const [residentData, setResidentData] = useState(null);
  const [resident_id_number, setResident_id_number] = useState("");
  const [showAddResidentForm, setShowAddResidentForm] = useState(false);
  const [Caregiver_id, setCaregiver_id] = useState(null);
  const [activity, setActivity] = useState([]);
  const [callArgs, setCallArgs] = useState({
    number: "0638755634", // String value with the number to call
    prompt: false,
    skipCanOpen: true, // Skip the canOpenURL check
  });
  const [sound, setSound] = useState();

  const { newUser, token } = userObject || {};

  useEffect(() => {
    const fetchCottageData = async () => {
      try {
        const response = await axios.get(
          `http://${IP_ADDRESS}:3000/cottage/${newUser.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.cottage.length > 0) {
          setCottageData(response.data.cottage[0]);
          console.log(cottageData);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (newUser?.userType === "Caregiver") {
      fetchCottageData();
    }
  }, [newUser, token]);

  const fetchPeopleData = async (cottageId) => {
    try {
      const response = await axios.get(
        `http://${IP_ADDRESS}:3000/cottagePeople/${cottageId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPeopleData(response.data.cottage);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchResidentData = async () => {
    try {
      const response = await axios.get(
        `http://${IP_ADDRESS}:3000/familyResident/${newUser.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("This is the resident data: ", response.data.resident);

      if (response.data.resident) {
        setResidentData(response.data.resident);
      } else {
        setResidentData(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCaregiverInformation = async () => {
    try {
      const response = await axios.get(
        `http://${IP_ADDRESS}:3000/caregiverInfo/${newUser.id}`
      );

      if (response.data.caregiver.caregiver_id) {
        setCaregiver_id(response.data.caregiver.caregiver_id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addResident = async () => {
    try {
      const response = await axios.post(
        `http://${IP_ADDRESS}:3000/addFamilyResident`,
        {
          id_number: resident_id_number,
          id: newUser.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setShowAddResidentForm(false);
        fetchResidentData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  //

  const handlePhoneCall = () => {
    call(callArgs).catch(console.error);
  };

  useEffect(() => {
    if (newUser?.userType === "Family_Member") {
      fetchResidentData();
    }
  }, [newUser, token]);

  useEffect(() => {
    if (newUser?.userType === "Resident") {
      fetchCaregiverInformation();
    }
  }, []);

  const sendAlert = async (alert_Type) => {
    const response = await axios.post(`http://${IP_ADDRESS}:3000/alert`, {
      alert_type: alert_Type,
      resident_id: newUser.id,
      caregiver_id: Caregiver_id,
    });

    Toast.show({
      type: "success",
      text1: response.data.message,
      text2: "The caregiver will attend you shortly!",
    });

    playSound();
  };

  //scheduling helper functions
  useEffect(() => {
    setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  });

  //Get activities for the day
  const getActivity = async () => {
    const response = await axios.get(
      `http://${IP_ADDRESS}:3000/dayActivity/${new Date().getDay() + 1}`
    );
    console.log(response.data);
    setActivity(response.data);
  };

  useEffect(() => {
    getActivity();
  }, []);

  useEffect(() => {
    if (newUser?.userType !== "Family_Member") {
      if (activity.length > 0) {
        activity.forEach((act) => {
          const [hours, minutes, seconds] = act.time.split(":").map(Number);

          const adjustedHours = hours;
          const adjustedMinutes = minutes;
          const adjustedSeconds = seconds;

          const adjustedTime = new Date();
          adjustedTime.setHours(
            adjustedHours,
            adjustedMinutes,
            adjustedSeconds
          );

          // Schedule the reminder using adjustedTime
          scheduleNotificationAsync({
            content: {
              title: act.name,
              body: act.description,
            },
            trigger: {
              date: adjustedTime,
              repeats: false,
            },
          });

          console.log(`Reminder scheduled for ${adjustedTime}`);
        });
      }
    }
  }, [activity]);

  //scheduling helper functions
  useEffect(() => {
    setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
  });

  //Send reminder helper function
  const sendReminder = async (time, name, description) => {
    try {
      const [hours, minutes, seconds] = time.split(":").map(Number);

      const trigger = new Date();
      trigger.setHours(hours);
      trigger.setMinutes(minutes);
      trigger.setSeconds(seconds);

      await scheduleNotificationAsync({
        content: {
          title: name,
          body: description,
        },
        trigger: {
          date: trigger,
          repeats: false,
        },
      });

      console.log(`Reminder scheduled for ${trigger}`);
    } catch (error) {
      console.error("Error scheduling reminder:", error);
    }
  };

  //Get activities for the day
  const getCurrentActiviy = async () => {
    const response = await axios.get(
      `http://${IP_ADDRESS}:3000/dayActivity/${new Date().getDay() + 1}`
    );
    console.log("This is the response: ", response.data);
    setActivity(response.data);
  };

  useEffect(() => {
    if (newUser?.userType === "Caregiver") {
      getCurrentActiviy();
    }
  }, []);

  const getInitials = (name) => {
    const names = name.split(" ");
    const initials = names.map((n) => n[0]).join("");
    return initials.toUpperCase();
  };

  //play sound
  async function playSound() {
    console.log("Loading sound");
    const { sound } = await Audio.Sound.createAsync(require("../../sound.mp3"));
    setSound(sound);

    console.log("Playing Sound");
    await sound.playAsync();
  }

  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  // Handle redirect from the notification
  useNotificationObserver();

  if (!newUser) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-[#f8fafc] pt-5">
        <Text className="text-white text-xl font-bold mt-2">Loading...</Text>
      </SafeAreaView>
    );
  }

  //Resident homepage
  if (newUser.userType === "Resident") {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-[#f8fafc] pt-5">
        <View className="bg-[#f8fafc] rounded-lg m-[9px]">
          <View className="items-center mt-4 flex-row justify-center">
            <Image
              source={images.image3}
              className="w-[100px] h-[100px] rounded-full"
            />
            <Text className="text-black text-3xl font-pregular mt-2  p-[10px] rounded-lg mx-[20px] px-[20px]">
              CAREWISE
            </Text>
          </View>

          <View className="flex-row flex-wrap mb-5 gap-2 justify-evenly items-center  rounded-md m-[10px] my-[30px]">
            <CircleButton
              //please check this 28/07/2024
              iconName="bell"
              onPress={async () => {
                navigation.navigate("BasicAlerts", { resident: userObject });
                Vibration.vibrate();
              }}
              background="bg-blue-600 border-blue-400 shadow-gray-400 border-b-8 shadow-md"
              title="Basic Alert"
            />
            <CircleButton
              iconName="book"
              onPress={() => {
                router.replace("/booking");
              }}
              background="bg-yellow-500 border-yellow-400 shadow-gray-400 border-b-8 shadow-md "
              title="Passout"
            />

            <CircleButton
              iconName="ambulance"
              onPress={async () => {
                await sendAlert("Emergency");
              }}
              background="bg-red-600 border-red-400 shadow-gray-400 border-b-8 shadow-md w-[332px]"
              title="Emergency"
            />

            {/* <CircleButton
              iconName="phone"
              onPress={() => handlePhoneCall()}
              color="white"
              background="bg-yellow-500 border-yellow-400 shadow-gray-400 border-b-8 shadow-md"
              title="Call"
            />*/}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  //Family_member home page
  if (newUser.userType === "Family_Member") {
    return (
      <SafeAreaView className="flex-1  items-center bg-[#fafbfb] pt-5">
        <Text className="text-3xl font-bold py-2 px-4 rounded-xl shadow-md flex">
          Carewise
        </Text>
        <View className="mt-12 items-center justify-center w-full ">
          {residentData ? (
            <>
              <View className="bg-[#f5f5f5] p-20 items-center rounded-lg shadow-md border border-slate-200  shadow-gray-400 border-b-8 ">
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("ResidentDetails", {
                      residentData: residentData,
                    });
                  }}
                >
                  {residentData.image_url ? (
                    <Image
                      source={{ uri: residentData.image_url }}
                      className="w-[180px] h-[180px] rounded-full border-4 border-blue-500 shadow-md"
                    />
                  ) : (
                    <View className="w-[180px] h-[180px] rounded-full bg-gray-200 justify-center items-center border-4 border-blue-500 shadow-md">
                      <Text className="text-3xl font-bold">
                        {getInitials(
                          `${residentData.first_name} ${residentData.last_name}`
                        )}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
                <Text className="text-2xl font-bold mt-4">
                  {residentData.first_name} {residentData.last_name}
                </Text>
                <Text className="text-[#0b4dad] mt-1 text-xl font-bold">
                  {residentData.contact_number}
                </Text>
                <Text className="text-[#0b4dad] mt-1 text-base font-semibold">
                  {residentData.email}
                </Text>
              </View>
            </>
          ) : (
            <>
              <Text className="text-black text-3xl font-bold mb-4">
                No Resident Linked
              </Text>
              <TouchableOpacity
                onPress={() => setShowAddResidentForm(true)}
                className="flex-row justify-center items-center bg-green-500 rounded-lg p-4 hover:bg-green-600 transition duration-300  w-64 h-24 border border-green-400 shadow-gray-400 border-b-8 shadow-md 
                "
              >
                <FontAwesomeIcon icon={faUserPlus} className="mr-4" />
                <Text className="text-white text-center">Add Resident</Text>
              </TouchableOpacity>
            </>
          )}

          {showAddResidentForm && (
            <View className="rounded-lg shadow-md p-4 mt-4 mb-4 w-full bg-white border border-gray-300">
              <FormField
                title="Resident Id Number"
                value={resident_id_number}
                handleChangeText={(e) => setResident_id_number(e)}
                otherStyles="mt-7 mb-4"
                keyBoardType="default"
                placeholder="Enter your family member's Id number"
              />
              <CustomButton
                title="Add Resident"
                handlePress={addResident}
                containerStyles="mb-4"
              />
              <CustomButton
                title="Cancel"
                handlePress={() => setShowAddResidentForm(false)}
                containerStyles="mb-4"
              />
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }

  //Caregiver home page
  if (newUser.userType === "Caregiver") {
    return (
      <SafeAreaView className="flex-1 bg-[#fafbfb]">
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <View className="items-center mt-4">
            <Image source={images.image3} className="w-24 h-24 rounded-full" />
            <Text className="text-black text-3xl font-bold mt-2">CAREWISE</Text>
          </View>

          {!dropDownScreen && (
            <View className="mt-6 mx-4 p-4 bg-[#0b4dad] rounded-lg shadow-md ">
              <TouchableOpacity
                className="flex-row justify-between items-center text-white"
                onPress={() => {
                  setDropDownScreen(true);
                  fetchPeopleData(cottageData?.id);
                }}
              >
                <Text className="text-xl text-white font-bold">
                  Cottage Name: {cottageData?.name || ""}
                </Text>
                <Image source={icons.drop_down} className="w-4 h-4" />
              </TouchableOpacity>

              {activity && activity.length > 0 ? (
                <View className="mt-4">
                  <Text className="text-lg font-medium mb-2 text-center text-[#bfcddb]">
                    Today's Activity
                  </Text>
                  <View className="bg-[#f5f5f4] p-4 rounded-lg shadow-custom-md mb-4">
                    <View className="w-11/12 flex-row justify-between mb-2 p-2">
                      <Text className="text-lg">Activity</Text>
                      <Text className="text-lg">Time</Text>
                    </View>
                    {activity.map((act) => (
                      <Activity key={act.id} activity={act} />
                    ))}
                  </View>
                </View>
              ) : (
                <Text className="flex font-bold text-lg justify-center items-center text-center text-[#bfcddb] p-4 w-11/12">
                  No activities for today
                </Text>
              )}
            </View>
          )}

          {dropDownScreen && (
            <View className="mt-6 mx-4 p-4 bg-white rounded-lg shadow-md">
              <TouchableOpacity
                className="flex-row justify-between items-center"
                onPress={() => setDropDownScreen(false)}
              >
                <Text className="text-xl font-semibold">
                  Assigned to Cottage: {cottageData?.name || ""}
                </Text>
                <Image source={icons.drop_up} className="w-4 h-4" />
              </TouchableOpacity>

              <ScrollView className="mt-4">
                {peopleData.length > 0 ? (
                  peopleData.map((resident) => (
                    <ResidentCard
                      key={resident.id}
                      resident={resident}
                      onPress={() =>
                        navigation.navigate("ResidentDetails", {
                          residentData: resident,
                        })
                      }
                    />
                  ))
                ) : (
                  <Text className="text-[#0b4dad]">Loading residents...</Text>
                )}
              </ScrollView>
              <CustomButton
                title={"Checkin List"}
                containerStyles="mt-2"
                handlePress={() =>
                  navigation.navigate("checkinList", { newUser })
                }
              />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return null;
};

export default Home;
