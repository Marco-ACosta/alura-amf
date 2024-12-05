import { RouteProp, useRoute } from "@react-navigation/native";
import { Text, StyleSheet, Image, ScrollView } from "react-native";
import { Video, ResizeMode } from "expo-av"; // Importa o componente Video do expo-av
import { Screen } from "../components/base/Screen";
import Auth from "../components/base/Auth";
import { StackNavigationParams } from "../../App";
import { useCallback, useEffect, useState } from "react";
import ContentService from "../services/api/ContentService";
import { ContentDetailsType } from "../types/contentTypes";
import Loading from "../components/base/Loading";

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
        <ScrollView style={styles.container}>
          {content && (
            <>
              <Text style={styles.title}>{content.title}</Text>
              <Image
                source={{ uri: content.thumbnail }}
                style={styles.thumbnail}
              />
              {content.type === "video" && contentFile ? (
                <Video
                  source={{ uri: contentFile }} // Passa a URI do vídeo em Base64
                  style={styles.video}
                  useNativeControls // Habilita controles (play, pause, etc.)
                  shouldPlay // Começa automaticamente
                  resizeMode={ResizeMode.CONTAIN}
                />
              ) : (
                <Screen>{Loading()}</Screen>
              )}
              <Text style={styles.description}>{content.description}</Text>
            </>
          )}
        </ScrollView>
      </Screen>
    </Auth>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  thumbnail: {
    width: 300,
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
    borderRadius: 10,
  },
  description: {
    textAlign: "justify",
    marginBottom: 20,
  },
  video: {
    width: "100%",
    height: 300,
    marginVertical: 20,
  },
  loadingText: {
    textAlign: "center",
    fontSize: 20,
    marginBottom: 20,
  },
});

export default ContentDetails;
