import "react-native-gesture-handler";
import React from "react";
import { StyleSheet, LogBox } from "react-native";
import { useFonts } from "expo-font";
import { NavigationContainer, useFocusEffect } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
//redux
import { Provider } from "react-redux";
import store from "./redux/store";
//screen
import Landing from "./components/Auth/Landing";
import LoginScreen from "./components/Auth/Login";
import RegisterScreen from "./components/Auth/Register";
import MainScreen from "./components/Main/MainScreen";
import AddScreen from "./components/Add/AddScreen";
import SaveScreen from "./components/Main/Save/SaveScreen";
import PostScreen from "./components/Main/Post/PostScreen";
import ConversationsScreen from "./components/Main/Chat/ConversationsScreen";
import ChatScreen from "./components/Main/Chat/ChatScreen";

const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    "Roboto-Black": require("./assets/fonts/Roboto-Black.ttf"),
    "Roboto-Bold": require("./assets/fonts/Roboto-Bold.ttf"),
    "Roboto-Medium": require("./assets/fonts/Roboto-Medium.ttf"),
  });
  LogBox.ignoreAllLogs();
  if (!fontsLoaded) return null;

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Landing">
          <Stack.Screen
            name="Landing"
            component={Landing}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen
            name="Main"
            component={MainScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Add"
            component={AddScreen}
            options={{ headerShown: true }}
          />
          <Stack.Screen
            name="Save"
            component={SaveScreen}
            options={{ headerShown: true }}
          />
          <Stack.Screen
            name="Post"
            component={PostScreen}
            options={{ headerShown: true }}
          />

          <Stack.Screen
            name="Conversations"
            component={ConversationsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Chat"
            component={ChatScreen}
            options={{ headerShown: false }}
            // options={({ route }) => ({ title: route.params.name })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
