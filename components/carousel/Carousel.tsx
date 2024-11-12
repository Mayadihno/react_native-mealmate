import { Animated, Dimensions, Image, StyleSheet, View } from "react-native";
import React, { useRef, useState } from "react";
import { carouselImage } from "@/utils/images";
import { useInterval } from "@/hooks/useInterval";

const Max_Width = Dimensions.get("screen").width;
export default function Carousel() {
  const animation = useRef(new Animated.Value(0));
  const [currentState, setCurrentState] = useState(0);

  const handleAnimation = () => {
    let newCurrentImage = currentState + 1;
    if (newCurrentImage >= carouselImage.length) {
      newCurrentImage = currentState * 0;
    }
    Animated.spring(animation.current, {
      toValue: -(Dimensions.get("screen").width * newCurrentImage),
      useNativeDriver: true,
    }).start();

    setCurrentState(newCurrentImage);
  };
  useInterval(() => handleAnimation(), 3000);
  return (
    <View>
      <Animated.View
        style={[
          styles.container,
          { transform: [{ translateX: animation.current }] },
        ]}
      >
        {carouselImage.map((image, index) => (
          <Image key={index} source={image.image} style={styles.image} />
        ))}
      </Animated.View>
      <View style={styles.indicatorContainer}>
        {carouselImage.map((image, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              index === currentState
                ? styles.activeIndicator
                : styles.indicator,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    elevation: 6,
    zIndex: 9,
  },
  image: {
    width: Max_Width,
    height: 250,
    resizeMode: "cover",
    borderWidth: 1,
    borderColor: "white",
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    bottom: 20,
    width: Max_Width,
    zIndex: 999,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 7.5,
    backgroundColor: "#eee",
    marginHorizontal: 3,
    borderWidth: 1,
    borderColor: "silver",
    marginBottom: 0,
  },
  activeIndicator: {
    backgroundColor: "orange",
  },
});
