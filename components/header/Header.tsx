import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import color from "@/theme/app.colors";
import { windowWidth, windowHeight, fontSizes } from "@/theme/app.contants";
import fonts from "@/theme/app.fonts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";

interface UserData {
  photoURL: string;
  displayName: string;
  email: string;
}

interface Recipe {
  title: string;
  imageUri: string;
  name: string;
  id: string;
}

interface HeaderProps {
  setSearchData: any;
}

export default function Header({ setSearchData }: HeaderProps) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [bgImg, setBgImg] = useState<string>(
    "https://png.pngtree.com/png-vector/20230831/ourmid/pngtree-man-avatar-image-for-profile-png-image_9197911.png"
  );
  const [search, setSearch] = useState("");
  const [data, setData] = useState<Recipe[] | null>(null);

  const currentHour = new Date().getHours();
  let greeting = "";

  if (currentHour >= 0 && currentHour < 12) {
    greeting = "Good morning";
  } else if (currentHour >= 12 && currentHour < 18) {
    greeting = "Good afternoon";
  } else {
    greeting = "Good evening";
  }

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem("userData");

        if (storedUserData) {
          setUserData(JSON.parse(storedUserData)[0]);
        }
      } catch (error) {
        console.log("Failed to load user data:", error);
      }
    };

    loadUserData();
  }, []);

  const getRecipesList = async () => {
    const collectionRef = collection(db, "recipes");
    const q = query(collectionRef);
    const querySnapshot = await getDocs(q);
    const queryData = querySnapshot.docs.map((doc) => doc.data());
    setData(queryData as Recipe[]);
  };

  useEffect(() => {
    getRecipesList();
  }, []);

  const handleSearchData = async (text: string) => {
    setSearch(text);

    if (text.trim() === "") {
      return setSearchData([]);
    }

    if (data) {
      const filteredProducts = data.filter((product) =>
        product.title.toLowerCase().includes(text.toLowerCase())
      );

      try {
        const apiResponse = await fetch(
          `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.EXPO_PUBLIC_SERVER_URI}&query=${text}`
        );
        const apiData = await apiResponse.json();
        const apiResults = apiData.results || [];

        const combinedResults = [
          ...filteredProducts,
          ...apiResults.map((item: any) => ({
            title: item.title,
            imageUri: item.image,
            id: item.id,
          })),
        ];

        setSearchData(combinedResults);
      } catch (error) {
        console.error("Error fetching from API:", error);
        setSearchData(filteredProducts);
      }
    } else {
      // setSearchData([]);
    }
  };

  return (
    <View style={styles.headerMain}>
      <View style={styles.headerMargin}>
        <View style={styles.headerAlign}>
          <View style={styles.userInfoContainer}>
            {userData?.photoURL ? (
              <Image
                source={{ uri: userData.photoURL }}
                style={styles.imageStyle}
              />
            ) : (
              <Image
                source={{ uri: bgImg }}
                style={[styles.imageStyle, { width: 80 }]}
              />
            )}
            <View style={{ paddingLeft: 5 }}>
              <Text style={styles.greetingText}>{greeting},</Text>
              <View style={styles.nameContainer}>
                <Text style={styles.valueTitle}>{userData?.displayName}</Text>
                <MaterialIcons name="verified" size={24} color="#1DA1F2" />
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationIcon} activeOpacity={0.5}>
            <Ionicons name="notifications" size={24} color={color.whiteColor} />
          </TouchableOpacity>
        </View>
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search"
            value={search}
            onChangeText={handleSearchData}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerMain: {
    backgroundColor: color.buttonBg,
    paddingHorizontal: windowWidth(10),
    paddingTop: windowHeight(15),
    width: "100%",
    height: windowHeight(120),
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerMargin: {
    marginHorizontal: windowWidth(10),
    marginTop: windowHeight(10),
  },
  headerAlign: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: windowHeight(3),
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  imageStyle: {
    width: 60,
    height: 60,
    resizeMode: "cover",
    borderRadius: 100,
  },
  greetingText: {
    paddingBottom: 3,
    fontWeight: "bold",
    fontSize: fontSizes.FONT18,
    color: color.whiteColor,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationIcon: {
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    padding: 6,
    backgroundColor: color.bgDark,
    borderColor: color.border,
    elevation: 4,
  },
  searchContainer: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: color.lightGray,
    borderRadius: 10,
    marginTop: 10,
  },
  searchResults: {
    minHeight: windowHeight(30),
    backgroundColor: "#f8f8f8",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    padding: 10,
    position: "absolute",
    top: windowHeight(120),
    left: 0,
    right: 0,
    zIndex: 9999,
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
  valueTitle: {
    fontFamily: "TT-Octosquares-Medium",
    fontSize: 17,
    color: color.lightGray,
  },
});
