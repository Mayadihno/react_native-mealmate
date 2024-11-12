import { View, Text, StyleSheet } from "react-native";
import React from "react";
import color from "@/theme/app.colors";
import { windowHeight, windowWidth } from "@/theme/app.contants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { external } from "@/styles/external.style";

interface LogoProps {
  size?: number;
  fontSize?: number;
}
export default function Logo({ size, fontSize }: LogoProps) {
  return (
    <View>
      <View style={[external.p_5, external.ph_20]}>
        <Text
          style={{
            fontFamily: "TT-Octosquares-Medium",
            fontSize: fontSize,
          }}
        >
          MealMate
        </Text>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginLeft: -20,
            marginTop: 3,
          }}
        ></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  transformLine: {
    transform: [{ rotate: "49deg" }],
    height: windowHeight(50),
    width: windowWidth(120),
    position: "absolute",
    left: windowWidth(1),
    top: windowHeight(10),
  },
  transformLine1: {
    transform: [{ rotate: "227deg" }],
    height: windowHeight(50),
    width: windowWidth(120),
    position: "absolute",
    left: windowWidth(105),
    top: windowHeight(-55),
  },
});
