import { Image, Text, View } from "react-native";
import React from "react";
import color from "@/theme/app.colors";
import Swiper from "react-native-swiper";
import { styles } from "./style";
import { slides } from "@/components/slides/slides";
import { windowWidth } from "@/theme/app.contants";
import Button from "@/components/common/button";
import { router } from "expo-router";
export default function SliderScreen() {
  const handlePress = () => {
    router.push("/(routes)/login");
  };
  return (
    <>
      <View style={{ flex: 1, backgroundColor: color.whiteColor }}>
        <Swiper
          activeDotStyle={styles.activeStyle}
          removeClippedSubviews={true}
          paginationStyle={styles.paginationStyle}
        >
          {slides.map((silde: any, index: number) => (
            <View style={[styles.slideContainer]} key={index}>
              <Image style={styles.imageBackground} source={silde.image} />
              <View>
                <Text style={styles.title}>{silde.text}</Text>
                <Text style={styles.description}>{silde.description}</Text>
              </View>
            </View>
          ))}
        </Swiper>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 50,
          }}
        >
          <Button
            backgroundColor={color.buttonBg}
            onPress={handlePress}
            title="Continue"
            textColor={color.whiteColor}
            width={windowWidth(150)}
          />
        </View>
      </View>
    </>
  );
}
