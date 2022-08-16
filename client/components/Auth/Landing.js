import React, { useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import { Button, Image } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, images, SIZES } from "../../assets/constants";
import { useSelector, useDispatch } from "react-redux";
import MainScreen from "../Main/MainScreen";
import { loadUser } from "./AuthSlice";

export default function Landing({ navigation }) {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(loadUser());
  }, []);
  if (auth.authLoading)
    return (
      <SafeAreaView>
        <Text>LOADING in Landing</Text>
      </SafeAreaView>
    );
  return (
    <>
      {auth.isAuthenticated ? (
        <MainScreen />
      ) : (
        <SafeAreaView style={styles.container}>
          <Image
            source={images.logo}
            style={{ height: 200, width: 200, marginBottom: 50 }}
          />
          <Button
            title="Login"
            onPress={() => navigation.navigate("Login")}
            type="solid"
            buttonStyle={{
              backgroundColor: COLORS.primary,
              borderRadius: 50,
              width: 200,
              marginBottom: 30,
            }}
            titleStyle={{ color: COLORS.white }}
          />
          <Button
            title="Register"
            onPress={() => navigation.navigate("Register")}
            type="solid"
            buttonStyle={{
              backgroundColor: COLORS.primary,
              borderRadius: 50,
              width: 200,
              marginBottom: 30,
            }}
            titleStyle={{ color: COLORS.white }}
          />
        </SafeAreaView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SIZES.width,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
