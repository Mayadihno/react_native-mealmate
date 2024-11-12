import {
  Image,
  ScrollView,
  StyleSheet,
  View,
  Text,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
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
import { doc, getDoc, updateDoc } from "firebase/firestore";
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
const width = Dimensions.get("screen").width / 1 - 10;
export default function EditMealPlan() {
  const { id } = useLocalSearchParams();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [ingredients, setIngredients] = useState([{ name: "", quantity: "" }]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const storage = getStorage();

  // Validation schema
  const schema = Yup.object().shape({
    title: Yup.string().required("Recipe name is required"),
    cookingMinutes: Yup.string().required("Cooking minutes is required"),
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

  // Fetch existing recipe data on mount
  useEffect(() => {
    if (id) {
      fetchRecipeData(id as string);
    }
  }, [id]);

  const fetchRecipeData = async (recipeId: string) => {
    try {
      const docRef = doc(db, "recipes", recipeId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setValue("title", data?.title);
        setValue("cookingMinutes", data?.cookingMinutes);
        setValue("instructions", data?.instructions);
        setCategory(data.category);
        setIngredients(data.ingredients);
        setImageUri(data.imageUri);
      }
    } catch (error) {
      console.error("Failed to fetch recipe:", error);
      Toast.show("Failed to load recipe data", { type: "danger" });
    }
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "" }]);
  };

  const handleIngredientChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedIngredients: Ingredient[] = [...ingredients];
    updatedIngredients[index][field] = value;
    setIngredients(updatedIngredients);
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
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
    if (!imageUri || !category) {
      setErrorMsg("Please fill all fields before submitting");
      return;
    }

    try {
      setLoading(true);
      let imageUrl: any = imageUri;
      if (imageUri && !imageUri.startsWith("https://")) {
        imageUrl = await uploadImageAsync(imageUri);
        if (!imageUrl) throw new Error("Image upload failed");
      }

      const updatedData = {
        ...data,
        imageUri: imageUrl,
        category,
        ingredients,
      };
      await updateDoc(doc(db, "recipes", id as string), updatedData);
      setLoading(false);
      router.push("/(tabs)/profile");
    } catch (error) {
      setLoading(false);
      Toast.show("Failed to update recipe. Try again later", {
        type: "danger",
      });
    }
  };

  const uploadImageAsync = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `images/${Date.now()}_${id}`);
      const uploadTask = uploadBytesResumable(storageRef, blob);
      await uploadTask;
      return await getDownloadURL(uploadTask.snapshot.ref);
    } catch (error) {
      console.error("Image upload error:", error);
      Toast.show("Image upload failed", { type: "danger" });
      return null;
    }
  };

  return (
    <View>
      <StatusBar backgroundColor={color.lightGray} style="dark" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={{ alignItems: "center", paddingBottom: 15 }}>
          <Text style={{ fontSize: 25, fontFamily: "gt-medium" }}>
            Edit Recipe Plan
          </Text>
        </View>
        {imageUri && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: imageUri, cache: "reload" }}
              style={styles.image}
            />
            <Button
              mode="contained"
              onPress={pickImage}
              style={styles.updateImageButton}
            >
              <Text style={{ color: "#fff" }}>Update Image</Text>
            </Button>
          </View>
        )}
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Recipe Name"
              mode="outlined"
              style={styles.input}
              error={!!errors.title}
              textColor="black"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              theme={{
                colors: {
                  primary: color.buttonBg,
                  background: color.lightGray,
                },
              }}
            />
          )}
        />
        <Controller
          control={control}
          name="cookingMinutes"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Cooking Minutes"
              mode="outlined"
              style={styles.input}
              error={!!errors.title}
              textColor="black"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              theme={{
                colors: {
                  primary: color.buttonBg,
                  background: color.lightGray,
                },
              }}
            />
          )}
        />
        <SelectInput
          placeholder="Dietary Preferences"
          value={category}
          onValueChange={(text) => setCategory(text)}
          showWarning={category === ""}
          items={diet}
        />
        {ingredients.map((ingredient, index) => (
          <View key={index} style={styles.ingredientContainer}>
            <TextInput
              label={`Ingredient ${index + 1} Name`}
              mode="outlined"
              style={styles.input}
              onChangeText={(text) =>
                handleIngredientChange(index, "name", text)
              }
              value={ingredient.name}
              textColor="black"
              theme={{
                colors: {
                  primary: color.buttonBg,
                  background: color.lightGray,
                },
              }}
            />
            <TextInput
              label={`Ingredient ${index + 1} Quantity`}
              mode="outlined"
              style={styles.input}
              onChangeText={(text) =>
                handleIngredientChange(index, "quantity", text)
              }
              value={ingredient.quantity}
              textColor="black"
              theme={{
                colors: {
                  primary: color.buttonBg,
                  background: color.lightGray,
                },
              }}
            />
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
              style={styles.input}
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
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          style={styles.submitButton}
        >
          <Text style={{ color: "#fff" }}>
            {loading ? "Updating..." : "Update Recipe"}
          </Text>
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 40, paddingBottom: 100 },
  input: { marginBottom: 10 },
  imageContainer: { alignItems: "center", marginBottom: 15 },
  image: { width: width, height: 250, borderRadius: 8 },
  updateImageButton: { marginTop: 10, backgroundColor: color.buttonBg },
  ingredientContainer: { marginBottom: 15 },
  submitButton: {
    marginTop: 10,
    borderRadius: 5,
    backgroundColor: color.buttonBg,
  },
});
