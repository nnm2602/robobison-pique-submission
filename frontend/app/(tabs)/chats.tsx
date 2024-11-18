import React from 'react';
import { FlatList, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { YStack, XStack, Text } from 'tamagui';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useChatContext } from '../ChatContext';
import { User } from '../../hooks/mockData';

export default function ChatsScreen() {
  const router = useRouter();
  const { matches } = useChatContext();

  const renderItem = ({ item }: { item: User }) => {
    const imageSource: ImageSourcePropType = typeof item.profile.imageUri === 'string'
      ? { uri: item.profile.imageUri }
      : item.profile.imageUri || require('../../assets/profile_pictures/profile1.jpeg');

    return (
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: '/chat-session',
            params: {
              userId: item._id,
              userName: item.profile.firstName,
              userImage: item.profile.imageUri,
            },
          })
        }
      >
        <YStack padding="$4" backgroundColor="white">
          <XStack alignItems="center" justifyContent="space-between">
            <XStack alignItems="center">
              {imageSource ? (
                <Image
                  source={imageSource}
                  style={{ width: 50, height: 50, borderRadius: 25 }}
                />
              ) : (
                <Ionicons
                  size={50}
                  name="person-circle-outline"
                  color="#808080"
                />
              )}
              <YStack marginLeft="$3">
                <Text fontSize="$5" fontWeight="bold">
                  {item.profile.firstName} {item.profile.lastName}
                </Text>
              </YStack>
            </XStack>
            <Ionicons name="chevron-forward" size={20} color="#BDBDBD" />
          </XStack>
        </YStack>
      </TouchableOpacity>
    );
  };

  return (
    <YStack flex={1} backgroundColor="#fff" paddingVertical="$10">
      <Text
        fontSize="$7"
        fontWeight="bold"
        textAlign="center"
        marginBottom="$4"
      >
        Recent Chats
      </Text>
      {matches.length === 0 ? (
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Text>No matches yet.</Text>
        </YStack>
      ) : (
        <FlatList
          data={matches}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => (
            <YStack height={1} backgroundColor="#E0E0E0" />
          )}
          contentContainerStyle={{ paddingVertical: 10 }}
        />
      )}
    </YStack>
  );
}
