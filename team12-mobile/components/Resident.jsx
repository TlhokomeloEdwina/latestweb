import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";

const Resident = ({ options, attended, setAttended, currentAct }) => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const updateAttended = () => {
      update = attended.filter((item, index) => {
        return attended.indexOf(item) === index;
      });
    };
    updateAttended();
    console.log(attended);
  }, [attended]);

  // useEffect(() => {
  //   console.log("Attend: ", attended);
  // },[])

  const updateResForAct = (actId, newRes) => {
    setAttended((attend) => {
      const index = attend.findIndex((item) => item.actId === actId);

      if (index === -1) {
        console.error(`actId ${actId} not found.`);
        return attend;
      }

      const existingResIndex = attend[index].resident.indexOf(newRes);

      if (existingResIndex !== -1) {
        // Resident already exists, so remove it
        const updatedRes = [
          ...attend[index].resident.slice(0, existingResIndex),
          ...attend[index].resident.slice(existingResIndex + 1),
        ];
        return [
          ...attend.slice(0, index),
          { ...attend[index], resident: updatedRes },
          ...attend.slice(index + 1),
        ];
      } else {
        // Resident doesn't exist, so add it
        const updatedRes = [...attend[index].resident, newRes];
        return [
          ...attend.slice(0, index),
          { ...attend[index], resident: updatedRes },
          ...attend.slice(index + 1),
        ];
      }
    });
  };

  const isAttended = (residentId) => {
    // Check if the residentId is in the attended array for the currentAct
    const actAttendance =
      attended &&
      attended !== 0 &&
      attended.find((item) => item.actId === currentAct);
    return actAttendance && actAttendance.resident.includes(residentId);
  };

  return (
    <View className="w-11/12 h-11/12">
      {options && options.length !== 0 ? (
        options.map((option) => {
          return (
            <TouchableOpacity
              key={option.id}
              className="flex flex-row mb-2 bg-[#dbeafe] rounded-md w-full h-fit p-2"
              onPress={() => {
                updateResForAct(currentAct, option.id);
                setChecked(!checked);
              }}
            >
              {isAttended(option.id) && (
                <Ionicons name="checkmark" size={26} color="red" />
              )}

              <Text className="font-bold ml-5 text-lg text-black">
                {option.first_name}
              </Text>
            </TouchableOpacity>
          );
        })
      ) : (
        <Text>You are not assign to any resident</Text>
      )}
    </View>
  );
};

export default Resident;
