import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { windowHeight } from "@/theme/app.contants";
import color from "@/theme/app.colors";
import { auth, db } from "@/config/firebaseConfig";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { UserData } from "@/screens/profile/Profile.Screen";
import { useDispatch, useSelector } from "react-redux";
import { addItemToMealPlan, MealState } from "@/redux/mealReducer";
import { Toast } from "react-native-toast-notifications";
import { router } from "expo-router";
const productWidth = Dimensions.get("screen").width / 2 - 20;
export default function MyMealPlan() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [data, setData] = useState<Recipe[] | null>(null);
  const cart = useSelector((state: MealState) => state.meal.meal);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const userRef = doc(db, "mealUser", user.uid);
        const unsubscribeFirestore = onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
            setUserData(doc.data() as UserData);
          } else {
            console.warn("User document does not exist");
          }
        });
        return () => unsubscribeFirestore();
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const userId = userData?.uid;

  const getRecipesList = async () => {
    if (userId !== "") {
      const collectionRef = collection(db, "recipes");
      const q = query(collectionRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const queryData = querySnapshot.docs.map((doc) => doc.data());
      setData(queryData as Recipe[]);
    }
  };

  useEffect(() => {
    if (userId) {
      getRecipesList();
    }
  }, [userId]);

  const addToCart = (items: any) => {
    const findItem = cart.find((item) => item.id === items.id);
    if (findItem) {
      Toast.show("Meal already added to cart", {
        type: "warning",
      });
    } else {
      const item = {
        id: items.id,
        title: items.title,
        ingredients: items.ingredients,
        imageUri: items.imageUri,
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
    <View>
      {data && data?.length > 0 && (
        <>
          <View style={styles.container}>
            <Text
              style={{
                fontFamily: "TT-Octosquares-Medium",
                fontSize: windowHeight(22),
                color: "#fff",
                textAlign: "left",
              }}
            >
              My meal Plan
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
                        source={{ uri: item?.imageUri, cache: "reload" }}
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
                        backgroundColor: isInCart
                          ? color.alertRed
                          : color.buttonBg,
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
        </>
      )}
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
