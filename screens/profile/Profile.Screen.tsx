import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "@/config/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Toast } from "react-native-toast-notifications";
import { StatusBar } from "expo-status-bar";
import color from "@/theme/app.colors";
import Button from "@/components/common/button";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { MaterialIcons } from "@expo/vector-icons";
import { windowHeight } from "@/theme/app.contants";
import MealPlan from "../mealPlan/MealPlan";

const width = Dimensions.get("screen").width;
export interface UserData {
  image: string;
  fullName: string;
  email: string;
  uid: string;
  dietary: string;
  phoneNumber: string;
}
export default function ProfileScreen() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [bgImg, setBgImg] = useState<string>(
    "https://png.pngtree.com/png-vector/20230831/ourmid/pngtree-man-avatar-image-for-profile-png-image_9197911.png"
  );
  const [data, setData] = useState<Recipe[] | null>(null);

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem("accessToken");
      router.navigate("/(routes)/onboarding");
      Toast.show("Logout successfully!", { type: "success" });
    } catch (error) {
      console.error("Logout failed:", error);
      Toast.show("Failed to logout. Please try again.", { type: "danger" });
    }
  }, []);

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
  const createRecipe = () => {
    router.push({
      pathname: "/(routes)/create-recipe",
      params: { userId: userId! },
    });
  };

  return (
    <View>
      <StatusBar backgroundColor={color.lightGray} style="dark" />
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 30,
            marginHorizontal: 10,
          }}
        >
          <Button
            backgroundColor={color.darkPrimary}
            textColor="#fff"
            title="Logout"
            onPress={handleLogout}
            width={80}
          />
          <Button
            backgroundColor={color.greenColor}
            textColor="#fff"
            title="Create Meal Plan"
            width={120}
            onPress={createRecipe}
          />
        </View>
        <View style={styles.containerBg}>
          <View
            style={{
              alignItems: "center",
              marginTop: -50,
            }}
          >
            {userData?.image ? (
              <Image
                source={{ uri: userData.image }}
                style={styles.imageStyle}
              />
            ) : (
              <Image source={{ uri: bgImg }} style={styles.imageStyle} />
            )}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingTop: 5,
              }}
            >
              <Text style={styles.valueTitle}>{userData?.fullName}</Text>
              <MaterialIcons name="verified" size={24} color={"#1DA1F2"} />
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingTop: 30,
            }}
          >
            <View style={{ flexDirection: "column" }}>
              <Text style={styles.title}>Phone Number</Text>
              <Text style={styles.value}>{userData?.phoneNumber}</Text>
            </View>
            <View style={{ flexDirection: "column" }}>
              <Text style={styles.title}>Email</Text>
              <Text style={styles.value}>{userData?.email}</Text>
            </View>
            <View style={{ flexDirection: "column" }}>
              <Text style={styles.title}>Dietary</Text>
              <Text style={styles.value}>{userData?.dietary}</Text>
            </View>
          </View>
        </View>
        <ScrollView
          style={{ paddingHorizontal: 16, marginTop: 20 }}
          showsHorizontalScrollIndicator={false}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 25, fontFamily: "gt-bold" }}>
              My meal plan
            </Text>
            <Text style={{ fontSize: 20, fontFamily: "gt-medium" }}>
              View all
            </Text>
          </View>
          {data && data?.length > 0 ? (
            <MealPlan data={data} setData={setData} />
          ) : (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 80,
              }}
            >
              <Text
                style={{
                  fontSize: 30,
                  fontFamily: "TT-Octosquares-Medium",
                  textAlign: "center",
                  paddingBottom: 30,
                }}
              >
                You don't have any meal plan now!!
              </Text>
              <Button
                backgroundColor={color.buttonBg}
                textColor="#fff"
                title="Create Meal Plan"
                width={150}
                onPress={createRecipe}
              />
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 35,
  },
  containerBg: {
    backgroundColor: color.buttonBg,
    height: 175,
    width: width,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: "relative",
    marginTop: 30,
  },
  imageStyle: {
    width: 120,
    height: 120,
    resizeMode: "cover",
    borderRadius: 20,
    borderWidth: 6,
    borderColor: color.border,
  },
  valueTitle: {
    fontFamily: "gt-bold",
    fontSize: windowHeight(15),
    color: color.lightGray,
  },
  title: {
    fontFamily: "gt-medium",
    fontSize: windowHeight(15),
    color: color.lightGray,
  },
  value: {
    fontFamily: "gt-regular",
    fontSize: windowHeight(13),
    color: color.border,
    marginTop: 3,
  },
});
