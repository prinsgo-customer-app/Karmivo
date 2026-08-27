import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Home, User as UserIcon, List, Bell, Wallet as WalletIcon, Wrench } from 'lucide-react-native';

import { SplashScreen } from '../screens/SplashScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { OtpScreen } from '../screens/OtpScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ServicesScreen } from '../screens/ServicesScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ServiceDetailsScreen } from '../screens/ServiceDetailsScreen';
import { BookingScreen } from '../screens/BookingScreen';
import { OrdersScreen } from '../screens/OrdersScreen';
import { OrderDetailsScreen } from '../screens/OrderDetailsScreen';
import { WalletScreen } from '../screens/WalletScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { HelpCenterScreen } from '../screens/HelpCenterScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { AddressesScreen } from '../screens/AddressesScreen';
import { AddAddressScreen } from '../screens/AddAddressScreen';
import { ReviewsScreen } from '../screens/ReviewsScreen';
import { SafetyScreen } from '../screens/SafetyScreen';
import { LanguageScreen } from '../screens/LanguageScreen';
import { ReferralScreen } from '../screens/ReferralScreen';

import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Services"
        component={ServicesScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Wrench color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          tabBarIcon: ({ color, size }) => <List color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          tabBarIcon: ({ color, size }) => <WalletIcon color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <UserIcon color={color} size={size} />
        }}
      />
    </Tab.Navigator>
  );
};

export const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true, headerBackVisible: false, headerTintColor: colors.primary }}>
        {/* Auth & Setup */}
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Otp" component={OtpScreen} options={{ headerShown: false }} />

        {/* Main App */}
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />

        {/* Detail Screens */}
        <Stack.Screen name="ServiceDetails" component={ServiceDetailsScreen} options={{ title: 'Service Details', headerBackVisible: true }} />
        <Stack.Screen name="Booking" component={BookingScreen} options={{ title: 'Book Service', headerBackVisible: true }} />
        <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} options={{ title: 'Order Details', headerBackVisible: true }} />

        {/* Profile Sub-screens */}
        <Stack.Screen name="Addresses" component={AddressesScreen} options={{ title: 'Saved Addresses', headerBackVisible: true }} />
        <Stack.Screen name="AddAddress" component={AddAddressScreen} options={{ title: 'Add New Address', headerBackVisible: true }} />
        <Stack.Screen name="Reviews" component={ReviewsScreen} options={{ title: 'My Reviews', headerBackVisible: true }} />
        <Stack.Screen name="Safety" component={SafetyScreen} options={{ title: 'Safety & Emergency', headerBackVisible: true }} />
        <Stack.Screen name="Language" component={LanguageScreen} options={{ title: 'Language', headerBackVisible: true }} />
        <Stack.Screen name="Referral" component={ReferralScreen} options={{ title: 'Refer & Earn', headerBackVisible: true }} />

        <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notifications', headerBackVisible: true }} />
        <Stack.Screen name="HelpCenter" component={HelpCenterScreen} options={{ title: 'Help & Support', headerBackVisible: true }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings', headerBackVisible: true }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
