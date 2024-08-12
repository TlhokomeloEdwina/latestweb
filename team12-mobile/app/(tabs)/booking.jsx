import { View, Text, Button, ScrollView, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { userObject } from "../(auth)/Sign-in";
import CustomButton from "../../components/CustomButton";
import axios from "axios";
import { IP_ADDRESS } from "@env";
import AttModal from "../../components/AttModal";
import ActList from "../../components/ActList";
import Resident from "../../components/Resident";

const booking = () => {
  const navigation = useNavigation();

  //states
  const [activity, setActivity] = useState([]);
  const [currentAct, setCurrent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [registered, setRegistered] = useState([]);
  const [attended, setAttended] = useState([]);
  const [cottageData, setCottageData] = useState(null);
  const [peopleData, setPeopleData] = useState([]);

  const { newUser, token } = userObject || {};

  //day
  const id = new Date().getDay() + 1;
  console.log("This is an id: ", id);
  const Day = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const handleMyPassouts = () => {
    navigation.navigate("MyPassouts");
  };

  const handleRequestPassout = () => {
    navigation.navigate("PassoutRequest");
  };

  const handleActivityPage = (event_id) => {
    navigation.navigate("Activity", { id: event_id });
  };

  const today = new Date();
  const date = `${today.getFullYear()}-${today.getMonth() + 1
    }-${today.getDate()}`;
  const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;

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
      setCottageData(response.data.cottage[0]);
    } catch (error) {
      console.error(error);
    }
  };

  //Get activities
  const getData = async () => {
    try {
      const response = await axios.get(
        `http://${IP_ADDRESS}:3000/dayActivity/${id}`
      );

      console.log("Error here: ", response.data);
      setActivity(response.data);
    } catch (error) {
      console.error(error);
    }
  };

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

  const submitAttendance = async () => {
    const actAttendance =
      attended.length > 0
        ? attended.find((item) => item.actId === currentAct)
        : {};
    console.log("Attendance: ", actAttendance);
    try {
      const response = await axios.post(
        `http://${IP_ADDRESS}:3000/attendance`,
        {
          actAttendance,
        }
      );

      console.log("FInished submitting");

      setRegistered([...registered, currentAct]);
      setShowModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  //Updating attendend when activity changes
  useEffect(() => {
    if (activity.length > 0) {
      const newAttended = activity.map((act) => ({
        actId: act.id,
        careId: newUser.id,
        date: date,
        time: time,
        resident: [],
      }));
      setAttended(newAttended);
    }
  }, [activity]);

  //Getting activities
  useEffect(() => {
    if (newUser?.userType === "Caregiver") {
      getData();
      fetchCottageData();
    }
  }, []);

  useEffect(() => {
    if (cottageData !== null) {
      fetchPeopleData(cottageData.id);
    }
  }, [cottageData]);

  if (newUser.userType === "Resident") {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-[#f8fafc] w-full ">
        <Text className="text-black text-3xl mb-4 font-pregular">My Passouts</Text>
        <View className="space-y-4 w-3/4 px-4">
          <CustomButton
            title="View Passouts"
            handlePress={handleMyPassouts}
            containerStyles="mb-4 rounded-[30px] items-center justify-center w-64 h-48 border bg-[#f97316] border-orange-400 shadow-gray-400 border-b-8 shadow-md mx-5 my-5 ml-[10px] opacity-[0.9] text-xl "
          />

          <CustomButton
            title="Request Passout"
            handlePress={handleRequestPassout}
            containerStyles="mb-4 rounded-[30px] items-center justify-center w-64 h-48 border bg-[#a21caf] border-[#c026d3] shadow-gray-400 border-b-8 shadow-md mx-2 my-5 ml-[10px] opacity-[0.9]"
          />
        </View>
      </SafeAreaView>
    );
  }

  if (newUser.userType === "Family_Member") {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white w-full">
        <Text className="text-black text-3xl mb-4 font-pregular">My Bookings</Text>
        <View className="space-y-4 w-3/4">
          <CustomButton
            title="View Bookings"
            handlePress={handleMyPassouts}
            containerStyles="mb-4 rounded-[30px] items-center justify-center w-64 h-48 border bg-[#f97316] border-orange-400 shadow-gray-400 border-b-8 shadow-md mx-5 my-5 ml-[10px] opacity-[0.9] text-xl"
          />

          <CustomButton
            title="Request Visit"
            handlePress={handleRequestPassout}
            containerStyles="mb-4 rounded-[30px] items-center justify-center w-64 h-48 border bg-[#a21caf] border-[#c026d3] shadow-gray-400 border-b-8 shadow-md mx-2 my-5 ml-[10px] opacity-[0.9]"
          />
        </View>
      </SafeAreaView>
    );
  }

  if (newUser.userType === "Caregiver") {
    return (
      <SafeAreaView className="h-screen bg-[#fafbfb]">
        <ScrollView className="">
          <View className="h-11/12 py-4 w-screen flex justify-center items-center">
            <Text className="font-bold bg-[#0b4dad] px-10 py-2 rounded-md text-3xl text-white mb-6">
              {Day[new Date().getDay()]}
            </Text>
            {activity.length > 0 ? (
              activity.map((act) => (
                <ActList
                  key={act.id}
                  act={act}
                  setCurrentAct={setCurrent}
                  setShowModal={setShowModal}
                />
              ))
            ) : (
              <Text className="flex items-center justify-center font-bold text-xl">
                No activities available
              </Text>
            )}
            <AttModal isOpen={showModal}>
              <View className="bg-white w-11/12 h-fit flex p-4 justify-center items-center rounded-md shadow">
                <Text className="font-bold text-[#42606b] text-2xl mb-3">
                  Mark attendance
                </Text>
                <Resident
                  options={peopleData}
                  attended={attended}
                  currentAct={currentAct}
                  setAttended={setAttended}
                />

                <View className="w-full flex flex-row justify-around">
                  <Pressable
                    className="w-1/3 h-8 flex items-center justify-center bg-black-200 rounded-sm"
                    onPress={() => setShowModal(false)}
                  >
                    <Text className="text-black font-bold text-lg">Cancel</Text>
                  </Pressable>
                  <Pressable
                    className="w-1/3 h-8 flex items-center justify-center bg-black-200 rounded-sm"
                    onPress={() => submitAttendance()}
                  >
                    <Text className="text-black font-bold text-lg">Submit</Text>
                  </Pressable>
                </View>
              </View>
            </AttModal>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
};

export default booking;
