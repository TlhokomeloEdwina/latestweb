import { View, Text, Image } from "react-native";
import React from "react";
import { Tabs, Redirect } from "expo-router";
import { icons } from "../../constants/icons";
import { userObject } from "../(auth)/Sign-in";
import { SafeAreaView } from "react-native-safe-area-context";

const TabIcon = ({ icon, color, name, focused }) => {
  const iconColor = focused ? "white" : color;
  const textColor = focused ? "text-[#bfcddb]" : color;

  return (
    <View className="items-center justify-center gap-2">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={iconColor}
        className="w-8 h-8"
      />
      <Text
        className={`${focused ? "font-psemibold" : "font-pregular"} text-base text-white`}
        style={{ color: textColor }}
      >
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  const { newUser, token } = userObject || {};

  if (!newUser) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-[#0b4dad] pt-5">
        <Text className="text-white text-xl font-bold mt-2">Loading...</Text>
      </SafeAreaView>
    );
  }

  if (newUser.userType === "Resident") {
    return (
      <>
        <Tabs
          screenOptions={{
            tabBarShowLabel: false,
            tabBarActiveTintColor: "#fafbfb",
            tabBarInactiveTintColor: "#fafbfb",
            tabBarStyle: {
              backgroundColor: "#0b4dad",
              borderTopWidth: 1,
              borderTopColor: "#0b4dad",
              height: 80,
              elevation: 8,
              borderRadius: 20,
              marginHorizontal: 1,
              marginBottom: 10,
            },
          }}
        >
          <Tabs.Screen
            name="home"
            options={{
              title: "Home",
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={icons.home}
                  color={color}
                  name="Home"
                  focused={focused}
                />
              ),
            }}
          />

          <Tabs.Screen
            name="booking"
            options={{
              title: "Booking",
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={icons.booking}
                  color={color}
                  name="Booking"
                  focused={focused}
                />
              ),
            }}
          />

          <Tabs.Screen
            name="notification"
            options={{
              title: "Notification",
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={icons.notification_icon}
                  color={color}
                  name="Notification"
                  focused={focused}
                />
              ),
            }}
          />

          {/* <Tabs.Screen
            name="setting"
            options={{
              title: "setting",
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={icons.setting}
                  color={color}
                  name="Setting"
                  focused={focused}
                />
              ),
            }}
          /> */}
        </Tabs>
      </>
    );
  }

  if (newUser.userType === "Caregiver") {
    return (
      <>
        <Tabs
          screenOptions={{
            tabBarShowLabel: false,
            tabBarActiveTintColor: "#fafbfb",
            tabBarInactiveTintColor: "#fafbfb",
            tabBarStyle: {
              backgroundColor: "#0b4dad",
              borderTopWidth: 1,
              borderTopColor: "#0b4dad",
              height: 80,
              elevation: 8,
              borderRadius: 20,
              marginHorizontal: 1,
              marginBottom: 10,
            },
          }}
        >
          <Tabs.Screen
            name="home"
            options={{
              title: "Home",
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={icons.home}
                  color={color}
                  name="Home"
                  focused={focused}
                />
              ),
            }}
          />

          <Tabs.Screen
            name="booking"
            options={{
              title: "Booking",
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={icons.people}
                  color={color}
                  name="Attendance"
                  focused={focused}
                />
              ),
            }}
          />

          <Tabs.Screen
            name="notification"
            options={{
              title: "Notification",
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={icons.notification_icon}
                  color={color}
                  name="Alerts"
                  focused={focused}
                />
              ),
            }}
          />

          {/* <Tabs.Screen
            name="setting"
            options={{
              title: "setting",
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={icons.setting}
                  color={color}
                  name="Setting"
                  focused={focused}
                />
              ),
            }}
          /> */}
        </Tabs>
      </>
    );
  }

  if (newUser.userType === "Family_Member") {
    return (
      <>
        <Tabs
          screenOptions={{
            tabBarShowLabel: false,
            tabBarActiveTintColor: "#fafbfb",
            tabBarInactiveTintColor: "#fafbfb",
            tabBarStyle: {
              backgroundColor: "#0b4dad",
              borderTopWidth: 1,
              borderTopColor: "#0b4dad",
              height: 80,
              elevation: 8,
              borderRadius: 20,
              marginHorizontal: 1,
              marginBottom: 10,
            },
          }}
        >
          <Tabs.Screen
            name="home"
            options={{
              title: "Home",
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={icons.home}
                  color={color}
                  name="Home"
                  focused={focused}
                />
              ),
            }}
          />

          <Tabs.Screen
            name="booking"
            options={{
              title: "Booking",
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={icons.booking}
                  color={color}
                  name="Booking"
                  focused={focused}
                />
              ),
            }}
          />

          <Tabs.Screen
            name="notification"
            options={{
              title: "Alerts",
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={icons.notification_icon}
                  color={color}
                  name="Alerts"
                  focused={focused}
                />
              ),
            }}
          />

          {/* <Tabs.Screen
            name="setting"
            options={{
              title: "setting",
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={icons.setting}
                  color={color}
                  name="Setting"
                  focused={focused}
                />
              ),
            }}
          /> */}
        </Tabs>
      </>
    );
  }
};

export default TabsLayout;
