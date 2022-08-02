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
import SearchScreen from "./Search/SearchScreen";
import { loadPosts } from "../Post/PostSlice";
import AddScreen from "../Add/AddScreen";

const Tab = createMaterialBottomTabNavigator();
const EpmtyScreen = () => {
  return null;
};

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

  return (
    <>
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
          name="Search"
          component={SearchScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon type="antdesign" name="search1" size={26} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="AddContainer"
          component={EpmtyScreen}
          listeners={({ navigation }) => ({
            tabPress: (event) => {
              event.preventDefault();
              navigation.navigate("Add");
            },
          })}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon
                type="antdesign"
                name="plussquareo"
                size={26}
                color={color}
              />
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
                user: auth.user,
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
    </>
  );
}
