import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Icon, LOCAL_STORAGE_TOKEN_NAME } from '../../../assets/constants';
import { RootState } from '../../../redux';
import store from '../../../redux/store';
import { NavigationProps } from '../../../utils/Props';
import { loadUser } from '../../Auth/AuthSlice';

const ProfileScreen = ({ navigation, route }: NavigationProps) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {}, [user]);

  const onLogout = async () => {
    await AsyncStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);
    store.dispatch(loadUser());
    // setLoading();
    // socket.disconnect();
    navigation.navigate('Landing');
  };
  return (
    <View>
      <Text>123</Text>
      <Icon.logout width={25} height={25} onPress={onLogout} />
    </View>
  );
};

export default ProfileScreen;
