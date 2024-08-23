import { Button, View, Text, Pressable, Image } from "react-native";
import { images } from "../constants/images";

const ActList = ({ act, setCurrentAct, setShowModal }) => {
  return (

    <View className="w-[340px] mb-3 rounded-md p-4 items-center justify-center bg-[#dbeafe] flex h-28">
      <View className="flex flex-row items-center justify-center">
        <Text className=" text-2xl font-semibold text-black ">{`${act.name} `}</Text>
        <Text className=" text-black p-1 font-semibold text-lg ">{`Time: ${act.time}`}</Text>
      </View>
      <View className="justify-center items-center">
        <Pressable
          className=" flex items-center justify-center  bg-red-600 rounded-lg h-10 w-32"
          onPress={() => {
            setShowModal(true);
            setCurrentAct(act.id);
          }}
        >
          <Text className="text-white  text-lg">Attendance</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ActList;
