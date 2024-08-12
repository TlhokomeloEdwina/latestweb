// BasicAlerts.js
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { FontAwesome } from "@expo/vector-icons";
import {
  faHandsHelping,
  faUtensils,
  faPills,
  faTools,
} from "@fortawesome/free-solid-svg-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { IP_ADDRESS } from "@env";
import Toast from "react-native-toast-message";

const AlertButtons = ({ alert, index, sendAlert }) => {
  return (
    <TouchableOpacity
      key={index}
      className={`flex-row rounded-[30px] items-center justify-center border mx-1 ${alert.background} my-6 ml-6 mr-2`}
      onPress={() => sendAlert(alert)}
      style={{ width: 170, height: 160, opacity: 0.9 }}
      activeOpacity={0.7}
    >
      <View className="items-center justify-center ml-2 ">
        <FontAwesomeIcon icon={alert.icon} size={48} />
        <Text className="text-xl mt-3 text-black">{alert.type}</Text>
      </View>
    </TouchableOpacity>
  );
};

const BasicAlerts = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { resident } = route.params || {};

  //States
  const [CaregiverToken, setCaregiverToken] = useState(null);
  const [Caregiver_id, setCaregiver_id] = useState(null);

  const fetchCaregiverInformation = async () => {
    try {
      const response = await axios.get(
        `http://${IP_ADDRESS}:3000/caregiverInfo/${resident.newUser.id}`
      );

      if (response.data.caregiver.caregiver_id) {
        setCaregiver_id(response.data.caregiver.caregiver_id);
      }

      if (response.data.caregiver.expoDeviceToken) {
        setCaregiverToken(response.data.caregiver.expoDeviceToken);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCaregiverInformation();
  }, []);

  const sendAlert = async (alert) => {
    try {
      const response = await axios.post(`http://${IP_ADDRESS}:3000/alert`, {
        alert_type: alert.type,
        resident_id: resident.newUser.id,
        caregiver_id: Caregiver_id,
      });

      Toast.show({
        type: "success",
        text1: response.data.message,
        text2: "The caregiver will attend you shortly!",
      });

      navigation.navigate("home");
    } catch (error) {
      console.error(error);
    }
  };

  const alerts = [
    {
      type: "Assistance",
      icon: faHandsHelping,
      background:
        "bg-[#ec4899] border-pink-400 shadow-gray-400 border-b-8 shadow-md",
    },
    {
      type: "Meal Service",
      icon: faUtensils,
      background:
        "bg-[#22c55e] border-green-300 shadow-gray-400 border-b-8 shadow-md",
    },
    {
      type: "Medical Refill",
      icon: faPills,
      background:
        "bg-[#06b6d4] border-cyan-400 shadow-gray-400 border-b-8 shadow-md",
    },
    {
      type: "Maintenance",
      icon: faTools,
      background:
        "bg-[#facc15] border-yellow-300 shadow-gray-400 border-b-8 shadow-md",
    },
  ];

  return (
    <View className="flex-1 bg-[#f8fafc]">
      <View className="items-center justify-center mt-16">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="absolute top-[-10] left-6 bg-[#bfcddb]rounded-full p-4"
        >
          <FontAwesome name="arrow-left" size={30} />
        </TouchableOpacity>
        <Text className="text-3xl font-bold">Basic Alerts</Text>
      </View>

      <View className="mt-28">
        <View className="flex-row justify-center flex-wrap mb-4 gap-5 my-auto">
          {alerts.slice(0, 2).map((alert, index) => (
            <AlertButtons key={index} alert={alert} sendAlert={sendAlert} />
          ))}
        </View>
        <View className="flex-row justify-center flex-wrap gap-5 my-2">
          {alerts.slice(2).map((alert, index) => (
            <AlertButtons key={index} alert={alert} sendAlert={sendAlert} />
          ))}
        </View>
      </View>
    </View>
  );
};

export default BasicAlerts;
