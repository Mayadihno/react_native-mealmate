import {
  View,
  Text,
  KeyboardTypeOptions,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import color from "@/theme/app.colors";
import { windowWidth, windowHeight } from "@/theme/app.contants";
import fonts from "@/theme/app.fonts";
import { useState } from "react";
import { Feather } from "@expo/vector-icons";

interface InputProps {
  title: string;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
  value?: string;
  warning?: string;
  onChangeText?: (text: string) => void;
  showWarning?: boolean;
  emailFormatWarning?: string;
  disabled?: boolean;
  isPasswordVisible?: boolean;
}

export default function Input({
  title,
  placeholder,
  keyboardType,
  value,
  warning,
  onChangeText,
  showWarning,
  emailFormatWarning,
  disabled,
  isPasswordVisible = false,
}: InputProps) {
  const { colors } = useTheme();

  const [passwordVisible, setPasswordVisible] = useState(isPasswordVisible);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: color.lightGray,
            borderColor: colors.border,
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={color.secondaryFont}
        keyboardType={keyboardType}
        value={value}
        aria-disabled={disabled}
        onChangeText={onChangeText}
        secureTextEntry={isPasswordVisible && passwordVisible}
      />
      {showWarning && <Text style={[styles.warning]}>{warning}</Text>}
      {isPasswordVisible && (
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={styles.toggleButton}
        >
          <Feather
            name={passwordVisible ? "eye" : "eye-off"}
            size={20}
            color="black"
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.medium,
    fontSize: windowWidth(20),
    marginVertical: windowHeight(8),
  },
  input: {
    borderRadius: 5,
    borderWidth: 1,
    marginBottom: 5,
    height: windowHeight(35),
    color: color.secondaryFont,
    paddingHorizontal: 15,
    position: "relative",
  },
  warning: {
    color: color.red,
    marginTop: 3,
  },
  toggleButton: {
    position: "absolute",
    top: 50,
    right: 10,
  },
});
