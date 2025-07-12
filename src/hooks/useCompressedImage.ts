// src/hooks/useCompressedImage.ts
import * as ImageManipulator from 'expo-image-manipulator';

export async function compressImage(uri: string): Promise<{ uri: string; name: string; type: string } | null> {
  try {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 600 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );

    return {
      uri: result.uri,
      name: 'profile_photo.jpg',
      type: 'image/jpeg',
    };
  } catch (err) {
    console.error('Image compression failed:', err);
    return null;
  }
}
