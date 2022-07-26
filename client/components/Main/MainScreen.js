import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { Button, Icon } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LOCAL_STORAGE_TOKEN_NAME } from "../../assets/constants";
import { useDispatch, useSelector } from "react-redux";
import authSlice, { loadUser } from "../Auth/AuthSlice";

import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
//Screen
import ProfileScreen from "./Profile/ProfileScreen";
import FeedScreen from "./Feed/FeedScreen";

const Tab = createMaterialBottomTabNavigator();

export default function MainScreen({ navigation }) {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(loadUser());
  }, []);

  if (auth.authLoading || !auth.isAuthenticated) {
    return (
      <SafeAreaView>
        <Text>LOADING</Text>
      </SafeAreaView>
    );
  }
  // console.log(auth);
  return (
    // <SafeAreaView>
    //   <Button style={{ paddingTop: 500 }} title="LOGOUT" onPress={onLogout} />
    //   <Text>{auth.user.name}</Text>
    //   <Text>{auth.user._id}</Text>
    // </SafeAreaView>
    <Tab.Navigator initialRouteName="Feed">
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon type="entypo" name="home" size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        navigation={navigation}
        listeners={({ navigation }) => ({
          tabPress: (event) => {
            event.preventDefault();
            navigation.navigate("Profile", {
              uid: auth.user._id,
            });
          },
        })}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon type="font-awesome" name="user" size={26} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
