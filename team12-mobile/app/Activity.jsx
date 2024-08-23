import { useRoute, useNavigation } from "@react-navigation/native";
import { ScrollView, View, Text, Pressable, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { userObject } from "./(auth)/Sign-in";
import { useState, useEffect } from "react";
import axios from "axios";
import AttModal from "../components/AttModal";
import ActList from "../components/ActList";
import Resident from "../components/Resident";
import { IP_ADDRESS } from "@env";
import Toast from "react-native-toast-message";

const Activity = () => {
  const [activity, setActivity] = useState([]);
  const [currentAct, setCurrent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [registered, setRegistered] = useState([]);
  const [attended, setAttended] = useState([]);
  const [cottageData, setCottageData] = useState(null);
  const [peopleData, setPeopleData] = useState([]);

  const { newUser, token } = userObject || {};
  const route = useRoute();
  const { id } = route.params || {};

  useEffect(() => {
    if (activity.length > 0) {
      const newAttended = activity.map((act) => ({
        actId: act.id,
        careId: userObject.id,
        resident: [],
      }));
      setAttended(newAttended);
    }
  }, [activity]);

  useEffect(() => {
    if (newUser?.userType === "Caregiver") {
      fetchCottageData();
    }
  }, [newUser, token]);

  useEffect(() => {
    if (cottageData) {
      fetchPeopleData(cottageData.id);
      getData();
    }
  }, [cottageData]);

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

      if (response.data.cottage) {
        setCottageData(response.data.cottage[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getData = async () => {
    try {
      const response = await axios.get(
        `http://${IP_ADDRESS}:3000/activities/${id}`
      );
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
    try {
      const response = await axios.post(
        `http://${IP_ADDRESS}:3000/attendance`,
        {
          actId: currentAct,
          careId: newUser.id,
          resident: actAttendance.resident,
        }
      );

      console.log("Response data", response.data);

      Toast.show({
        type: "success",
        text1: "Attendance submitted",
      });

      setRegistered([...registered, currentAct]);
      setShowModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView className="h-screen ">
      <ScrollView className="">
        <View className="h-11/12 py-4 w-screen flex justify-center items-center">
          <Text className="font-bold text-3xl text-white mb-5">Activities</Text>
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
            <Text>No activities available</Text>
          )}
          <AttModal isOpen={showModal}>
            <View className="bg-white w-11/12 h-fit flex p-4 justify-center items-center ">
              <Text className="font-bold text-white text-2xl mb-3">
                Mark attendance
              </Text>
              <Resident
                options={peopleData}
                attended={attended}
                currentAct={currentAct}
                setAttended={setAttended}
              />

              <View className="w-full  justify-around">
                <Pressable
                  className="w-[100px] flex items-center justify-center  bg-red-600 "
                  onPress={() => setShowModal(false)}
                >
                  <Text className="text-white font-bold text-lg">Cancel</Text>
                </Pressable>
                <Pressable
                  className="w-[100px] flex items-center justify-center  bg-red-600 "
                  onPress={() => submitAttendance()}
                >
                  <Text className="text-white font-bold text-lg">Submit</Text>
                </Pressable>
              </View>
            </View>
          </AttModal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Activity;
