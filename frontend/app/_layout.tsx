// RootLayout.jsx or RootLayout.tsx

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { TamaguiProvider, createTamagui } from 'tamagui';
import { config } from '@tamagui/config/v3';

import { Tabs } from 'expo-router';
import React from 'react';
import { StatusBar } from 'react-native';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';

import ToastProvider from "./ToastProvider";
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

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
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
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
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
