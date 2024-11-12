import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { external } from "@/styles/external.style";
import { windowHeight } from "@/theme/app.contants";
import Header from "@/components/header/Header";
import color from "@/theme/app.colors";
import { StatusBar } from "expo-status-bar";
import Carousel from "@/components/carousel/Carousel";
import Categories from "@/components/categories/Categories";
import MyMealPlan from "@/components/mymealplan/MyMealPlan";
import { router } from "expo-router";

export default function HomeScreen() {
  const [searchData, setSearchData] = useState<Recipe[] | null>([]);
  return (
    <>
      <StatusBar backgroundColor={color.lightGray} style="dark" />
      <View style={[external.fx_1]}>
        <View style={{ paddingBottom: windowHeight(10) }}></View>
        <Header setSearchData={setSearchData} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.carouselContainer}>
              <Carousel />

              {searchData && searchData.length !== 0 ? (
                <View style={styles.overlay}>
                  {searchData.map((item, index) => (
                    <View key={index} style={styles.resultItem}>
                      <Pressable
                        onPress={() =>
                          router.push({
                            pathname: "/(routes)/details",
                            params: { id: item.id },
                          })
                        }
                      >
                        <Image
                          source={{ uri: item.imageUri }}
                          style={styles.resultImage}
                        />
                        <Text style={styles.resultText}>{item.title}</Text>
                      </Pressable>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          </ScrollView>
          <MyMealPlan />
          <Categories />
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  carouselContainer: {
    position: "relative",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Slightly transparent overlay
    zIndex: 10,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  resultImage: {
    width: 40,
    height: 40,
    marginRight: 10,
    resizeMode: "cover",
  },
  resultText: {
    fontSize: 16,
    color: "#333",
  },
});
