import React, { useState, useEffect, useRef } from 'react';
import { FlatList, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { YStack, XStack, Text, Image, Button, Spinner } from 'tamagui';
import Ionicons from '@expo/vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { hardcodedUsers, User } from '../../hooks/mockData';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

export default function HomeScreen() {
  const [nearbyUsers, setNearbyUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedUsers, setLikedUsers] = useState<User[]>([]);
  const [currentTab, setCurrentTab] = useState<'find' | 'likes'>('find');
  const [hasProfile, setHasProfile] = useState(false);

  const router = useRouter();

  // References to keep track of likes and timeouts
  const likesCountRef = useRef<number>(0);
  const maxLikes = 3;
  const likeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const likedUsersRef = useRef<User[]>([]);

  // Update the ref whenever likedUsers state changes
  useEffect(() => {
    likedUsersRef.current = likedUsers;
  }, [likedUsers]);

  useEffect(() => {
    // Simulate loading nearby users
    setTimeout(() => {
      setNearbyUsers(hardcodedUsers);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Check if the user has a profile
    const checkProfile = async () => {
      try {
        const profileData = await AsyncStorage.getItem('profileData');
        if (profileData) {
          setHasProfile(true);
        } else {
          setHasProfile(false);
        }
      } catch (error) {
        console.error('Error checking profile data:', error);
      }
    };

    checkProfile();
  }, []);

  useEffect(() => {
    if (hasProfile) {
      likesCountRef.current = 0;

      const simulateLike = () => {
        if (likesCountRef.current >= maxLikes) {
          // Stop scheduling new likes
          return;
        }

        // Find a user from hardcodedUsers who hasn't liked us yet
        const unlikedUsers = hardcodedUsers.filter(
          (user) =>
            !likedUsersRef.current.find((likedUser) => likedUser._id === user._id)
        );

        if (unlikedUsers.length === 0) {
          // No more users to like us
          return;
        }

        // Randomly select a user from unlikedUsers
        const randomIndex = Math.floor(Math.random() * unlikedUsers.length);
        const newLiker = unlikedUsers[randomIndex];

        // Add the new liker to likedUsers
        setLikedUsers((prevLikedUsers) => {
          // Ensure no duplicates
          if (prevLikedUsers.find((user) => user._id === newLiker._id)) {
            return prevLikedUsers;
          }
          const updatedLikedUsers = [...prevLikedUsers, newLiker];
          likedUsersRef.current = updatedLikedUsers; // Update the ref
          return updatedLikedUsers;
        });

        // Show a notification
        Toast.show({
          type: 'success',
          text1: `${newLiker.profile.firstName} liked you!`,
          position: 'top', 
        });

        likesCountRef.current++;

        if (likesCountRef.current < maxLikes) {
          // Schedule the next like
          likeTimeoutRef.current = setTimeout(simulateLike, 5000);
        }
      };

      // Start the first like
      simulateLike();
    } else {
      // If profile is not set, reset likes and clear timeout
      likesCountRef.current = 0;
      if (likeTimeoutRef.current) {
        clearTimeout(likeTimeoutRef.current);
        likeTimeoutRef.current = null;
      }
    }

    // Clean up on unmount
    return () => {
      if (likeTimeoutRef.current) {
        clearTimeout(likeTimeoutRef.current);
        likeTimeoutRef.current = null;
      }
    };
  }, [hasProfile]);

  function goDetailedProfile(item: User) {
    router.push({
      pathname: '/detailed-screen',
      params: {
        _id: item._id,
        firebaseUID: item.firebaseUID,
        isOwnProfile: 'false',
      },
    });
  }

  const NearbyUsersTab = () => {
    if (loading) {
      return (
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Spinner size="large" color="$pink10" />
        </YStack>
      );
    }

    if (nearbyUsers.length === 0) {
      return (
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Text>No users nearby.</Text>
        </YStack>
      );
    }

    return (
      <FlatList
        data={nearbyUsers}
        keyExtractor={(item) => item._id}
        renderItem={renderProfileItem}
      />
    );
  };

  const LikedUsersTab = () => {
    if (likedUsers.length === 0) {
      return (
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Text>No users have liked you yet.</Text>
        </YStack>
      );
    }

    return (
      <FlatList
        data={likedUsers}
        keyExtractor={(item) => item._id}
        renderItem={renderProfileItem}
      />
    );
  };

  const renderProfileItem = ({ item }: { item: User }) => (
    <XStack
      onPress={() => goDetailedProfile(item)}
      alignItems="center"
      padding="$3"
      borderBottomWidth={1}
      borderBottomColor="$gray5"
      justifyContent="space-between"
      backgroundColor="white"
    >
      <XStack alignItems="center" gap="$3">
        {item.profile.imageUri ? (
          <Image
            source={
              typeof item.profile.imageUri === 'string'
                ? { uri: item.profile.imageUri }
                : item.profile.imageUri
            }
            style={{ width: 50, height: 50, borderRadius: 25 }}
          />
        ) : (
          <Ionicons
            size={50}
            name="person-circle-outline"
            color="#808080"
          />
        )}
        <YStack>
          <Text fontWeight="bold" fontSize="$5">
            {item.profile.firstName}
          </Text>
          {item.distance && (
            <Text fontSize="$3" color="$gray10">
              {item.distance} away
            </Text>
          )}
        </YStack>
      </XStack>
      <Button
        size="$2"
        theme="pink"
        icon={<Icon name="chevron-right" size={20} color="black" />}
      />
    </XStack>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <YStack flex={1} backgroundColor="white">
        {/* Tab Navigation */}
        <XStack justifyContent="center" paddingTop="$2" paddingBottom="$2">
          <Button
            size="$3"
            color={currentTab === 'find' ? '#fff' : '#000'}
            backgroundColor={currentTab === 'find' ? '$pink8' : '$gray4'}
            onPress={() => setCurrentTab('find')}
            marginEnd="$2"
          >
            Find
          </Button>
          <Button
            size="$3"
            color={currentTab === 'likes' ? '#fff' : '#000'}
            backgroundColor={currentTab === 'likes' ? '$pink8' : '$gray4'}
            onPress={() => setCurrentTab('likes')}
          >
            Likes
          </Button>
        </XStack>

        {/* Conditional Rendering Based on Current Tab */}
        {currentTab === 'find' ? (
          <NearbyUsersTab />
        ) : (
          <LikedUsersTab />
        )}
      </YStack>
    </SafeAreaView>
  );
}
