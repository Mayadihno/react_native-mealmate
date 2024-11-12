import { commonStyles } from "@/styles/common.style";
import { StyleSheet } from "react-native";
import { external } from "@/styles/external.style";
import { fontSizes, windowHeight, windowWidth } from "@/theme/app.contants";
import color from "@/theme/app.colors";
import fonts from "@/theme/app.fonts";

const styles = StyleSheet.create({
  slideContainer: {
    ...commonStyles.flexContainer,
  },
  imageBackground: {
    width: "80%",
    height: windowHeight(300),
    marginTop: windowHeight(80),
    resizeMode: "contain",
    marginHorizontal: "auto",
  },
  title: {
    ...commonStyles.mediumText23,
    marginTop: windowHeight(15),
    ...external.ti_center,
    fontSize: 30,
  },
  description: {
    ...commonStyles.regularText,
    paddingTop: windowHeight(12),
    width: "75%",
    ...external.as_center,
    fontSize: fontSizes.FONT19,
    lineHeight: windowHeight(17),
    ...external.ti_center,
  },
  backArrow: {
    width: windowHeight(34),
    height: windowHeight(34),
    borderRadius: windowHeight(34),
    backgroundColor: color.buttonBg,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    bottom: 0,
    position: "absolute",
  },
  img: {
    width: "100%",
    height: windowHeight(180),
    marginBottom: windowHeight(45),
  },
  activeStyle: {
    width: "7%",
    backgroundColor: color.buttonBg,
  },
  paginationStyle: {
    height: "20%",
  },

  flagImage: {
    height: windowHeight(20),
    width: windowWidth(30),
    borderRadius: 15,
  },
  downArrow: {
    paddingVertical: windowHeight(4),
    paddingHorizontal: windowWidth(5),
  },
  dropdownManu: {
    borderRadius: 5,
    borderWidth: 0,
  },
  dropdownContainer: {
    width: windowWidth(180),
    borderWidth: 0,
    color: color.alertRed,
  },
  labelStyle: {
    fontFamily: fonts.medium,
  },
  dropdown: {
    borderWidth: 0,
    backgroundColor: "transparent",
  },
  skipText: {
    color: color.regularText,
    paddingVertical: windowHeight(4),
    fontFamily: fonts.regular,
  },
});
export { styles };
