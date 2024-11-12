import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import color from "@/theme/app.colors";
import { windowHeight } from "@/theme/app.contants";
import { categdata } from "@/utils/data";
import { useDispatch, useSelector } from "react-redux";
import { addItemToMealPlan, MealState } from "@/redux/mealReducer";
import { Toast } from "react-native-toast-notifications";
import { router } from "expo-router";
const productWidth = Dimensions.get("screen").width / 2 - 20;
export default function Categories() {
  const [data, setData] = useState([]);
  const [fetchNumber, setFetchNumber] = useState(12);
  const [active, setActive] = useState("");
  const cart = useSelector((state: MealState) => state.meal.meal);
  const dispatch = useDispatch();
  const handleCategories = async (text: string) => {
    setActive(text);
    const api = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.EXPO_PUBLIC_SERVER_URI}&query=${text}`
    );
    const data = await api.json();
    setData(data?.results);
  };

  const getRecipes = async (number: number) => {
    const api = await fetch(
      `https://api.spoonacular.com/recipes/random?number=${number}&apiKey=${process.env.EXPO_PUBLIC_SERVER_URI}`
    );
    const data = await api.json();
    setData(data.recipes);
  };
  useEffect(() => {
    if (process.env.NODE_ENV !== "development" || !data?.length) {
      getRecipes(fetchNumber);
    }
  }, [fetchNumber]);

  const addToCart = (items: any) => {
    const findItem = cart.find((item) => item.id === items.id);
    if (findItem) {
      Toast.show("Meal already added to cart", {
        type: "warning",
      });
    } else {
      dispatch(addItemToMealPlan(items));
      Toast.show("Meal added to cart", {
        type: "success",
      });
    }
  };

  return (
    <View>
      <View style={styles.container}>
        <Text
          style={{
            fontFamily: "TT-Octosquares-Medium",
            fontSize: windowHeight(22),
            color: "#fff",
            textAlign: "left",
          }}
        >
          Categories
        </Text>
        <Pressable>
          <Text
            style={{
              fontFamily: "TT-Octosquares-Medium",
              fontSize: windowHeight(15),
              color: "#fff",
              textAlign: "left",
            }}
          >
            See all
          </Text>
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 5 }}
        style={{ marginTop: 4 }}
      >
        {categdata.map((item) => {
          return (
            <Pressable
              key={item.id}
              onPress={() => handleCategories(item.text)}
            >
              <View
                style={[
                  styles.catContainer,
                  item.text === active && { backgroundColor: color.buttonBg },
                ]}
              >
                <Text
                  style={[
                    styles.title,
                    item.text === active && { color: color.whiteColor },
                  ]}
                >
                  {item.title}
                </Text>
                <Text
                  style={[
                    styles.text,
                    item.text === active && { color: color.whiteColor },
                  ]}
                >
                  {item.text}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "white",
          borderWidth: 7,
          borderColor: "white",
          flexWrap: "wrap",
        }}
      >
        {data?.map((item: any, index) => {
          const isInCart = cart.some((cartItem) => cartItem.id === item.id);
          return (
            <View
              style={{
                backgroundColor: color.lightGray,
                width: productWidth,
                height: 230,
                borderRadius: 10,
                marginTop: 15,
                elevation: 10,
              }}
              key={index}
            >
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/(routes)/details",
                    params: { id: item.id },
                  })
                }
              >
                <View>
                  <Image
                    source={{ uri: item.image }}
                    style={{
                      width: productWidth,
                      height: 160,
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
                    }}
                    resizeMode="cover"
                  />
                </View>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 16,
                    marginTop: 3,
                    paddingLeft: 4,
                    fontFamily: "gt-medium",
                  }}
                >
                  {item.title}
                </Text>
              </Pressable>
              <View>
                <Pressable
                  style={{
                    backgroundColor: isInCart ? color.alertRed : color.buttonBg,
                    padding: 5,
                    marginTop: 15,
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                  }}
                  onPress={() => addToCart(item)}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: "TT-Octosquares-Medium",
                      fontWeight: "bold",
                      textAlign: "center",
                      color: "#fff",
                    }}
                  >
                    {isInCart ? "Added to meal plan" : "Add to meal plan"}
                  </Text>
                </Pressable>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.buttonBg,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  catContainer: {
    backgroundColor: color.border,
    padding: 5,
    borderRadius: 50,
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    fontFamily: "gt-bold",
  },
  text: {
    fontSize: 12,
    fontWeight: "400",
    fontFamily: "gt-medium",
  },
});
