import { Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import Logo from "@/components/logo/Logo";
import Input from "@/components/common/input";
import Button from "@/components/common/button";
import color from "@/theme/app.colors";
import { router } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/config/firebaseConfig";
import { Toast } from "react-native-toast-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const [formData, setFormData] = useState({
    password: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const handleChange = (key: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    if (formData.email === "" || formData.password === "") {
      setShowWarning(true);
      return;
    }
    try {
      const usersData = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const accessToken = await usersData.user.getIdToken();
      await AsyncStorage.setItem("accessToken", accessToken);
      await AsyncStorage.setItem(
        "userData",
        JSON.stringify(usersData.user.providerData)
      );
      router.push("/(tabs)/home");
    } catch (error: any) {
      if (error.code === "auth/wrong-password" || "auth/user-not-found") {
        Toast.show("Incorrect Email or Password", {
          type: "danger",
        });
      }
    }
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 10,
      }}
    >
      <View style={{ paddingBottom: 30 }}>
        <Logo fontSize={40} />
      </View>
      <View style={{ width: "90%" }}>
        <Input
          title="Email"
          placeholder="Enter your email"
          value={formData?.email}
          onChangeText={(text) => handleChange("email", text)}
          showWarning={showWarning && formData.email === ""}
          warning={"Please enter your email!"}
        />
        <Input
          title="Password"
          placeholder="Enter your password"
          warning={"Please enter your password!"}
          onChangeText={(text) => handleChange("password", text)}
          showWarning={showWarning && formData.password === ""}
          isPasswordVisible={true}
        />
        <View style={{ marginTop: 20 }}>
          <Button
            onPress={handleSubmit}
            title="Login"
            disabled={loading}
            backgroundColor={color.buttonBg}
            textColor={color.whiteColor}
          />
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          marginTop: 15,
        }}
      >
        <Text style={{ fontSize: 15, paddingRight: 5 }}>
          Don't have an account?
        </Text>
        <TouchableOpacity onPress={() => router.push("/(routes)/register")}>
          <Text style={{ fontSize: 16, textDecorationLine: "underline" }}>
            Sign In
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
