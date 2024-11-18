// Frontend/hooks/useStorage.ts
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export async function uploadImageAsync(uri: string) {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const storageRef = ref(storage, `profile-images/${filename}`);
    
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}