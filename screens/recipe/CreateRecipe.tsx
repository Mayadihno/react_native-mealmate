import { Image, ScrollView, StyleSheet, View, Text } from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import color from "@/theme/app.colors";
import { TextInput, Button } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import * as ImagePicker from "expo-image-picker";
import { Toast } from "react-native-toast-notifications";
import SelectInput from "@/components/common/select";
import { diet } from "@/components/slides/slides";
import { router, useLocalSearchParams } from "expo-router";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

interface Ingredient {
  name: string;
  quantity: string;
  [key: string]: string;
}

export default function CreateRecipe() {
  const { userId } = useLocalSearchParams();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [ingredients, setIngredients] = useState([{ name: "", quantity: "" }]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const storage = getStorage();
  // Validation schema
  const schema = Yup.object().shape({
    title: Yup.string().required("Recipe name is required"),
    cookingMinutes: Yup.string().required("Recipe name is required"),
    ingredients: Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string().required("Ingredient name is required"),
          quantity: Yup.string().required("Quantity is required"),
        })
      )
      .min(1, "At least one ingredient is required"),
    instructions: Yup.string().required("Instructions are required"),
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Add new ingredient field
  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "" }]);
  };

  // Handle ingredient input change
  const handleIngredientChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedIngredients: Ingredient[] = [...ingredients];
    updatedIngredients[index][field] = value;
    setIngredients(updatedIngredients);
  };

  // Function to pick an image
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Toast.show("You've refused to allow this app to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const onSubmit = async (data: any) => {
    if (!imageUri) {
      Toast.show("Please select recipe image", {
        type: "danger",
      });
    }
    if (!imageUri || !category) {
      setErrorMsg("Please fill the field before you creat the recipe");
      return;
    }

    try {
      setLoading(true);
      let imageUrl = null;
      if (imageUri) {
        imageUrl = await uploadImageAsync(imageUri);
        if (!imageUrl) throw new Error("Image upload failed");
      }
      const formData = {
        ...data,
        imageUri: imageUrl,
        category,
        ingredients,
        userId,
        timeStamp: serverTimestamp(),
        id: `${Date.now()}`,
      };
      await setDoc(doc(db, "recipes", `${Date.now()}`), formData);
      setLoading(false);
      router.push("/(tabs)/profile");
    } catch (error) {
      setLoading(false);
      Toast.show(`Failed to create recipe. Try again later`, {
        type: "danger",
      });
    }
  };

  // Convert image URI to Blob
  const uriToBlob = async (uri: string) => {
    const response = await fetch(uri);
    return await response.blob();
  };

  const uploadImageAsync = async (uri: string) => {
    try {
      const blob = await uriToBlob(uri);
      if (!blob) {
        throw new Error("Failed to create blob from URI.");
      }
      const storageRef = ref(storage, `images/${Date.now()}_${userId}`);
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
    <View>
      <StatusBar backgroundColor={color.lightGray} style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <View style={{ alignItems: "center", paddingBottom: 15 }}>
          <Text style={{ fontSize: 25, fontFamily: "gt-medium" }}>
            Create Your Favourite Recipe Plan
          </Text>
        </View>
        <TextInput
          label="Recipe Name"
          mode="outlined"
          style={styles.input}
          onChangeText={(text) => setValue("title", text)}
          error={!!errors.title}
          textColor="black"
          theme={{
            colors: {
              primary: color.buttonBg,
              background: color.lightGray,
            },
          }}
        />
        {errors.title && (
          <Text style={styles.error}>{errors.title.message}</Text>
        )}
        <TextInput
          label="Cooking minutes"
          mode="outlined"
          style={styles.input}
          onChangeText={(text) => setValue("cookingMinutes", text)}
          error={!!errors.title}
          textColor="black"
          theme={{
            colors: {
              primary: color.buttonBg,
              background: color.lightGray,
            },
          }}
        />
        {errors.cookingMinutes && (
          <Text style={styles.error}>{errors.cookingMinutes.message}</Text>
        )}

        <View style={{ marginTop: 10, marginBottom: 15 }}>
          <SelectInput
            placeholder="Dietary Preferences"
            value={category}
            onValueChange={(text) => setCategory(text)}
            showWarning={category === ""}
            items={diet}
          />
        </View>
        {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

        {/* Ingredients section */}
        <Text style={styles.label}>Ingredients</Text>
        {ingredients.map((ingredient, index) => (
          <View key={index} style={styles.ingredientContainer}>
            <TextInput
              label={`Ingredient ${index + 1} Name`}
              mode="outlined"
              style={styles.input}
              onChangeText={(text) =>
                handleIngredientChange(index, "name", text)
              }
              textColor="black"
              theme={{
                colors: {
                  primary: color.buttonBg,
                  background: color.lightGray,
                },
              }}
              value={ingredient.name}
              error={!!errors.ingredients?.[index]?.name}
            />
            {errors.ingredients?.[index]?.name && (
              <Text style={styles.error}>
                {errors.ingredients[index].name.message}
              </Text>
            )}
            <TextInput
              label={`Ingredient ${index + 1} Quantity`}
              mode="outlined"
              style={styles.input}
              onChangeText={(text) =>
                handleIngredientChange(index, "quantity", text)
              }
              value={ingredient.quantity}
              error={!!errors.ingredients?.[index]?.quantity}
              textColor="black"
              theme={{
                colors: {
                  primary: color.buttonBg,
                  background: color.lightGray,
                },
              }}
            />
            {errors.ingredients?.[index]?.quantity && (
              <Text style={styles.error}>
                {errors.ingredients[index].quantity.message}
              </Text>
            )}
          </View>
        ))}

        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Button
            style={{
              marginTop: -20,
              borderRadius: 4,
              width: 250,
              borderColor: color.lightGray,
            }}
            mode="outlined"
            onPress={addIngredient}
          >
            <Text style={{ color: color.blackColor }}>
              Add Another Ingredient
            </Text>
          </Button>
        </View>

        <Controller
          control={control}
          name="instructions"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Instructions"
              mode="outlined"
              multiline
              style={[styles.input]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={!!errors.instructions}
              textColor="black"
              theme={{
                colors: {
                  primary: color.buttonBg,
                  background: color.lightGray,
                },
              }}
            />
          )}
        />
        {errors.instructions && (
          <Text style={styles.error}>{errors.instructions.message}</Text>
        )}

        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 10,
          }}
        >
          <Button
            mode="elevated"
            onPress={pickImage}
            style={{ borderRadius: 5, width: 150, padding: 5 }}
            textColor="white"
            theme={{
              colors: {
                primary: color.buttonBg,
                background: color.lightGray,
              },
            }}
          >
            {imageUri ? "Change Image" : "Add Recipe Image"}
          </Button>
          {imageUri && (
            <Image source={{ uri: imageUri }} style={styles.image} />
          )}
          {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
        </View>

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          style={styles.submitButton}
          loading={loading}
        >
          <Text style={{ fontSize: 20, fontFamily: "gt-bold", color: "#fff" }}>
            {loading ? "Creating your meal plan..." : "Submit Recipe"}
          </Text>
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 40,
    paddingBottom: 100,
  },
  input: {
    marginBottom: 10,
  },
  ingredientContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: -10,
  },
  image: {
    width: "100%",
    height: 200,
    marginVertical: 15,
    borderRadius: 10,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  submitButton: {
    marginTop: 10,
    borderRadius: 5,
    padding: 5,
    backgroundColor: color.buttonBg,
  },
});
