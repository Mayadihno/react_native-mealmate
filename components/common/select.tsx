import React from "react";
import { View, Text, StyleSheet } from "react-native";
import color from "@/theme/app.colors";
import { windowHeight, windowWidth } from "@/theme/app.contants";
import fonts from "@/theme/app.fonts";
import { Picker } from "@react-native-picker/picker";

interface InputProps {
  title?: string;
  placeholder: string;
  items: { id: number; text: string }[];
  value?: string;
  warning?: string;
  onValueChange: (value: string) => void;
  showWarning?: boolean;
}

export default function SelectInput({
  title,
  placeholder,
  items,
  value,
  warning,
  onValueChange,
  showWarning,
}: InputProps) {
  return (
    <View>
      {title && (
        <Text style={[styles.title, { color: color.darkPrimary }]}>
          {title}
        </Text>
      )}
      <View
        style={{
          borderWidth: 1,
          marginBottom: 5,
          borderRadius: 3,
          borderColor: "#888",
          // backgroundColor: "#fff",
        }}
      >
        <Picker
          selectedValue={value}
          onValueChange={(itemValue: any) => onValueChange(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label={placeholder} value="" color="#888" />

          {items.map((item) => (
            <Picker.Item label={item.text} value={item.text} key={item.id} />
          ))}
        </Picker>
      </View>
      {showWarning && <Text style={styles.warning}>{warning}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.medium,
    fontSize: windowWidth(20),
    marginVertical: windowHeight(8),
  },
  picker: {
    height: windowHeight(40),
    width: "100%",
    color: color.blackColor,
  },
  warning: {
    color: color.red,
    marginTop: 3,
  },
});
