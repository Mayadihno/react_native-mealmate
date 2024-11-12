import { ImageSourcePropType } from "react-native";

export type images = {
  slide1: ImageSourcePropType;
  slide2: ImageSourcePropType;
  slide3: ImageSourcePropType;
  image1: ImageSourcePropType;
};
type CarouselImage = {
  image: ImageSourcePropType;
};

const Images: images = {
  slide1: require("../assets/images/slides/slide1.jpg"),
  slide2: require("../assets/images/slides/slide2.jpg"),
  slide3: require("../assets/images/slides/slide3.png"),
  image1: require("../assets/images/slides/image1.png"),
};
export default Images;

export const carouselImage: CarouselImage[] = [
  { image: require("../assets/images/carousel/carousel_1.jpg") },
  { image: require("../assets/images/carousel/carousel_2.jpg") },
  { image: require("../assets/images/carousel/carousel_3.jpg") },
  { image: require("../assets/images/carousel/carousel_4.jpg") },
  { image: require("../assets/images/carousel/carousel_5.jpg") },
];
