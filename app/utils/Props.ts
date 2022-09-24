import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import { MaterialBottomTabScreenProps } from '@react-navigation/material-bottom-tabs';
import { UserModel } from '../redux';

export type RootStackParams = {
  Landing: undefined;
  Main: undefined;
  Login: undefined;
  Register: undefined;
  MainScreen: undefined;
  AddScreen: undefined;
  Profile: { user: UserModel };
};

export type TabParams = {
  Profile: { user: UserModel };
  Feed: undefined;
  Add: undefined;
  Search: undefined;
};

export type NavigationProps = NativeStackScreenProps<RootStackParams>;
export type TabNavigationProps = MaterialBottomTabScreenProps<TabParams>;
