import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import color from "@/theme/app.colors";
import { external } from "@/styles/external.style";
import { windowHeight, windowWidth } from "@/theme/app.contants";
import Button from "../../components/common/button";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import Images from "@/utils/images";

export default function Onboarding() {
  const handlePress = () => {
    router.push("/(routes)/slider");
  };
  return (
    <>
      <StatusBar backgroundColor={color.buttonBg} />
      <View style={{ flex: 1, backgroundColor: color.lightGray }}>
        <View
          style={[
            external.mt_50,
            {
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <View style={[external.ph_20]}>
            <Text
              style={{
                fontFamily: "TT-Octosquares-Medium",
                fontSize: 60,
              }}
            >
              MealMate
            </Text>
          </View>
          <View style={{ paddingVertical: 30 }}>
            <Image
              style={{ resizeMode: "contain", width: 500, height: 500 }}
              source={Images.image1}
            />
          </View>
          <View style={[external.mt_20, external.Pb_15]}>
            <Button
              backgroundColor={color.buttonBg}
              onPress={handlePress}
              title="Get Started"
              textColor={color.whiteColor}
              width={windowWidth(200)}
            />
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  transformLine: {
    transform: [{ rotate: "45deg" }],
    height: windowHeight(50),
    width: windowWidth(120),
    position: "absolute",
    left: windowWidth(300),
    top: windowHeight(-5),
  },
  transformLine1: {
    transform: [{ rotate: "227deg" }],
    height: windowHeight(50),
    width: windowWidth(120),
    position: "absolute",
    left: windowWidth(30),
    top: windowHeight(-40),
  },
});
