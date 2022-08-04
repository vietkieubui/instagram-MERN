import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  SIZES,
  COLORS,
  FONTS,
  apiUrl,
  LOCAL_STORAGE_TOKEN_NAME,
} from "../../assets/constants";
import { Input, Button } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loadUser } from "./AuthSlice";

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  const { username, password } = loginForm;

  const onLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error!", "You must fill all information");
    } else {
      const dataLogin = await axios.post(`${apiUrl}/auth/login`, loginForm);
      if (dataLogin.data.success) {
        AsyncStorage.setItem(
          LOCAL_STORAGE_TOKEN_NAME,
          dataLogin.data.accessToken
        );

        setLoginForm({ username: "", password: "" });
        dispatch(loadUser());
        navigation.navigate("Main");
      } else {
        Alert.alert("Error!", dataLogin.data.message);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ alignSelf: "center", ...FONTS.h1, color: COLORS.primary }}>
        Login
      </Text>
      <View style={{ width: 300, alignSelf: "center" }}>
        <Input
          style={{ borderRadius: 50, borderColor: COLORS.lightGray }}
          placeholder="Username"
          value={username}
          onChangeText={(text) =>
            setLoginForm({ ...loginForm, username: text })
          }
        />
        <Input
          style={{ borderRadius: 50, borderColor: COLORS.lightGray }}
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) =>
            setLoginForm({ ...loginForm, password: text })
          }
        />
      </View>

      <Button
        title="Login"
        type="solid"
        style={{ flex: 1 }}
        buttonStyle={{
          backgroundColor: COLORS.primary,
          borderRadius: 50,
          width: 200,
          alignSelf: "center",
        }}
        titleStyle={{ color: COLORS.white }}
        onPress={onLogin}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SIZES.width,
    justifyContent: "flex-start",
  },
});
