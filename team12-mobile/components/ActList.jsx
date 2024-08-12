import { Button, View, Text, Pressable } from "react-native";

const ActList = ({ act, setCurrentAct, setShowModal }) => {
  return (
    <View className="w-11/12 mb-3 rounded-md p-2 justify-between bg-[#0b4dad] flex flex-row">
      <View className="flex flex-row items-center justify-between w-2/3">
        <Text className="font-bold text-lg text-white">{`${act.name}`}</Text>
        <Text className="bg-yellow-400 text-white rounded-sm p-1 font-bold ">{`Time: ${act.time}`}</Text>
      </View>
      <Pressable
        className="w-[100px] flex items-center justify-center  bg-red-600 "
        onPress={() => {
          setShowModal(true);
          setCurrentAct(act.id);
        }}
      >
        <Text className="text-white font-bold text-lg">Attendance</Text>
      </Pressable>
    </View>
  );
};

export default ActList;
