import React, { useState } from 'react';
import { TamaguiProvider, YStack, Input, Button, Text } from 'tamagui';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);

  const handleAuthenticationSuccess = async () => {
    // Clear AsyncStorage upon successful login
    try {
      await AsyncStorage.clear();
      console.log('AsyncStorage cleared upon login');
    } catch (e) {
      console.error('Failed to clear AsyncStorage:', e);
    }

    // Navigate to the main app
    router.replace('/(tabs)');
  };

  const handleGoogleSignIn = () => {
    Alert.alert(
      'Mock Authentication',
      'This is a mock login. You can proceed by clicking "OK".',
      [
        {
          text: 'OK',
          onPress: handleAuthenticationSuccess,
        },
      ],
      { cancelable: false }
    );
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setEmail('user@example.com');
    setPassword('password123');
    setError(null);
  };

  const handleSubmit = () => {
    Alert.alert(
      'Mock Authentication',
      'This is a mock login. You can proceed by clicking "OK".',
      [
        {
          text: 'OK',
          onPress: handleAuthenticationSuccess,
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <TamaguiProvider>
      <YStack f={1} jc="center" ai="center" p="$4" space>
        <Text fontSize="$8" fontWeight="bold" marginBottom="$3">
          {isLogin ? 'Login' : 'Sign Up'}
        </Text>
        {error && (
          <Text color="red" mb="$2">
            {error}
          </Text>
        )}
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          width={250}
          padding="$3"
        />
        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          width={250}
          padding="$3"
        />
        <Button
          theme="pink"
          onPress={handleSubmit}
          width={150}
          padding="$2"
          mt="$2"
          icon={<Icon name="login" size={20} color="black" />}
        >
          {isLogin ? 'Login' : 'Sign Up'}
        </Button>
        <Button
          theme="gray"
          onPress={handleGoogleSignIn}
          width={150}
          padding="$2"
          mt="$2"
          icon={<Icon name="google" size={20} color="black" />}
        >
          Sign in with Google
        </Button>
        <Button
          theme="gray"
          onPress={toggleAuthMode}
          width={150}
          padding="$2"
          mt="$2"
        >
          {isLogin ? 'Go to Sign Up' : 'Go to Login'}
        </Button>
      </YStack>
    </TamaguiProvider>
  );
}
