import React, { useEffect } from 'react';
import { Text, SafeAreaView } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { useDispatch, useSelector } from 'react-redux';
import { Icon, images } from '../../assets/constants';
import { NavigationProps, TabNavigationProps } from '../../utils/Props';

//Screen
import FeedScreen from './Feed/FeedScreen';
import ProfileScreen from './Profile/ProfileScreen';
import { RootState } from '../../redux';
import userSlice, { setUser } from './Profile/UserSlice';

const Tab = createMaterialBottomTabNavigator();
const EpmtyScreen = () => {
  return null;
};

const MainScreen = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  useEffect(() => {
    dispatch(setUser(auth.user));
  }, []);
  if (auth.authLoading || !auth.isAuthenticated) {
    return (
      <SafeAreaView>
        <Text>LOADING o main</Text>
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
            tabBarIcon: () => <Icon.home width={25} height={25} />,
          }}
        />
        <Tab.Screen
          name="Search"
          component={ProfileScreen}
          options={{
            tabBarIcon: () => <Icon.search width={25} height={25} />,
          }}
        />
        <Tab.Screen
          name="Add"
          component={ProfileScreen}
          options={{
            tabBarIcon: () => <Icon.add width={25} height={25} />,
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          listeners={() => ({
            tabPress: () => {
              dispatch(setUser(auth.user));
            },
          })}
          options={{
            tabBarIcon: () => <Icon.user width={25} height={25} />,
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default MainScreen;
