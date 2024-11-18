import React, { useState, useEffect } from 'react';
import { StyleSheet, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { YStack, Text, Input, Button, Spinner } from 'tamagui';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TabTwoScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [bio, setBio] = useState('');

  // New state variables
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  // Load profile data from AsyncStorage when the component mounts
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileDataString = await AsyncStorage.getItem('profileData');
        if (profileDataString) {
          const profileData = JSON.parse(profileDataString);

          setFirstName(profileData.firstName || '');
          setLastName(profileData.lastName || '');
          setDateOfBirth(profileData.dateOfBirth ? new Date(profileData.dateOfBirth) : new Date());
          setBio(profileData.bio || '');
          setImageUri(profileData.imageUri || null);
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
  }, []);

  // Loading indicator
  if (isLoading) {
    return (
      <YStack f={1} jc="center" ai="center">
        <Spinner size="large" color="$pink10" />
      </YStack>
    );
  }

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (!permissionResult.granted) {
      alert('Permission to access camera roll is required!');
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!result.canceled && result.assets && result.assets.length > 0) {
      try {
        setIsLoading(true);
        let localUri = result.assets[0].uri;
  
        // Check if documentDirectory is available
        if (FileSystem.documentDirectory == null) {
          throw new Error('Unable to access document directory');
        }
  
        // Copy the image to a persistent location
        const fileName = localUri.split('/').pop();
        const newPath = FileSystem.documentDirectory + fileName;
  
        await FileSystem.copyAsync({
          from: localUri,
          to: newPath,
        });
  
        setImageUri(newPath);
        Toast.show({
          type: 'success',
          text1: 'Profile picture updated successfully',
          position: 'top',
        });
      } catch (error) {
        console.error(error);
        Toast.show({
          type: 'error',
          text1: 'Failed to update profile picture',
          position: 'top',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const saveAndViewProfile = async () => {
      // Prepare the profile data
      const profileData = {
        firstName,
        lastName,
        dateOfBirth: dateOfBirth.toISOString(),
        bio,
        imageUri,
      };

        // Save profile data to AsyncStorage
        await AsyncStorage.setItem('profileData', JSON.stringify(profileData));

        Toast.show({
          type: 'success',
          text1: 'Your Profile has been updated',
          position: 'top',
          visibilityTime: 2000,
        });

        // Navigate to detailed-screen with firebaseUID
        router.push({
          pathname: '/detailed-screen',
          params: {
            _id: 0,
            isOwnProfile: 'true', // Flag to identify it's user's own profile
          },
        });
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };

  return (
    <ParallaxScrollView
      headerImage={
        <YStack alignItems="center" mt="$9">
          {/* Your Profile Text */}
          <Text
            fontSize="$7"
            marginBottom="$4"
            fontWeight="bold"
            textAlign="center"
          >
            Your Profile
          </Text>
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={{ width: 150, height: 150, borderRadius: 75 }}
            />
          ) : (
            <Ionicons
              size={150}
              name="person-circle-outline"
              style={styles.icon}
            />
          )}
        </YStack>
      }
      headerBackgroundColor={{ dark: '#ffffff', light: '#ffffff' }} // Use white for both themes
    >
      <Button
        onPress={pickImage}
        theme="pink"
        size="$4"
        width={200}
        alignSelf="center"
        icon={<Icon name="upload" size={20} color="black" />}
      >
        Choose Picture
      </Button>

      {/* First Name Input */}
      <Input
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        width="100%"
        padding="$3"
        borderColor="transparent"
        borderWidth={1}
        borderRadius="$4"
        focusStyle={{ borderColor: '$pink6' }}
      />

      <YStack space="$4">
        <Input
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
          width="100%"
          padding="$3"
          borderColor="transparent"
          borderWidth={1}
          borderRadius="$4"
          focusStyle={{ borderColor: '$pink6' }}
        />

        <YStack space="$4" flexDirection="row" alignItems="center">
          <Text fontSize="$8" fontWeight="bold">
            Birth Day
          </Text>
          {/* Date of Birth Selector */}
          <Button
            onPress={() => setShowDatePicker(true)}
            theme="pink"
            size="$4"
            width={200}
            alignSelf="center"
            icon={<Icon name="calendar" size={20} color="black" />}
          >
            {dateOfBirth ? dateOfBirth.toDateString() : 'Select Date of Birth'}
          </Button>
        </YStack>

        {showDatePicker && (
          <DateTimePicker
            value={dateOfBirth}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}

        <Input
          placeholder="Share something about yourself"
          value={bio}
          onChangeText={setBio}
          width="100%"
          multiline
          minHeight={100}
          padding="$3"
          borderColor="transparent"
          borderWidth={1}
          borderRadius="$4"
          focusStyle={{
            borderColor: '$pink6',
          }}
        />
      </YStack>

      <Button
        onPress={saveAndViewProfile}
        theme="pink"
        size="$4"
        width={200}
        alignSelf="center"
        icon={<Icon name="file-check" size={20} color="black" />}
      >
        Save Profile
      </Button>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  icon: {
    color: '#808080',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
  },
});
