import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../components/FormField";
import { FontAwesome6 } from "@expo/vector-icons";
import axios from "axios";
import { IP_ADDRESS } from "@env";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { userObject } from "./(auth)/Sign-in";
import DateTimePickerModal from "react-native-modal-datetime-picker"; // npm i
import CustomButton from "../components/CustomButton";

const PassoutRequest = () => {
  const navigation = useNavigation();
  const { newUser, token } = userObject || {};

  //States
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [destination, setDestination] = useState("");
  const [reason, setReason] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [openEndDatePicker, setOpenEndDatePicker] = useState(false);
  const [openVisitPicker, setOpenVisitPicker] = useState(false);

  // Family_Member state
  const [form, setForm] = useState({
    Purpose: "",
    Visit_Date: new Date(),
    Duration: "",
  });
  const [residentData, setResidentData] = useState(null);

  // Fetch resident data
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
      if (response.data.resident) {
        setResidentData(response.data.resident);
      } else {
        setResidentData(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDateChange = (date, setter, pickerCloser) => {
    const adjustedDate = convertDate(date);
    const newdate1 = new Date(adjustedDate);
    const selectedHours = newdate1.getHours();

    if (selectedHours < 8 || selectedHours > 16) {
      Toast.show({
        type: "error",
        text1: "Please select a time between 8 AM and 4 PM.",
      });
    }

    setter(newdate1);
    pickerCloser();
  };

  const handleStart = (date) => {
    handleDateChange(date, setStartDate, hideStart);
  };

  const handleEnd = (date) => {
    handleDateChange(date, setEndDate, hideEnd);
  };

  const handleVisit_Date = (date) => {
    handleDateChange(
      date,
      () => setForm({ ...form, Visit_Date: date }),
      hideVisit
    );
  };

  const hideStart = () => {
    setOpenStartDatePicker(false);
  };

  const hideEnd = () => {
    setOpenEndDatePicker(false);
  };

  const hideVisit = () => {
    setOpenVisitPicker(false);
  };

  const convertDate = (date) => {
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );

    return localDate.toISOString().slice(0, 19).replace("T", " ");
  };

  // Submit passout request
  const handleSubmit = async () => {
    const startDateTime = convertDate(startDate);
    const endDateTime = convertDate(endDate);

    try {
      const response = await axios.post(`http://${IP_ADDRESS}:3000/passouts`, {
        resident_id: newUser.id,
        start_date: startDateTime,
        end_date: endDateTime,
        destination: destination,
        reason: reason,
        emergency_contact: emergencyContact,
      });

      Toast.show({
        type: "success",
        text1: response.data.message,
      });

      setTimeout(() => {
        navigation.navigate("MyPassouts");
      }, 2000);
    } catch (error) {
      console.error("Error submitting passout", error);
    }
  };

  // Submit visitation request
  const handleSubmitVisit = async () => {
    const { Purpose, Visit_Date, Duration } = form;
    const visitDate = convertDate(Visit_Date);

    try {
      const response = await axios.post(`http://${IP_ADDRESS}:3000/visits`, {
        resident_id: residentData.id,
        family_id: newUser.id,
        reason: Purpose,
        visit_date: visitDate,
        Duration: Duration,
      });

      Toast.show({
        type: "success",
        text1: response.data.message,
      });

      setTimeout(() => {
        navigation.navigate("MyPassouts");
      }, 2000);
    } catch (error) {
      console.error("Error submitting Visitation", error);
    }
  };

  useEffect(() => {
    if (newUser?.userType === "Family_Member") {
      fetchResidentData();
    }
  }, [newUser, token]);

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}-${month}-${year}, ${hours}:${minutes}`;
  };

  // Resident form
  if (newUser.userType === "Resident") {
    return (
      <SafeAreaView className="flex-1 bg-[#fafbfb] p-6">
        <ScrollView contentContainerStyle={{ alignItems: "left" }}>
          <View className="flex-row items-center mb-6">
            <TouchableOpacity
              onPress={() => navigation.navigate("booking")}
              className="mr-8"
            >
              <FontAwesome6 name="arrow-left" size={24} color="black" />
            </TouchableOpacity>
            <Text className="text-3xl font-bold text-center ml-5">
              Passout Request
            </Text>
          </View>

          <Text className="text-lg text-black font-pmedium">Daparting Date</Text>
          <TouchableOpacity
            onPress={() => setOpenStartDatePicker(true)}
            className="mb-8  shadow-md w-full h-[75px] px-4 bg-blue-100 bg-opacity-10 rounded-3xl items-center flex-row"
          >
            <TextInput
              value={formatDate(startDate)}
              editable={false}
              className=" w-full h-16 px-4  rounded-2xl text-[#6b7280] text-base"
            />
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={openStartDatePicker}
            mode="datetime"
            date={startDate}
            onConfirm={handleStart}
            onCancel={hideStart}
          />

          <Text className="text-lg text-black font-pmedium">Return Date</Text>
          <TouchableOpacity
            onPress={() => setOpenEndDatePicker(true)}
            className="mb-8  shadow-md w-full h-[75px] px-4 bg-blue-100 bg-opacity-10 rounded-3xl items-center flex-row text-black"
          >
            <TextInput
              value={formatDate(endDate)}
              editable={false}
              className="w-full h-16 px-4 rounded-2xl text-[#6b7280] text-base"
            />
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={openEndDatePicker}
            mode="datetime"
            date={endDate}
            onConfirm={handleEnd}
            onCancel={hideEnd}
          />

          <FormField
            title="Destination"
            value={destination}
            handleChangeText={setDestination}
            otherStyles="mb-4"
            placeholder="Enter your destination"
          />

          <FormField
            title="Reason for passout"
            value={reason}
            handleChangeText={setReason}
            otherStyles="mb-4"
          />

          <FormField
            title="Contact Number"
            value={emergencyContact}
            type="phone"
            handleChangeText={setEmergencyContact}
            otherStyles="mb-4"
            placeholder="Enter your emergency contact number"
          />

          <CustomButton title="Submit Request" handlePress={handleSubmit}
            containerStyles="w-full mt-7 bg-[#0b4dad] p-6" />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Family_Member form
  if (newUser.userType === "Family_Member") {
    return (
      <SafeAreaView className="flex-1 bg-[#fafbfb] p-4">
        <ScrollView contentContainerStyle={{ alignItems: "left" }}>
          <View className="flex-row items-center mb-6">
            <TouchableOpacity
              onPress={() => navigation.navigate("booking")}
              className="absolute top-[20] left-5  rounded-full p-2"
            >
              <FontAwesome6 name="arrow-left" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <Text className="text-3xl font-bold text-center ml-5">
            Booking Visit
          </Text>

          <View className="mt-20">
            <Text className="mb-2 text-lg text-black font-pmedium">Visit Date and Arrival Time</Text>
            <TouchableOpacity
              onPress={() => setOpenVisitPicker(true)}
              className="mb-4 w-full"
            >
              <TextInput
                value={formatDate(form.Visit_Date)}
                editable={false}
                className="mb-8  shadow-md w-full h-[75px] px-4 bg-blue-100 bg-opacity-10 rounded-3xl items-center flex-row"
              />
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={openVisitPicker}
              mode="datetime"
              date={form.Visit_Date}
              onConfirm={handleVisit_Date}
              onCancel={hideVisit}
            />

            <FormField
              title="Reason"
              value={form.Purpose}
              handleChangeText={(e) => setForm({ ...form, Purpose: e })}
              otherStyles="mb-4"
              placeholder="What is the purpose of the visit"
            />

            <CustomButton
              title="Submit Booking"
              handlePress={handleSubmitVisit}
              containerStyles="w-full mt-7 bg-[#0b4dad] p-6"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <View className="flex-1 justify-center items-center">
        <Text className="text-3xl">Loading...</Text>
      </View>
    </SafeAreaView>
  );
};

export default PassoutRequest;
