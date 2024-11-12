import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Pressable,
  Dimensions,
  FlatList,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import color from "@/theme/app.colors";
import { useDispatch, useSelector } from "react-redux";
import { MealState, removeFromCart } from "@/redux/mealReducer";
import { Toast } from "react-native-toast-notifications";
import {
  addItemToPurchase,
  PurchaseState,
  removeFromPurchaseCart,
} from "@/redux/purchaseReduser";
import { Entypo } from "@expo/vector-icons";
import * as SMS from "expo-sms";
import Button from "@/components/common/button";
import { router } from "expo-router";

const productWidth = Dimensions.get("screen").width / 2 - 10;

const CartScreen = () => {
  const cart = useSelector((state: MealState) => state.meal.meal);
  const purchase = useSelector(
    (state: PurchaseState) => state.purchase.purchase
  );
  const [tab, setTab] = useState(1);
  const dispatch = useDispatch();

  const handleRemove = (item: any) => {
    dispatch(removeFromCart(item));
    Toast.show("Item removed successfully!!", {
      type: "success",
    });
  };

  const handleRemovefromPurchase = (item: any) => {
    dispatch(removeFromPurchaseCart(item));
    Toast.show("Item removed successfully!!", {
      type: "success",
    });
  };

  const handlePurchase = (item: any) => {
    dispatch(addItemToPurchase(item));
    dispatch(removeFromCart(item));
    Toast.show("Meal plan added to purchase list", {
      type: "success",
    });
  };

  const renderItem = ({ item }: { item: any }) => (
    <View
      style={{
        backgroundColor: color.border,
        width: productWidth,
        height: 230,
        borderRadius: 10,
        marginBottom: 30,
      }}
    >
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/(routes)/details",
            params: { id: item.id },
          })
        }
      >
        <Image
          source={{ uri: item.image || item?.imageUri }}
          style={{
            width: productWidth,
            height: 160,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
          resizeMode="cover"
        />
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
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Pressable
          style={{
            backgroundColor: color.buttonBg,
            padding: 5,
            marginTop: 15,
            paddingHorizontal: 8,
            borderRadius: 5,
          }}
          onPress={() => handlePurchase(item)}
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
            Purchased
          </Text>
        </Pressable>
        <Pressable
          style={{
            backgroundColor: color.alertRed,
            padding: 5,
            marginTop: 15,
            paddingHorizontal: 8,
            borderRadius: 5,
          }}
          onPress={() => handleRemove(item)}
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
            Remove
          </Text>
        </Pressable>
      </View>
    </View>
  );
  const renderItems = ({ item }: { item: any }) => (
    <View
      style={{
        backgroundColor: color.border,
        width: productWidth,
        height: 230,
        borderRadius: 10,
        marginBottom: 30,
      }}
    >
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/(routes)/details",
            params: { id: item.id },
          })
        }
      >
        <Image
          source={{ uri: item.image || item?.imageUri }}
          style={{
            width: productWidth,
            height: 160,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
          resizeMode="cover"
        />
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
            backgroundColor: color.alertRed,
            padding: 5,
            marginTop: 15,
            paddingHorizontal: 8,
            borderRadius: 5,
          }}
          onPress={() => handleRemovefromPurchase(item)}
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
            Remove
          </Text>
        </Pressable>
      </View>
    </View>
  );
  const handleShareList = async () => {
    const isAvailable = await SMS.isAvailableAsync();

    if (isAvailable) {
      // Format cart items into a single message
      const message = cart
        .map((item) => {
          const combinedIngredients = [
            ...(item.extendedIngredients || []).map(
              (ingredient: any) => `- ${ingredient.aisle} ${ingredient.amount}`
            ),
            ...(item.ingredients || []).map(
              (ingredient: any) => `- ${ingredient.name} ${ingredient.quantity}`
            ),
          ].join("\n");

          return (
            `Title: ${item.title}\n` +
            `Ingredients:\n${combinedIngredients}\n` +
            `Instructions: ${item.instructions}\n\n`
          );
        })
        .join("\n-----------------\n");

      const { result } = await SMS.sendSMSAsync(
        [],
        `Shopping List:\n${message}`
      );
      if (result === "sent") {
        Alert.alert("Success", "Message sent successfully!");
      } else {
        Alert.alert("Error", "Failed to send message.");
      }
    } else {
      Alert.alert("Error", "SMS is not available on this device.");
    }
  };

  return (
    <View>
      <StatusBar backgroundColor={color.lightGray} style="dark" />
      <View
        style={{
          marginTop: 60,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={
            tab === 1
              ? {
                  backgroundColor: color.buttonBg,
                  paddingVertical: 15,
                  paddingHorizontal: 40,
                  borderTopLeftRadius: 8,
                  borderBottomLeftRadius: 8,
                }
              : {
                  backgroundColor: color.bgDark,
                  paddingVertical: 15,
                  paddingHorizontal: 40,
                  borderTopLeftRadius: 8,
                  borderBottomLeftRadius: 8,
                }
          }
          onPress={() => setTab(1)}
        >
          <Text
            style={{
              fontSize: 20,
              color: "#fff",
              fontFamily: "gt-medium",
            }}
          >
            Meal plan list
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            tab === 2
              ? {
                  backgroundColor: color.buttonBg,
                  paddingVertical: 15,
                  paddingHorizontal: 30,
                  borderTopRightRadius: 8,
                  borderBottomRightRadius: 8,
                }
              : {
                  backgroundColor: color.bgDark,
                  paddingVertical: 15,
                  paddingHorizontal: 30,
                  borderTopRightRadius: 8,
                  borderBottomRightRadius: 8,
                }
          }
          onPress={() => setTab(2)}
        >
          <Text
            style={{ fontSize: 20, color: "#fff", fontFamily: "gt-medium" }}
          >
            Purchased meal plan
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ paddingHorizontal: 5, marginTop: 10 }}>
        {tab === 1 && (
          <View>
            {cart.length <= 0 ? (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 200,
                }}
              >
                <Text
                  style={{
                    fontSize: 30,
                    paddingBottom: 20,
                    fontFamily: "gt-bold",
                  }}
                >
                  No Meal plan added
                </Text>
                <Button
                  title="Go back"
                  width={100}
                  backgroundColor={color.blackColor}
                  onPress={() => router.back()}
                />
              </View>
            ) : (
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingBottom: 20,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: "gt-medium",
                      paddingLeft: 20,
                    }}
                  >
                    Meal plan list ({cart.length})
                  </Text>
                  <Pressable
                    style={{
                      backgroundColor: color.modelBg,
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderRadius: 5,
                      marginRight: 15,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                    onPress={handleShareList}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        fontFamily: "gt-medium",
                        color: "#fff",
                        paddingRight: 5,
                      }}
                    >
                      Share
                    </Text>
                    <Entypo name="share" size={15} color="white" />
                  </Pressable>
                </View>

                <FlatList
                  data={cart}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={2}
                  columnWrapperStyle={{
                    justifyContent: "space-between",
                  }}
                  contentContainerStyle={{
                    paddingBottom: 420,
                  }}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            )}
          </View>
        )}
      </View>
      <View style={{ paddingHorizontal: 5, marginTop: 10 }}>
        {tab === 2 && (
          <View>
            {purchase.length <= 0 ? (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 60,
                }}
              >
                <Text
                  style={{
                    fontSize: 30,
                    paddingBottom: 20,
                    fontFamily: "gt-bold",
                  }}
                >
                  No Purchase item
                </Text>
                <Button
                  title="Go back"
                  width={200}
                  backgroundColor={color.blackColor}
                  onPress={() => router.back()}
                />
              </View>
            ) : (
              <View>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: "gt-medium",
                    paddingBottom: 20,
                    paddingLeft: 20,
                  }}
                >
                  Purchased plan list ({purchase.length})
                </Text>
                <FlatList
                  data={purchase}
                  renderItem={renderItems}
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={2}
                  columnWrapperStyle={{ justifyContent: "space-between" }}
                  contentContainerStyle={{
                    paddingBottom: 420,
                  }}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default CartScreen;
