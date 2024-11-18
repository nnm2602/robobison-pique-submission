// detailed-screen.tsx
import { hardcodedUsers, User } from '../hooks/mockData';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ImageBackground, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { Button, Spinner, Text, XStack, YStack } from 'tamagui';
import { useChatContext } from './ChatContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DetailedScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<User['profile'] | null>(null);
  const [isMatch, setIsMatch] = useState(false);

  const opacity = useSharedValue(1);
  const params = useLocalSearchParams();
  const { _id, isOwnProfile } = params;

  const { addMatch, matches } = useChatContext();

  useEffect(() => {
    if(_id != "0") { 
    // Simulate data fetching
    setTimeout(() => {
      const user = hardcodedUsers.find((user) => user._id === _id);
      if (user) {
        setProfileData(user.profile);
        // Check if already matched
        const matched = matches.find((u) => u._id === user._id);
        setIsMatch(!!matched);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Profile data not found',
          position: 'top',
        });
      }
      setIsLoading(false);
    }, 1000);
  } else { 
    const loadProfile = async () => {
      try {
        const profileDataString = await AsyncStorage.getItem('profileData');
        if (profileDataString) {
          const profileData = JSON.parse(profileDataString);
          setProfileData(profileData); 
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        Toast.show({
          type: 'error',
          text1: 'Failed to load profile',
          position: 'top',
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }

  }, [_id, matches]);

  const contentStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacity.value, { duration: 200 }),
    };
  });

  function goBack() {
    try {
      router.back();
    } catch (error) {
      router.replace('/(tabs)/explore');
    }
  }

  const likeUser = (likedUserId: string) => {
    const user = hardcodedUsers.find((user) => user._id === likedUserId);
    if (user) {
      addMatch(user);
      Toast.show({
        type: 'success',
        text1: "It's a match!",
        position: 'top',
      });
      setIsMatch(true);
      // Navigate to chat screen
      router.push({
        pathname: '/chat-session',
        params: {
          userId: user._id,
          userName: user.profile.firstName,
          userImage: user.profile.imageUri,
        },
      });
    }
  };

  const navigateToChat = (otherUserId: string) => {
    const user = hardcodedUsers.find((user) => user._id === otherUserId);
    if (user) {
      router.push({
        pathname: '/chat-session',
        params: {
          userId: user._id,
          userName: user.profile.firstName,
          userImage: user.profile.imageUri,
        },
      });
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <Spinner size="large" color="$pink10" />
      </View>
    );
  }

  if (!profileData) {
    return (
      <View style={styles.loaderContainer}>
        <Text>Profile data not available</Text>
      </View>
    );
  }

  const { firstName, lastName, bio, imageUri } = profileData;

  const imageSource =
    typeof imageUri === 'string'
      ? { uri: imageUri }
      : imageUri;

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={imageSource}
        style={{ flex: 1 }}
      >
        <Pressable
          style={{ flex: 1 }}
          onPressIn={() => {
            opacity.value = 0;
          }}
          onPressOut={() => {
            opacity.value = 1;
          }}
        >
          <Animated.View style={[{ flex: 1 }, contentStyle]}>
            <YStack flex={1} backgroundColor="rgba(0, 0, 0, 0.4)">
              {/* Profile Details */}
              <YStack
                position="absolute"
                bottom={0}
                width="100%"
                padding="$4"
                space
              >
                <YStack>
                  <Text fontSize="$10" color="white">
                    {`${firstName} ${lastName}`}
                  </Text>
                </YStack>

                {/* Bio */}
                <YStack style={styles.bioContainer}>
                  <LinearGradient
                    colors={[
                      'rgba(255, 255, 255, 0.1)',
                      'rgba(255, 255, 255, 0.05)',
                    ]}
                    style={StyleSheet.absoluteFill}
                  />
                  <Text
                    color="#fff"
                    textAlign="justify"
                    paddingVertical="$4"
                    paddingHorizontal="$4"
                    fontSize="$6"
                  >
                    {bio || 'No bio available'}
                  </Text>
                </YStack>

                <XStack
                  justifyContent="center"
                  marginTop="$1"
                  marginBottom="$3"
                >
                  <Button
                    onPress={
                      isOwnProfile === 'true'
                        ? goBack
                        : isMatch
                        ? () => navigateToChat(_id as string)
                        : () => likeUser(_id as string)
                    }
                    size="$8"
                    backgroundColor="transparent"
                    borderRadius={20}
                    style={{
                      backgroundColor: 'transparent',
                      borderWidth: 0,
                      elevation: 0,
                      shadowOpacity: 0,
                    }}
                    icon={
                      <Ionicons
                        name={
                          isOwnProfile === 'true'
                            ? 'create-outline'
                            : isMatch
                            ? 'send'
                            : 'heart'
                        }
                        size={
                          isOwnProfile === 'true' ? 50 : isMatch ? 50 : 80
                        }
                        color="white"
                      />
                    }
                  />
                </XStack>
              </YStack>
            </YStack>
          </Animated.View>
        </Pressable>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  bioContainer: {
    width: '100%',
    marginTop: 16,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  loaderContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});
