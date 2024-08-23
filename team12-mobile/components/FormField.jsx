import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { icons } from "../constants/icons";

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  type,
  otherStyles,
  ...props
}) => {
  const [showPassword, setShowPasword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const genderData = [
    { key: "1", value: "male" },
    { key: "2", value: "female" },
    { key: "3", value: "other" },
  ];

  const durationData = [
    { key: "1", value: "30 Minutes" },
    { key: "2", value: "1 hour" },
    { key: "3", value: "2 hours" },
  ];

  const visitReason = [
    { key: "1", value: "Visit resident" },
    { key: "2", value: "Appointment with the Manager" },
  ];

  const passoutReason = [
    { key: "1", value: "Grocery shopping" },
    { key: "2", value: "Visit Friend/Family" },
  ];

  const getDropDonwData = () => {
    switch (title) {
      case "Gender":
        return genderData;
      case "Duration":
        return durationData;
      case "Reason":
        return visitReason;
      case "Reason for passout":
        return passoutReason;
      default:
        return [];
    }
  };

  const renderDropdown = () => (
    <SelectList
      className=""
      placeholder={`Select ${title}`}
      setSelected={handleChangeText}
      data={getDropDonwData()}
      save="value"
      boxStyles={{
        borderWidth: 0,
        width: '100%',
        backgroundColor: '#dbeafe',
        height: 75,
        alignItems: 'center',
        shadowOpacity: 0.25,
        borderRadius: 24,

      }}
      inputStyles={{
        color: '#6b7280',
        fontSize: 16,
      }}
    />
  );

  const handleTextChange = (text) => {
    if (type === "phone") {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(text)) {
        setErrorMessage("Phone number must be 10 digits.");
      } else {
        setErrorMessage("");
      }
    } else if (type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(text)) {
        setErrorMessage("Invalid email address.");
      } else {
        setErrorMessage("");
      }
    } else {
      setErrorMessage("");
    }
    handleChangeText(text);
  };

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-lg text-black font-pmedium ">{title}</Text>

      {["Gender", "Duration", "Reason", "Reason for passout"].includes(
        title
      ) ? (
        renderDropdown()
      ) : (
        <View className=" shadow-md w-full h-[75px] px-4 bg-blue-100 bg-opacity-10 rounded-3xl items-center flex-row">
          <TextInput
            className="flex-1 text-black font-psemibold text-base"
            value={value}
            placeholder={placeholder}
            onChangeText={handleTextChange}
            secureTextEntry={title === "Password" && !showPassword}
            keyboardType={type === "phone" ? "numeric" : "default"}
            autoCapitalize={type === "email" ? "none" : "sentences"}
          />

          {title === "Password" && (
            <TouchableOpacity onPress={() => setShowPasword(!showPassword)}>
              <Image
                source={!showPassword ? icons.eye : icons.eyeHide}
                className="w-6 h-6"
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </View>
      )}
      {errorMessage ? (
        <Text className="text-red-500 text-sm">{errorMessage}</Text>
      ) : null}
    </View>
  );
};

export default FormField;
