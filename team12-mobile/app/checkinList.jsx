import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { IP_ADDRESS } from "@env";
import { useRoute, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";

const CheckinList = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { newUser, } = route.params || {};
    const [checkins, setCheckins] = useState([]);
    const [isLoading, setLoading] = useState(true);


    // go back to caregiver landing screen
    const handleBackButton = () => {
        navigation.goBack();
    };

    // format date 
    function formatDate(isoDateString) {
        const originalTime = new Date(isoDateString);
        const day = originalTime.getDate();
        const month = originalTime.getMonth() + 1;
        const year = originalTime.getFullYear();
        const formattedTime = `${day}-${month}-${year}`;
        return formattedTime;
    }

    const getCaregiverCheckins = async () => {
        try {

            const response = await axios.get(
                `http://${IP_ADDRESS}:3000/caregiverCheckins/${newUser.id}`
            );

            if (response.data) {
                setCheckins(response.data.checkins);
                console.log("Set checkin: ", checkins);

            } else {
                console.log(checkins, "no checkins found");
            }
        } catch (error) {
            console.error("error occured when fetching checkins", error);
        } finally {
            setLoading(false);
        }
    };

    const renderMood = (score) => {

        const setColour = (score) => {
            if (score < 9) {
                return "bg-red-400";
            } else if (score >= 10 && score < 18) {
                return "bg-orange-400";
            } else {
                return "bg-green-400";
            }
        }

        const setMood = ((score) => {
            if (score < 9) {
                return 'UNHEALTHY';
            } else if (score < 18) {
                return 'MODERATE';
            } else {
                return 'HEALTHY';
            }
        })

        return (
            <View className={`flex justify-center w-fit py-5 px-4 rounded-[40px] ml-[20px] text-center text-[18px] mb-[6px] ${setColour(score)}`}>
                <Text className="font-psemibold">{setMood(score)}</Text>
            </View>
        )
    }

    const handlePress = (item) => {
        navigation.navigate("checkinView", {
            id: item.resident_id,
        })
    };

    useEffect(() => {
        getCaregiverCheckins();
    }, []);

    const renderCheckinItem = ({ item }) => {

        return (
            <View>
                <TouchableOpacity
                    className="my-[10px] mx-[16px] bg-white p-[10px]  border-slate-200 shadow-gray-400 border-b-8 shadow-md w-[364px]"
                    onPress={() => handlePress(item)}
                >
                    <View className="flex-row items-center">
                        <Image
                            source={{ uri: item.image_url }}
                            className="w-[60px] h-[60px] rounded-[40px] mr-[10px]"
                        />
                        <View>
                            <Text className="text-[20px] font-pbold mb-[5px]">
                                {item.first_name} {item.last_name}
                            </Text>
                            <Text className="text-[18px] font-bold text-[#42606b]">
                                Date:{formatDate(item.date)}
                            </Text>
                        </View>
                        {renderMood(item.totalscore)}
                    </View>
                </TouchableOpacity>
            </View>
        );
    };


    if (isLoading) {
        return (
            <View className="justify-center items-center">
                <Text> loading ...</Text>
            </View>
        )
    }

    if (isLoading === false) {
        return (
            <SafeAreaView className="flex-1 bg-[#fafbfb]">
                <View className="flex-row items-center justify-center pt-6 mb-6 px-4">
                    <TouchableOpacity
                        onPress={handleBackButton}
                        className="absolute left-10 top-10"
                    >
                        <FontAwesome name="arrow-left" size={24} color="black" />
                    </TouchableOpacity>
                    <Text className="text-3xl font-bold  py-2 px-2 rounded-xl shadow-md">
                        Carewise
                    </Text>
                </View>
                <View></View>

                <FlatList
                    data={checkins}
                    keyExtractor={(item) => item.checkin_id.toString()}
                    renderItem={renderCheckinItem}
                    contentContainerStyle={{ paddingVertical: 10 }}
                />

            </SafeAreaView>
        );
    }

}
export default CheckinList; 