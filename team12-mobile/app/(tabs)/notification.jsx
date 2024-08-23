import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
  Button,
} from "react-native";
import React, { useEffect, useState } from "react";
import { userObject } from "../(auth)/Sign-in";
import { IP_ADDRESS } from "@env";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "../../constants/icons";

const notification = () => {
  const [alerts, setAlerts] = useState([]);
  const [ResidentData, setResidentData] = useState(null);
  const [ResidentAlerts, setResidentAlerts] = useState([]);

  const [selectedAlert, setSelectedAlert] = useState(null);
  const [review, setReview] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [ShowReviewForm, setShowReviewForm] = useState(false);

  const { newUser, token } = userObject || {};

  //fetch caregiver alerts
  const fetchCaregiverAlerts = async () => {
    try {
      const response = await axios.get(
        `http://${IP_ADDRESS}:3000/caregiverAlerts/${newUser.id}`
      );
      if (response.data.alerts) {
        setAlerts(response.data.alerts);
      }
    } catch (error) {
      console.error(error);
    }
  };

  //fetch resident alerts and resident infromation
  const fetchResidentAlerts = async () => {
    try {
      const residentInfo = await axios.get(
        `http://${IP_ADDRESS}:3000/familyResident/${newUser.id}`
      );

      if (residentInfo.data.resident) {
        setResidentData(residentInfo.data.resident);
      }

      let residentId = residentInfo.data.resident.id;

      const residentAlerts = await axios.get(
        `http://${IP_ADDRESS}:3000/residentAlerts/${residentId}`
      );

      if (residentAlerts.data.alerts) {
        setResidentAlerts(residentAlerts.data.alerts);
      }
    } catch (error) {
      console.error(error);
    }
  };

  //fetch caregiver alerts(in advance) if the user type is the caregiver
  useEffect(() => {
    if (newUser?.userType === "Caregiver") {
      fetchCaregiverAlerts();
    }
  }, [newUser?.userType]);

  //fetch resindent alerts and information(in advance) if the user type is the caregiver
  useEffect(() => {
    if (newUser?.userType === "Family_Member") {
      fetchResidentAlerts();
    }
  }, [newUser?.userType]);

  //fetch the review associated with the specific alert
  const fetchAlertReview = async (alert_id) => {
    try {
      const response = await axios.get(
        `http://${IP_ADDRESS}:3000/alertReview/${alert_id}`
      );

      console.log(response.data.review);

      if (newUser.userType === "Family_Member") {
        if (response.data.review !== undefined) {
          setReview(response.data.review);
          setShowReviewForm(true);
        } else {
          setReview("");
          setShowReviewForm(false);
        }
      }

      if (newUser.userType === "Caregiver") {
        if (response.data.review !== undefined) {
          setReview(response.data.review);
          setShowReviewForm(false);
        } else {
          setReview("");
          setShowReviewForm(true);
        }
      }
    } catch (error) {
      console.error(error);
      setShowReviewForm(false);
    }
  };

  //submit review for a specific alert
  const submitReview = async (alert_id) => {
    try {
      const response = await axios.post(`http://${IP_ADDRESS}:3000/review`, {
        description: reviewText,
        alert_id: alert_id,
        caregiver_id: newUser.id,
      });

      setReview("");
      fetchAlertReview(alert_id);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to submit the review");
    }
  };

  //handle press on an alert card to show/hide review
  const handleAlertPress = (alert_id) => {
    if (selectedAlert === alert_id) {
      setSelectedAlert(null);
    } else {
      setSelectedAlert(alert_id);
      fetchAlertReview(alert_id);
    }
  };

  //format the date to a readable format (dd-mm-yyyy)
  function formatDate(isoDateString) {
    const originalTime = new Date(isoDateString);

    const day = originalTime.getDate();
    const month = originalTime.getMonth() + 1;
    const year = originalTime.getFullYear();

    const formattedTime = `${day}-${month}-${year}`;

    return formattedTime;
  }

  //format the time to a readable format (hh-mm-ss)
  function formatTime(isoDateString) {
    const originalTime = new Date(isoDateString);

    const hours = originalTime.getHours();
    const minutes = originalTime.getMinutes();
    const seconds = originalTime.getSeconds();

    const formattedTime = `${hours}: ${minutes}: ${seconds}`;

    return formattedTime;
  }

  //render alert card for caregiver
  const renderAlertCard = ({ item }) => {
    //alert image
    let imageSource = icons.basic_alert;

    if (item.alert_Type === "Emergency") {
      imageSource = icons.emergency_alert;
    }

    return (
      <View>
        <TouchableOpacity
          className="my-[10px] mx-[20px] rounded-[10px] bg-[#dbeafe] p-[10px]  border-blue-200 shadow-gray-400 border-b-8 shadow-md"
          onPress={() => handleAlertPress(item.alert_id)}
        >
          <View className="flex-row ">
            {/* <Image
              source={{ uri: item.image_url }}
              className="w-[80px] h-[80px] rounded-[40px] mr-[10px]"
            /> */}
            <Image
              source={imageSource}
              className="w-[80px] h-[80px] rounded-[40px] "
            />
            <View>
              <Text className="text-xl font-pbold mb-[5px]">
                {item.first_name} {item.last_name}
              </Text>
              <Text className="text-lg text-[#42606b]">
                {formatDate(item.Time)}
              </Text>
              <Text className="text-lg text-[#42606b]">
                {formatTime(item.Time)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {selectedAlert === item.alert_id && (
          <View className="mx-[20px] my-[10px] p-[10px] bg-[#e6e6e6] border border-[#ccc] rounded-[10px]">
            <Text className="text-xl font-bold mb-[5px] ml-[35%]">
              Alert Note
            </Text>
            {ShowReviewForm ? (
              <>
                <TextInput
                  value={reviewText}
                  onChangeText={setReviewText}
                  placeholder="Write a note"
                  className="bg-white text-lg p-[10px] rounded-[5px] mb-[10px]"
                />
                <Button
                  title="Submit Note"
                  onPress={() => submitReview(item.alert_id)}

                />
              </>
            ) : (
              <View>
                <Text className="text-lg font-bold text-[#0b4dad]">
                  {review.description}
                </Text>

                <Text className="text-lg font-bold text-[#0b4dad]">
                  Made at {formatTime(review.time)}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  //render alert card for Resident
  const renderResidentCard = ({ item }) => {
    //alert image
    let imageSource = icons.basic_alert;
    if (item.alert_Type === "Emergency") {
      imageSource = icons.emergency_alert;
    }

    return (
      <View>
        <TouchableOpacity
          className="my-[10px] mx-[20px] rounded-[10px] bg-[#dbeafe] p-[10px]  border-blue-200 shadow-gray-400 border-b-8 shadow-md "
          onPress={() => handleAlertPress(item.id)}
        >
          <View className="flex-row items-center">
            <Image
              source={imageSource}
              className="w-[80px] h-[80px] rounded-[40px] mr-[10px]"
            />
            <View>
              <Text className="text-[18px] font-pbold mb-[5px]">
                {item.alert_Type}
              </Text>

              <Text className="text-[16px] text-[#888]">
                {"Date:"} {formatDate(item.Time)}
              </Text>

              <Text className="text-[16px] text-[#888]">
                {"Date:"} {formatTime(item.Time)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {selectedAlert === item.id && (
          <View className="mx-[20px] my-[10px] p-[10px] bg-[#e6e6e6] border border-[#ccc] rounded-[10px]">
            <Text className="text-xl font-bold mb-[5px] ml-[35%]">
              Alert Note
            </Text>
            {ShowReviewForm ? (
              <>
                <View>
                  <Text className="text-lg text-[#0b4dad]">
                    {review.description}
                  </Text>

                  <Text className="text-lg text-[#0b4dad]">
                    Made at {formatTime(review.time)}
                  </Text>
                </View>
              </>
            ) : (
              <View>
                <Text className="text-lg text-[#0b4dad]">
                  {"No Note submitted"}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  if (newUser.userType === "Caregiver") {
    return (
      <SafeAreaView className="flex-1 bg-[#fafbfb]">
        <FlatList
          data={alerts}
          keyExtractor={(item) => item.alert_id.toString()}
          renderItem={renderAlertCard}
          contentContainerStyle={{ paddingVertical: 20 }}
        />
      </SafeAreaView>
    );
  }

  if (newUser.userType === "Family_Member") {
    return (
      <SafeAreaView className="flex-1 bg-[#fafbfb]">
        <View className="flex-1 justify-center items-center  pt-5">
          {ResidentData ? (
            <Text className="text-black text-xl font-bold mt-2">
              {ResidentData.first_name} {ResidentData.last_name} Emergency
              Alerts
            </Text>
          ) : (
            <Text className="text-black text-2xl font-bold mt-2">
              Loading Resident Data...
            </Text>
          )}
        </View>

        <FlatList
          data={ResidentAlerts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderResidentCard}
          contentContainerStyle={{ paddingVertical: 20 }}
        />
      </SafeAreaView>
    );
  }
};

export default notification;
