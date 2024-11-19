import React, { useCallback, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { ContentType } from "../types/contentTypes";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackNavigationParams } from "../../App";
import { LocalStorage } from "../utils/LocalStorage";

type ContentStackUseNavigationProps = StackNavigationProp<
  StackNavigationParams,
  "Tabs" | "ContentDetails"
>;

const ContentCard: React.FC<ContentType> = ({
  id,
  type,
  title,
  isActive,
  createdAt,
  thumbnail,
  thumbnailFormat,
  duration,
}) => {
  const stackNavigation = useNavigation<ContentStackUseNavigationProps>();
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);
  const imageURL = `${process.env.EXPO_PUBLIC_API_URL}${thumbnail}`;

  const downloadImage = useCallback(
    async (token: string) => {
      try {
        const response = await fetch(imageURL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const blob = await response.blob();
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const uri = reader.result as string;
          setLocalImageUri(uri);
        };
      } catch (error) {
        console.error("Failed to download image:", error);
      }
    },
    [imageURL],
  );

  useEffect(() => {
    const load = async () => {
      const token = await LocalStorage.apiToken.get();
      if (!token) {
        stackNavigation.navigate("Login");
      }
      await downloadImage(token!);
    };
    load();
  }, [downloadImage, stackNavigation]);

  const handleNavigation = async () => {
    stackNavigation.navigate("ContentDetails", { id });
  };

  return (
    <TouchableOpacity onPress={handleNavigation}>
      <View style={styles.container}>
        <Image
          source={{
            uri: localImageUri ?? undefined,
          }}
          height={100}
          width={200}
          style={styles.thumbnail}
          alt={title}
        />
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.duration}>{duration} mins</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: "#ccc",
    width: "100%",
  },
  thumbnail: {
    borderWidth: 1,
    borderColor: "#000000",
  },
  title: {
    fontSize: 16,
    color: "#333",
    width: "100%",
  },
  duration: {
    fontSize: 12,
    color: "#666",
    width: "100%",
  },
});

export default ContentCard;