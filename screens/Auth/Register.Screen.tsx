import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import Logo from "@/components/logo/Logo";
import Input from "@/components/common/input";
import Button from "@/components/common/button";
import color from "@/theme/app.colors";
import { router } from "expo-router";
import SelectInput from "@/components/common/select";
import { diet } from "@/components/slides/slides";
import * as ImagePicker from "expo-image-picker";
import { Toast } from "react-native-toast-notifications";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../../config/firebaseConfig";

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    password: "",
    email: "",
    confirmPassword: "",
    phoneNumber: "",
    image: "",
    dietary: "",
    fullName: "",
  });
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const handleChange = (key: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };
  const storage = getStorage();
  const pickImage = async () => {
    // Ask for permission to access images
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Toast.show("You've refused to allow this app to access your photos!");
      return;
    }

    // Open image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      //   allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Convert image URI to Blob
  const uriToBlob = async (uri: string) => {
    const response = await fetch(uri);
    return await response.blob();
  };

  const handleSubmit = async () => {
    setShowWarning(false);

    // Basic validation
    if (!formData.email || !formData.password || !formData.fullName) {
      setShowWarning(true);
      Toast.show("Please fill in all required fields.", { type: "danger" });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      Toast.show("Passwords do not match", { type: "danger" });
      return;
    }

    try {
      setLoading(true);
      // Upload the image if provided
      let imageUrl = null;
      if (image) {
        imageUrl = await uploadImageAsync(image);
        if (!imageUrl) throw new Error("Image upload failed");
      }

      // Register the user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Update Firebase profile with additional info
      await updateProfile(auth.currentUser!, {
        displayName: formData.fullName,
        photoURL: imageUrl || null,
      });

      // Prepare data for Firestore, excluding password fields
      const { password, confirmPassword, ...userDocData } = {
        ...formData,
        image: imageUrl,
        uid: user.uid,
        timestamp: Date.now(),
      };
      await setDoc(doc(db, "mealUser", user.uid), userDocData);
      Toast.show("Account created successfully!", { type: "success" });
      setLoading(false);
      router.push("/(routes)/login");
    } catch (error: any) {
      console.error("Error creating account:", error);
      Toast.show(error.message || "Account creation failed", {
        type: "danger",
      });
      setLoading(false);
    }
  };

  // Separate function to handle image upload
  const uploadImageAsync = async (uri: string) => {
    try {
      const blob = await uriToBlob(uri);
      if (!blob) {
        throw new Error("Failed to create blob from URI.");
      }
      const storageRef = ref(storage, `images/${Date.now()}_${formData.email}`);
      const uploadTask = uploadBytesResumable(storageRef, blob);
      // Monitor the upload progress
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error("Upload failed:", error);
          throw error;
        }
      );

      // Await upload completion
      await uploadTask;
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("Image upload error:", error);
      Toast.show("Image upload failed", { type: "danger" });
      return null;
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ marginBottom: 40, marginTop: 30 }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 10,
        }}
      >
        <View style={{ paddingBottom: 10 }}>
          <Logo fontSize={40} />
        </View>
        <View style={{ width: "80%" }}>
          <Input
            title="Full Name"
            placeholder="Enter your fullname"
            value={formData?.fullName}
            onChangeText={(text) => handleChange("fullName", text)}
            showWarning={showWarning && formData.email === ""}
            warning={"Please enter your fullname!"}
          />
          <Input
            title="Email"
            placeholder="Enter your email"
            value={formData?.email}
            onChangeText={(text) => handleChange("email", text)}
            showWarning={showWarning && formData.email === ""}
            warning={"Please enter your email!"}
          />
          <Input
            title="Phone Number"
            placeholder="Enter your phone number"
            value={formData?.phoneNumber}
            onChangeText={(text) => handleChange("phoneNumber", text)}
            showWarning={showWarning && formData.phoneNumber === ""}
            warning={"Please enter your phone number!"}
          />
          <SelectInput
            title="Dietary Preferences"
            placeholder="Please select Dietary Preferences"
            value={formData.dietary}
            onValueChange={(text) => handleChange("dietary", text)}
            showWarning={showWarning && formData.dietary === ""}
            items={diet}
          />

          <Input
            title="Password"
            placeholder="Enter your password"
            warning={"Please enter your password!"}
            onChangeText={(text) => handleChange("password", text)}
            showWarning={showWarning && formData.password === ""}
            isPasswordVisible={true}
          />
          <Input
            title="Confirm Password"
            placeholder="Enter confirm password"
            warning={"Please enterconfirm password!"}
            onChangeText={(text) => handleChange("confirmPassword", text)}
            showWarning={showWarning && formData.confirmPassword === ""}
            isPasswordVisible={true}
          />
          <View style={styles.container}>
            <TouchableOpacity onPress={pickImage} style={styles.textInput}>
              <Text style={styles.placeholder}>
                {image ? "Image Selected" : "Tap to select an image"}
              </Text>
            </TouchableOpacity>

            {image && <Image source={{ uri: image }} style={styles.image} />}
          </View>

          <View style={{ marginTop: 20 }}>
            <Button
              onPress={handleSubmit}
              title="Create Account"
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
            marginBottom: 10,
          }}
        >
          <Text style={{ fontSize: 15, paddingRight: 5 }}>
            Already have an account?
          </Text>
          <TouchableOpacity onPress={() => router.push("/(routes)/login")}>
            <Text style={{ fontSize: 16, textDecorationLine: "underline" }}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  textInput: {
    borderColor: color.darkBorder,
    borderWidth: 1,
    borderRadius: 5,
    width: "100%",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  placeholder: {
    color: "gray",
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    marginTop: 5,
    borderRadius: 100,
  },
});
