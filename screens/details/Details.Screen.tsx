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
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import color from "@/theme/app.colors";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { Toast } from "react-native-toast-notifications";
import { useDispatch, useSelector } from "react-redux";
import { addItemToMealPlan, MealState } from "@/redux/mealReducer";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";

const width = Dimensions.get("screen").width;
export default function DetailScreen() {
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState<any>(null);
  const [active, setActive] = useState(false);
  const cart = useSelector((state: MealState) => state.meal.meal);
  const dispatch = useDispatch();

  const fetchFromSpoonacular = async (recipeId: string) => {
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${process.env.EXPO_PUBLIC_SERVER_URI}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch recipe data from Spoonacular.");
      }
      const data = await response.json();
      setRecipe(data);
    } catch (error) {
      console.error("Error fetching from Spoonacular:", error);
      Toast.show("Failed to load recipe data", { type: "danger" });
    }
  };

  const fetchFromFirebase = async (recipeId: string) => {
    try {
      const docRef = doc(db, "recipes", recipeId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setRecipe(data);
      } else {
        // If not in Firebase, try fetching from Spoonacular
        fetchFromSpoonacular(recipeId);
      }
    } catch (error) {
      console.error("Error fetching from Firebase:", error);
      Toast.show("Failed to load recipe data", { type: "danger" });
    }
  };

  useEffect(() => {
    if (id) {
      fetchFromFirebase(id as string);
    }
  }, [id]);

  useEffect(() => {
    if (recipe && cart.some((item) => item.id === recipe.id)) {
      setActive(true);
    }
  }, [recipe, cart]);

  const addToCart = (items: any) => {
    const findItem = cart.find((item) => item.id === items.id);
    if (findItem) {
      Toast.show("Meal already added to cart", {
        type: "warning",
      });
      return;
    } else {
      const item = {
        id: items.id,
        title: items.title,
        ingredients: items.ingredients,
        imageUri: items.imageUri || items.image,
        instructions: items.instructions,
        quantity: 1,
      };
      dispatch(addItemToMealPlan(item));
      Toast.show("Meal added to cart", {
        type: "success",
      });
    }
  };
  return (
    <>
      <StatusBar backgroundColor={color.lightGray} style="dark" />
      <View style={styles.container}>
        {recipe ? (
          <>
            <ScrollView>
              <View style={{ position: "relative" }}>
                <Image
                  source={{ uri: recipe.image || recipe.imageUri }}
                  style={styles.recipeImage}
                  resizeMode="cover"
                />
                <View style={styles.iconContainer}>
                  <Pressable
                    style={styles.iconButton}
                    onPress={() => router.back()}
                  >
                    <MaterialCommunityIcons
                      name="less-than"
                      size={20}
                      color={color.price}
                    />
                  </Pressable>
                  <Pressable style={styles.iconButton}>
                    <AntDesign name="hearto" size={20} color={color.price} />
                  </Pressable>
                </View>
              </View>
              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContent}
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.title}>{recipe.title}</Text>
                <Text style={styles.cookingTime}>
                  Cooking Minutes: {recipe.cookingMinutes || 45}
                </Text>
                <Text style={styles.sectionTitle}>Ingredients</Text>
                <View style={styles.ingredientsContainer}>
                  {recipe.extendedIngredients &&
                    recipe.extendedIngredients.map(
                      (item: any, index: number) => (
                        <View key={item.id} style={styles.ingredientItem}>
                          <Text style={styles.ingredientName}>
                            {item.name}:
                          </Text>
                          <Text style={styles.ingredientAmount}>
                            {item.measures.metric.amount}
                            {item.measures.metric.unitShort}
                          </Text>
                          {index < recipe.extendedIngredients.length - 1 && (
                            <Text style={styles.comma}> , </Text>
                          )}
                        </View>
                      )
                    )}
                  {recipe.ingredients &&
                    recipe.ingredients.map((item: any, index: number) => (
                      <View key={index} style={styles.ingredientItem}>
                        <Text style={styles.ingredientName}>{item.name}:</Text>
                        <Text style={styles.ingredientAmount}>
                          {item.quantity}
                        </Text>
                        {index < recipe.ingredients.length - 1 && (
                          <Text style={styles.comma}> , </Text>
                        )}
                      </View>
                    ))}
                </View>
                <View style={styles.instructionsContainer}>
                  <Text style={styles.sectionTitle}>Instructions</Text>
                  {recipe?.instructions && (
                    <Text style={styles.summary}>{recipe?.instructions}</Text>
                  )}
                </View>
              </ScrollView>
            </ScrollView>
            <Pressable
              style={{
                backgroundColor: active ? color.alertRed : color.buttonBg,
                padding: 10,
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                marginHorizontal: 30,
              }}
              onPress={() => addToCart(recipe)}
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
                {active ? "Added to meal plan" : "Add to meal plan"}
              </Text>
            </Pressable>
          </>
        ) : (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 300,
            }}
          >
            <Text style={styles.loadingText}>Loading recipe details...</Text>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
  },
  recipeImage: {
    width: width,
    height: 350,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
  },
  iconContainer: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    top: 15,
    left: 15,
    right: 15,
    alignItems: "center",
  },
  iconButton: {
    backgroundColor: color.notificationColor,
    padding: 5,
    borderRadius: 40,
  },
  scrollView: {
    marginHorizontal: 20,
    marginVertical: 20,
  },
  scrollViewContent: {
    paddingBottom: 30,
  },
  title: {
    fontSize: 28,
    fontFamily: "gt-bold",
  },
  cookingTime: {
    paddingTop: 10,
    fontSize: 20,
    fontFamily: "gt-medium",
  },
  sectionTitle: {
    fontSize: 20,
    paddingTop: 10,
    paddingBottom: 5,
    fontFamily: "gt-medium",
    fontWeight: "700",
  },
  ingredientsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    width: width,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 5,
  },
  ingredientName: {
    fontSize: 18,
    fontWeight: "600",
    textTransform: "capitalize",
    fontFamily: "gt-medium",
  },
  ingredientAmount: {
    paddingLeft: 2,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "gt-regular",
  },
  comma: {
    fontSize: 16,
    fontWeight: "600",
  },
  instructionsContainer: {
    marginTop: 15,
  },
  summary: {
    fontSize: 16,
    fontWeight: "500",
  },
  loadingText: {
    fontSize: 20,
    color: color.darkBorder,
    fontFamily: "gt-bold",
    fontWeight: "900",
  },
});
