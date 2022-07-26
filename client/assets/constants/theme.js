import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

const COLORS = {
  //base
  primary: "#1FA1FF",

  //color
  white: "#FFFFFF",
  green: "#2AAD15",
  yellow: "#F3EA00",

  lightGray: "#F5F5F6",
  lightGray2: "#F6F6F7",
  lightGray3: "#EFEFF1",
  lightGray4: "#F8F8F9",
  transparent: "transparent",
  darkgray: "#898C95",

  //text
  textGray: "#8e8e8f",
};

const SIZES = {
  //global size
  font: 14,
  icon: 26,
  padding: 10,
  radius: 8,
  heightSlider: 200,

  //fonts size
  h1: 30,
  h2: 22,
  h3: 20,
  h4: 18,
  h5: 16,

  // app dimensions
  width,
  height,
};

const FONTS = {
  h1: { fontFamily: "Roboto-Black", fontSize: SIZES.h1 },
  h2: { fontFamily: "Roboto-Bold", fontSize: SIZES.h2 },
  h3: { fontFamily: "Roboto-Medium", fontSize: SIZES.h3 },
  h4: { fontFamily: "Roboto-Medium", fontSize: SIZES.h4 },
  h5: { fontFamily: "Roboto-Medium", fontSize: SIZES.h5 },

  bold: { fontFamily: "Roboto-Medium", fontSize: SIZES.font },
};

export { COLORS, SIZES, FONTS };
