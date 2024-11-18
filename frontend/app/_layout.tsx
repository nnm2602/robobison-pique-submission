import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { TamaguiProvider, createTamagui } from 'tamagui';
import { config } from '@tamagui/config/v3';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import AuthScreen from './index'; // Adjust this path to where your AuthScreen is located
import { Tabs } from 'expo-router';
import React from 'react';
import { StatusBar } from 'react-native';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';

import ToastProvider from "./ToastProvider"
import { ChatProvider } from './ChatContext';

// you usually export this from a tamagui.config.ts file
const tamaguiConfig = createTamagui(config);

// TypeScript types across all Tamagui APIs
type Conf = typeof tamaguiConfig;
declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Load both "SpaceMono" and "Inter" fonts
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Inter: require('../assets/fonts/Inter-Regular.ttf'),
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded || isLoggedIn === null) {
    return null;
  }

  return (
    <ChatProvider>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content" // Match with `barStyle` in app.json
      />
      <ThemeProvider value={DefaultTheme}>
        <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
          <ToastProvider>
            <Stack
              screenOptions={{
                headerShown: false, // Hide header in all stack screens
              }}
            >
              {!isLoggedIn ? (
                <Stack.Screen name="index" options={{ headerShown: false }} />
              ) : (
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              )}
              <Stack.Screen name="+not-found" options={{ headerShown: false }} />
            </Stack>
          </ToastProvider>
        </TamaguiProvider>
      </ThemeProvider>
    </ChatProvider>
  );
}

export function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'home' : 'home-outline'}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
