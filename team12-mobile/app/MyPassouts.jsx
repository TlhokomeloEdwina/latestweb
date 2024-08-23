import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faClock, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import { IP_ADDRESS } from "@env";
import { userObject } from "./(auth)/Sign-in";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";

const MyPassouts = () => {
  const [passoutsData, setPassoutsData] = useState([]);
  const [visitData, setVisitData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [sortByDate, setSortByDate] = useState("Newest");
  const navigation = useNavigation();
  const { newUser } = userObject || {};

  const fetchPassouts = async () => {
    try {
      const response = await axios.get(
        `http://${IP_ADDRESS}:3000/passouts/${newUser.id}`
      );

      if (response.data.Passouts) {
        setPassoutsData(response.data.Passouts);
        setFilteredData(response.data.Passouts);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching passouts: ", error);
      setLoading(false);
    }
  };

  const fetchVisits = async () => {
    try {
      const response = await axios.get(
        `http://${IP_ADDRESS}:3000/visits/${newUser.id}`
      );

      if (response.data.Visits) {
        setVisitData(response.data.Visits);
        setFilteredData(response.data.Visits);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching Visits: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (newUser?.userType === "Resident") {
      fetchPassouts();
    } else if (newUser?.userType === "Family_Member") {
      fetchVisits();
    }
  }, [newUser]);

  useEffect(() => {
    let filtered = newUser?.userType === "Resident" ? passoutsData : visitData;

    if (selectedFilter !== "All") {
      filtered = filtered.filter((item) => item.status === selectedFilter);
    }

    // Sort passouts or visits based on selected sort order
    if (sortByDate === "Newest") {
      filtered.sort(
        (a, b) =>
          new Date(b.request_date || b.visit_date) -
          new Date(a.request_date || a.visit_date)
      );
    } else {
      filtered.sort(
        (a, b) =>
          new Date(a.request_date || a.visit_date) -
          new Date(b.request_date || b.visit_date)
      );
    }

    setFilteredData(filtered);
  }, [selectedFilter, sortByDate, passoutsData, visitData]);

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);

    const formatDate = () => {
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    const formatTimeAMPM = () => {
      let hours = date.getHours();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes} ${ampm}`;
    };

    return {
      formattedDate: formatDate(),
      formattedTime: formatTimeAMPM(),
    };
  };

  const renderStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <FontAwesomeIcon icon={faClock} size={24} color="orange" />;
      case "Accepted":
        return <FontAwesomeIcon icon={faCheck} size={24} color="green" />;
      case "Declined":
        return <FontAwesomeIcon icon={faTimes} size={24} color="red" />;
      default:
        return null;
    }
  };

  const handlePassoutPress = (passout) => {
    if (expandedId === passout.id) {
      setExpandedId(null);
    } else {
      setExpandedId(passout.id);
    }
  };

  const renderPassOutCard = ({ item }) => {
    return (
      <TouchableOpacity
        key={item.id}
        className="bg-[#bae6fd] p-4 rounded-lg mb-4 w-[340px] border-blue-300 shadow-gray-400 border-b-8 shadow-md "
        onPress={() => handlePassoutPress(item)}
      >
        <View className="flex-row justify-between items-center ">
          <Text className="text-2xl font-bold flex-1 text-black">
            {item.destination}
          </Text>
          {renderStatusIcon(item.status)}
        </View>
        {expandedId === item.id && (
          <View className="mt-6">
            <Text className="text-xl font-bold text-black">
              Requested on: {formatDateTime(item.request_date).formattedDate}{" "}
              {formatDateTime(item.request_date).formattedTime}
            </Text>
            <Text className="text-xl font-bold mt-6 text-black">
              Reason:{" "}
              <Text className="font-bold text-orange-400 text-2xl">
                {item.reason}
              </Text>
            </Text>
            <Text className="text-xl mt-6 text-black">
              Emergency Contact: {item.emergency_contact}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderVisitCard = ({ item }) => {
    return (
      <TouchableOpacity
        key={item.id}
        className="bg-[#bae6fd] p-4 rounded-lg mb-4 w-[340px] border-blue-300 shadow-gray-400 border-b-8 shadow-mdd "
        onPress={() => handlePassoutPress(item)}
      >
        <View className="flex-row justify-between items-center ">
          <Text className="text-2xl font-bold flex-1 text-black">
            {item.reason}
          </Text>
          {renderStatusIcon(item.status)}
        </View>
        {expandedId === item.id && (
          <View className="mt-6">
            <Text className="text-xl font-bold text-black">
              Requested on: {formatDateTime(item.visit_date).formattedDate}{" "}
              {formatDateTime(item.visit_date).formattedTime}
            </Text>
            <Text className="text-xl font-bold mt-6 text-black">
              <Text className="font-bold text-orange-400 text-2xl">
                Reason: {item.reason}
              </Text>
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center ">
        <ActivityIndicator size="large" color="blue" />
      </SafeAreaView>
    );
  }

  if (newUser.userType === "Resident") {
    return (
      <SafeAreaView className="flex-1 bg-[#fafbfb]">
        <View className="items-center justify-center mt-5 mb-6">

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="absolute top-[-10] left-5  rounded-full p-2 mr-8 "
          >
            <FontAwesome name="arrow-left" size={30} />
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-center ml-5">My Passouts Page</Text>
        </View>

        {/* Filter Section */}
        <View className="px-4 mb-4 mt-3 justify-center items-center border-black">
          <Text className="text-2xl mb-2">Sort by Status</Text>
          <Picker
            selectedValue={selectedFilter}
            style={{
              height: 50,
              width: 180,
              backgroundColor: "#bfdbfe",
              borderRadius: 90,
              fontSize: 24,
              fontWeight: "bold",
              color: "black",

            }}
            onValueChange={(itemValue) => setSelectedFilter(itemValue)}
          >
            <Picker.Item
              label="All"
              value="All"
              style={{
                fontSize: 18,
                fontWeight: "bold",
              }}
            />
            <Picker.Item label="Pending" value="Pending" />
            <Picker.Item label="Accepted" value="Accepted" />
            <Picker.Item label="Declined" value="Declined" />
          </Picker>
        </View>

        <FlatList
          data={filteredData}
          renderItem={renderPassOutCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{
            marginTop: 16,

            alignSelf: "center",
          }}
        />
      </SafeAreaView>
    );
  }

  if (newUser.userType === "Family_Member") {
    return (
      <SafeAreaView className="flex-1 bg-[#fafbfb]">
        <View className="items-center justify-center mt-5">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="absolute top-[-10] left-5  rounded-full p-2"
          >
            <FontAwesome name="arrow-left" size={30} />
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-center ml-5">My Visits Page</Text>
        </View>

        {/* Filter Section */}
        <View className="px-4 mb-4 mt-3 justify-center items-center border-black">
          <Text className="text-2xl mb-2">Sort by Status</Text>
          <Picker
            selectedValue={selectedFilter}
            style={{
              height: 50,
              width: 180,
              backgroundColor: "#bfdbfe",
              borderRadius: 90,
              fontSize: 18,
              fontWeight: "bold",
              color: "black",
            }}
            onValueChange={(itemValue) => setSelectedFilter(itemValue)}
          >
            <Picker.Item
              label="All"
              value="All"
              style={{
                fontSize: 18,
                fontWeight: "bold",
              }}
            />
            <Picker.Item label="Pending" value="Pending" />
            <Picker.Item label="Accepted" value="Accepted" />
            <Picker.Item label="Declined" value="Declined" />
          </Picker>
        </View>

        <FlatList
          data={filteredData}
          renderItem={renderVisitCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{
            marginTop: 16,

            alignSelf: "center",
          }}
        />
      </SafeAreaView>
    );
  }
};

export default MyPassouts;
