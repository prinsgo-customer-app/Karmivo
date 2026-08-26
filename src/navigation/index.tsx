import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Home, User as UserIcon, List, Bell, Wallet as WalletIcon } from 'lucide-react-native';

import { SplashScreen } from '../screens/SplashScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ServiceDetailsScreen } from '../screens/ServiceDetailsScreen';
import { BookingScreen } from '../screens/BookingScreen';
import { OrdersScreen } from '../screens/OrdersScreen';
import { WalletScreen } from '../screens/WalletScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { HelpCenterScreen } from '../screens/HelpCenterScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

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
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Bell color={color} size={size} />
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

        {/* Main App */}
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />

        {/* Detail Screens */}
        <Stack.Screen name="ServiceDetails" component={ServiceDetailsScreen} options={{ title: 'Service Details', headerBackVisible: true }} />
        <Stack.Screen name="Booking" component={BookingScreen} options={{ title: 'Book Service', headerBackVisible: true }} />

        {/* Profile Sub-screens */}
        <Stack.Screen name="HelpCenter" component={HelpCenterScreen} options={{ title: 'Help & Support', headerBackVisible: true }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Account Settings', headerBackVisible: true }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
