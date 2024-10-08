import { View, Text } from "react-native";

const formatTime = (start_time) => {
  let [hour, minute, second] = start_time.split(":");
  let period = "AM";

  hour = parseInt(hour);
  if (hour >= 12) {
    period = "PM";
    if (hour > 12) hour -= 12;
  } else if (hour === 0) {
    hour = 12;
  }

  return `${hour.toString().padStart(2, "0")}:${minute.padStart(2, "0")} ${period}`;
};

const Activity = ({ activity }) => {
  console.log("This is the activity: ", activity);
  const formattedTime = formatTime(activity.start_time);
  return (
    <View className="w-11/12 flex flex-row justify-between p-2">
      <Text className="font-semibold text-xl">{activity.name}</Text>
      <Text>{formattedTime}</Text>
    </View>
  );
};

export default Activity;
