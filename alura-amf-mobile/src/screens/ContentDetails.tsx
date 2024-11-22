import { RouteProp, useRoute } from "@react-navigation/native";
import { Text, StyleSheet, View } from "react-native";
import { Video, ResizeMode } from "expo-av"; // Importa o componente Video do expo-av
import { Screen } from "../components/base/Screen";
import Auth from "../components/base/Auth";
import { StackNavigationParams } from "../../App";
import { useCallback, useEffect, useState } from "react";
import ContentService from "../services/api/ContentService";
import { ContentDetailsType } from "../types/contentTypes";

const ContentDetails: React.FC<{}> = () => {
  const { params } =
    useRoute<RouteProp<StackNavigationParams, "ContentDetails">>();
  const id = params.id;
  const [content, setContent] = useState<ContentDetailsType | null>(null);
  const [contentFile, setContentFile] = useState<string | null>(null);

  const getContent = useCallback(async () => {
    const response = await ContentService.GetContent(id);
    if (!response) {
      return;
    }
    setContent(response.Data);
  }, [id]);

  const downloadContentFile = useCallback(async () => {
    if (content && content.type === "video") {
      const url = `${process.env.EXPO_PUBLIC_API_URL}${content.path}`;
      const response = await ContentService.downloadVideo(url);
      console.log(response);
      if (response) {
        setContentFile(response); // Base64 gerado
      }
    }
  }, [content]);

  useEffect(() => {
    getContent();
    downloadContentFile();
  }, [getContent, downloadContentFile]);

  return (
    <Auth>
      <Screen>
        <Text>{content?.title}</Text>
        <Text>{content?.description}</Text>
        {content?.type === "video" && contentFile ? (
          <View style={styles.videoContainer}>
            <Video
              source={{ uri: contentFile }} // Passa a URI do vídeo em Base64
              style={styles.video}
              useNativeControls // Habilita controles (play, pause, etc.)
              shouldPlay // Começa automaticamente
              resizeMode={ResizeMode.CONTAIN}
            />
          </View>
        ) : (
          <Text>Carregando vídeo...</Text>
        )}
      </Screen>
    </Auth>
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    width: "100%",
    height: 300,
    marginVertical: 20,
  },
  video: {
    width: "100%",
    height: "100%",
  },
});

export default ContentDetails;
