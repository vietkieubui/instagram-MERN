import React, { useEffect } from 'react';
import { SafeAreaView, Text, View, StyleSheet, Image } from 'react-native';
import { SIZES, COLORS, images } from '../../assets/constants';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'react-native-elements';
import { RootState } from './../../redux/index';
import authSlice, { loadUser } from './AuthSlice';
import store from '../../redux/store';
import { NavigationProps } from '../../utils/Props';
import MainScreen from '../Main/MainScreen';

const Landing = ({ navigation }: NavigationProps) => {
  const dispatch = useDispatch();

  const auth = useSelector((state: RootState) => state.auth);
  useEffect((): any => {
    store.dispatch(loadUser());
  }, []);
  if (auth.authLoading) {
    return (
      <SafeAreaView>
        <Text>LOADING in Landing</Text>
      </SafeAreaView>
    );
  }
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
            onPress={() => {
              navigation.navigate('Login');
            }}
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
            onPress={() => navigation.navigate('Register')}
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SIZES.width,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Landing;
