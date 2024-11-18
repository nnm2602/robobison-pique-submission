// ChatContext.tsx
import React, { createContext, useState, useContext } from 'react';
import { User } from '../hooks/mockData';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'matched';
  timestamp: Date;
  read?: boolean;
}

interface ChatContextProps {
  matches: User[];
  addMatch: (user: User) => void;
  messages: { [userId: string]: Message[] };
  addMessage: (userId: string, message: Message) => void;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [matches, setMatches] = useState<User[]>([]);
  const [messages, setMessages] = useState<{ [userId: string]: Message[] }>({});

  const addMatch = (user: User) => {
    setMatches((prevMatches) => {
      if (!prevMatches.find((u) => u._id === user._id)) {
        return [...prevMatches, user];
      }
      return prevMatches;
    });
  };

  const addMessage = (userId: string, message: Message) => {
    setMessages((prevMessages) => {
      const userMessages = prevMessages[userId] || [];
      return {
        ...prevMessages,
        [userId]: [...userMessages, message],
      };
    });
  };

  return (
    <ChatContext.Provider value={{ matches, addMatch, messages, addMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};
