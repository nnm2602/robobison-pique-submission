// chat-session.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack, Text, Button, XStack, Circle } from 'tamagui';
import { useLocalSearchParams } from 'expo-router';
import { format } from 'date-fns';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useChatContext } from './ChatContext';
import { Image } from 'react-native';


interface Message {
  id: string;
  text: string;
  sender: 'user' | 'matched';
  timestamp: Date;
  read?: boolean;
}

export default function ChatSession() {
  const { userId, userName, userImage } = useLocalSearchParams<{
    userId: string;
    userName: string;
    userImage?: any;
  }>();
  const flatListRef = useRef<FlatList>(null);

  const { messages, addMessage } = useChatContext();
  const [input, setInput] = useState('');

  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  const sampleResponses = [
    "Hey! How are you?",
    "That's interesting! Tell me more.",
    "I totally understand what you mean.",
    "That's great to hear!",
    "Really? I didn't know that!",
    "Sounds like fun!",
    "What are your plans for later?",
    "I agree with you on that.",
  ];

  useEffect(() => {
    // Load messages for this chat
    setChatMessages(messages[userId as string] || []);
  }, [messages, userId]);

  const sendMessage = () => {
    if (input.trim() === '') return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
      read: false,
    };
    addMessage(userId as string, newMessage);
    setInput('');

    // Simulate typing delay then send response
    setTimeout(() => {
      const randomResponse =
        sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: 'matched',
        timestamp: new Date(),
        read: true,
      };
      addMessage(userId as string, responseMessage);
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 1500); // 1.5 second delay

    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';

    return (
      <XStack
        alignSelf={isUser ? 'flex-end' : 'flex-start'}
        space="$2"
        margin="$1"
        alignItems="flex-end"
      >
        {!isUser && (
          <Circle size={30} overflow="hidden">
            {userImage ? (
              <Image
                source={userImage}
                style={{ width: 30, height: 30 }}
              />
            ) : (
              <Ionicons name="person" size={20} color="#666" />
            )}
          </Circle>
        )}

        <YStack maxWidth="75%">
          <YStack
            backgroundColor={isUser ? '$pink8' : '$gray3'}
            padding="$3"
            borderRadius="$4"
            borderBottomLeftRadius={!isUser ? 0 : '$4'}
            borderBottomRightRadius={isUser ? 0 : '$4'}
          >
            <Text color={isUser ? 'white' : '$gray12'}>{item.text}</Text>
          </YStack>
          <XStack
            space="$1"
            alignSelf={isUser ? 'flex-end' : 'flex-start'}
            paddingTop="$1"
            alignItems="center"
          >
            <Text fontSize="$2" color="$gray9">
              {format(new Date(item.timestamp), 'HH:mm')}
            </Text>
            {isUser && (
              <Ionicons
                name={item.read ? 'checkmark-done' : 'checkmark'}
                size={16}
                color={item.read ? '#34B7F1' : '#A0A0A0'}
              />
            )}
          </XStack>
        </YStack>
      </XStack>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}> {/* Add SafeAreaView */}
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <YStack flex={1} backgroundColor="white">
        <YStack
          padding="$4"
          borderBottomWidth={1}
          borderBottomColor="$gray5"
          backgroundColor="white"
        >
          <XStack space="$2" alignItems="center">
            <Circle size={40} overflow="hidden">
              {userImage ? (
                <Image
                  source={userImage}
                  style={{ width: 40, height: 40 }}
                />
              ) : (
                <Ionicons name="person" size={25} color="#666" />
              )}
            </Circle>
            <Text fontSize="$6" fontWeight="600" color="$gray12">
              {userName}
            </Text>
          </XStack>
        </YStack>

        <YStack flex={1}>
          <FlatList
            ref={flatListRef}
            data={chatMessages}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingTop: 16,
            }}
          />
        </YStack>

        <YStack
          flexDirection="row"
          padding="$4"
          space="$2"
          borderTopWidth={1}
          borderTopColor="$gray5"
          backgroundColor="white"
        >
          <TextInput
          style={styles.input}
          placeholder="Message..."
          value={input}
          onChangeText={setInput}
          multiline
          blurOnSubmit={false}
          onKeyPress={({ nativeEvent }) => {
            if (nativeEvent.key === 'Enter') {
              sendMessage();
            }
          }}
          />
          <Button
            circular
            size="$4"
            backgroundColor="$pink8"
            onPress={sendMessage}
            disabled={input.trim() === ''}
            opacity={input.trim() === '' ? 0.5 : 1}
          >
            <Ionicons name="send" size={20} color="white" />
          </Button>
        </YStack>
      </YStack>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    backgroundColor: '#F0F2F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    maxHeight: 100,
  },
});
