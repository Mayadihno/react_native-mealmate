import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import color from "@/theme/app.colors";
import { Button, Dialog, Portal } from "react-native-paper";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { Toast } from "react-native-toast-notifications";
import { router } from "expo-router";

const width = Dimensions.get("screen").width / 2 - 20;

type MealProp = {
  data: Recipe[];
  setData: React.Dispatch<React.SetStateAction<Recipe[] | null>>;
};

export default function MealPlan({ data, setData }: MealProp) {
  const [visible, setVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const showDialog = (id: string) => {
    setSelectedId(id);
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
    setSelectedId(null);
  };

  const handleDelete = async () => {
    if (selectedId) {
      setLoading(true);
      try {
        await deleteDoc(doc(db, "recipes", selectedId));
        const updatePost = data.filter((item) => item.id !== selectedId);
        setData(updatePost);
        Toast.show("Successfully deleted the Post", {
          type: "success",
        });
        setLoading(false);
        hideDialog();
      } catch (error) {
        setLoading(false);
        Toast.show("Something went wrong", {
          type: "danger",
        });
      }
    }
  };

  const handleEditmeal = (id: string) => {
    router.push({
      pathname: "/(routes)/edit-mealplan",
      params: { id: id },
    });
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderColor: "white",
        flexWrap: "wrap",
      }}
    >
      {data.map((item) => (
        <View
          key={item.title}
          style={{
            backgroundColor: color.border,
            width: width,
            height: 240,
            borderRadius: 10,
            marginTop: 15,
          }}
        >
          <Image
            source={{ uri: item?.imageUri, cache: "reload" }}
            resizeMode="cover"
            style={{
              width: width,
              height: 160,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
          />
          <Text
            style={{
              paddingTop: 5,
              fontSize: 20,
              fontFamily: "gt-medium",
              paddingLeft: 2,
            }}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 5,
              padding: 17,
            }}
          >
            <Button
              style={{
                borderRadius: 4,
                backgroundColor: color.activeColor,
              }}
              mode="contained"
              onPress={() => handleEditmeal(item.id)}
            >
              <Text style={{ color: "#fff" }}>Edit</Text>
            </Button>
            <Button
              style={{
                borderRadius: 4,
                backgroundColor: color.alertRed,
              }}
              mode="contained"
              onPress={() => showDialog(item.id)}
            >
              <Text style={{ color: "#fff" }}>Delete</Text>
            </Button>
          </View>
        </View>
      ))}

      {/* Dialog outside of map */}
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Content>
            <Text
              style={{
                color: "#fff",
                textAlign: "center",
                fontSize: 18,
                fontFamily: "gt-medium",
              }}
            >
              Are you sure you want to delete this meal plan?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            {loading ? (
              <Text
                style={{ color: "#fff", fontSize: 16, textAlign: "center" }}
              >
                Please wait deleting the selected item...
              </Text>
            ) : (
              <Button
                style={{
                  borderRadius: 4,
                  paddingHorizontal: 8,
                  backgroundColor: color.buttonBg,
                  marginRight: 20,
                }}
                mode="contained"
                onPress={hideDialog}
              >
                <Text style={{ color: "#fff" }}>NO</Text>
              </Button>
            )}
            <Button
              mode="contained"
              style={{
                borderRadius: 4,
                paddingHorizontal: 5,
                backgroundColor: color.alertRed,
              }}
              onPress={handleDelete}
            >
              <Text style={{ color: "#fff" }}>YES</Text>
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({});
