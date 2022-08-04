import React, { useState } from "react";
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
import axios from "axios";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loadUser } from "./AuthSlice";

export default function RegisterScreen({ navigation }) {
  const dispatch = useDispatch();
  const [registerForm, setRegisterForm] = useState({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const { name, username, password, confirmPassword } = registerForm;

  const onRegister = async () => {
    if (!name || !username || !password || !confirmPassword) {
      Alert.alert("Error!", "You must fill all information!");
    } else if (password !== confirmPassword) {
      Alert.alert("Error!", "Passwords do not match!");
    } else {
      const dataRegister = await axios.post(
        `${apiUrl}/auth/register`,
        registerForm
      );
      if (!dataRegister.data.success) {
        Alert.alert("Error!", dataRegister.data.message);
      } else {
        AsyncStorage.setItem(
          LOCAL_STORAGE_TOKEN_NAME,
          dataRegister.data.accessToken
        );
        setRegisterForm({
          username: "",
          name: "",
          password: "",
          confirmPassword: "",
        });
        dispatch(loadUser());
        Alert.alert("Success!", dataRegister.data.message, [
          { text: "OK", onPress: () => navigation.navigate("Main") },
        ]);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ alignSelf: "center", ...FONTS.h1, color: COLORS.primary }}>
        Register
      </Text>
      <View style={{ width: 300, alignSelf: "center" }}>
        <Input
          style={{ borderRadius: 50, borderColor: COLORS.lightGray }}
          placeholder="Name"
          value={name}
          onChangeText={(text) =>
            setRegisterForm({ ...registerForm, name: text })
          }
        />
        <Input
          style={{ borderRadius: 50, borderColor: COLORS.lightGray }}
          placeholder="UserName"
          value={username}
          onChangeText={(text) =>
            setRegisterForm({ ...registerForm, username: text })
          }
        />
        <Input
          style={{ borderRadius: 50, borderColor: COLORS.lightGray }}
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) =>
            setRegisterForm({ ...registerForm, password: text })
          }
        />
        <Input
          style={{ borderRadius: 50, borderColor: COLORS.lightGray }}
          placeholder="Confirm Password"
          secureTextEntry={true}
          value={confirmPassword}
          onChangeText={(text) =>
            setRegisterForm({ ...registerForm, confirmPassword: text })
          }
        />
      </View>

      <Button
        title="Register"
        type="solid"
        style={{ flex: 1 }}
        buttonStyle={{
          backgroundColor: COLORS.primary,
          borderRadius: 50,
          width: 200,
          alignSelf: "center",
        }}
        titleStyle={{ color: COLORS.white }}
        onPress={onRegister}
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
