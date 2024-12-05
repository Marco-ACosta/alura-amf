import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { ContentCardType } from "../types/contentTypes";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackNavigationParams } from "../../App";
import ContentService from "../services/api/ContentService";
import CustomButton from "./CustomButton";
import PlaylistService from "../services/api/PlaylistService";

type ContentStackUseNavigationProps = StackNavigationProp<
  StackNavigationParams,
  "Tabs" | "ContentDetails"
>;

const { width, height } = Dimensions.get("window");

const ContentCard: React.FC<ContentCardType> = ({
  content: { id, title, thumbnail, duration },
  isInPlaylist,
  playlistId,
  studentId,
  onLongPress,
}) => {
  const stackNavigation = useNavigation<ContentStackUseNavigationProps>();
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);
  const imageURL = `${process.env.EXPO_PUBLIC_API_URL}${thumbnail}`;

  const downloadImage = useCallback(async () => {
    try {
      const response = await ContentService.downloadThumbnail(imageURL);
      if (response) {
        const reader = new FileReader();
        reader.readAsDataURL(response);
        reader.onloadend = () => {
          setLocalImageUri(reader.result as string);
        };
      }
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  }, [imageURL]);

  useEffect(() => {
    const load = async () => {
      await downloadImage();
    };
    load();
  }, [downloadImage]);

  const handleNavigation = async () => {
    stackNavigation.navigate("ContentDetails", { id });
  };

  const handleAddToPlaylist = async () => {
    stackNavigation.navigate("AddContentToPlaylist", { id });
  };

  const handleRemoveFromPlaylist = async () => {
    if (!playlistId || !studentId) {
      alert("Selecione uma playlist");
      stackNavigation.navigate("Playlists");
      return;
    }
    const response = await PlaylistService.RemoveContentFromPlaylist(
      playlistId,
      id,
      studentId,
    );
    if (response) {
      if (response.Success) {
        alert("Conteudo removido da playlist");
        stackNavigation.navigate("Playlists");
      } else {
        console.log(response.Data.errors);
        alert(
          `Erro ao remover conteudo da playlist: ${response.Data.errors[0].message}`,
        );
        stackNavigation.navigate("Playlists");
      }
    }
  };

  return (
    <TouchableOpacity
      onPress={handleNavigation}
      onLongPress={onLongPress}
      style={styles.card}
    >
      <View style={styles.innerContainer}>
        <Image
          source={{
            uri: localImageUri ?? undefined,
          }}
          style={styles.thumbnail}
        />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.duration}>{duration} minutos</Text>

        {isInPlaylist ? (
          <CustomButton
            title="Remover da playlist"
            btnBackground="red"
            btnWidth="50%"
            btnBorder={{ radius: 10, px: 0 }}
            onPress={handleRemoveFromPlaylist}
          />
        ) : (
          <CustomButton
            title="Adicionar a playlist"
            btnBackground="#2196f3"
            btnWidth="50%"
            btnBorder={{ radius: 10, px: 0 }}
            onPress={handleAddToPlaylist}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
    margin: 10,
    overflow: "hidden",
    justifyContent: "center",
  },
  innerContainer: {
    alignItems: "center",
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
    textAlign: "center",
  },
  thumbnail: {
    width: width * 0.8,
    height: height * 0.3,
    borderRadius: 8,
  },
  duration: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
});

export default ContentCard;
