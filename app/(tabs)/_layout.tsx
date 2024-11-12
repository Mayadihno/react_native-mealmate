import { Tabs } from "expo-router";
import {
  AntDesign,
  Entypo,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";
import color from "@/theme/app.colors";

export default function _layout() {
  return (
    <Tabs
      screenOptions={({ route }) => {
        return {
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => {
            let iconName;
            if (route.name === "home") {
              if (focused) {
                iconName = (
                  <Ionicons name="home" color={color.buttonBg} size={26} />
                );
              } else {
                iconName = (
                  <MaterialCommunityIcons
                    color={"#8F8F8F"}
                    name="home"
                    size={26}
                  />
                );
              }
            } else if (route.name === "cart") {
              iconName = (
                <MaterialCommunityIcons
                  name="cart"
                  color={focused ? color.buttonBg : "#8F8F8F"}
                  size={26}
                />
              );
            } else if (route.name === "profile") {
              if (focused) {
                iconName = (
                  <Entypo color={color.buttonBg} name="user" size={26} />
                );
              } else {
                iconName = (
                  <AntDesign name="user" size={26} color={"#8F8F8F"} />
                );
              }
            }
            return iconName;
          },
        };
      }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="cart" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
