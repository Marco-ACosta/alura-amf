import { ContentType, ContentDetailsType } from "../../types/contentTypes";
import { LocalStorage } from "../../utils/LocalStorage";
import Endpoints from "./base/Endpoints";
import * as FileSystem from "expo-file-system";
export default class ContentService extends Endpoints {
  static async GetContents() {
    const token = await LocalStorage.apiToken.get();
    if (!token) {
      return null;
    }
    const response = await Endpoints.Get<ContentType[]>({
      url: "content",
      authorization: `Bearer ${token}`,
    });
    return response;
  }
  static async GetContent(id: string) {
    const token = await LocalStorage.apiToken.get();
    if (!token) {
      return null;
    }
    const response = await Endpoints.Get<ContentDetailsType>({
      url: `content/${id}`,
      authorization: `Bearer ${token}`,
    });
    return response;
  }

  static async downloadThumbnail(imageURl: string) {
    const token = await LocalStorage.apiToken.get();
    if (!token) {
      return null;
    }
    const response = await fetch(imageURl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.blob();
  }

  static async downloadVideo(videoURL: string): Promise<string | null> {
    const token = await LocalStorage.apiToken.get();
    if (!token) {
      console.error("Token de autenticação não encontrado.");
      return null;
    }

    try {
      // Diretório temporário para salvar o vídeo
      const videoPath = `${FileSystem.cacheDirectory}downloaded_video.mp4`;

      const response = await FileSystem.downloadAsync(videoURL, videoPath, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status !== 200) {
        console.error("Falha no download do vídeo:", response.status);
        return null;
      }

      console.log("Vídeo baixado com sucesso:", response.uri);
      return response.uri; // Retorna o caminho local do vídeo
    } catch (error) {
      console.error("Erro ao baixar o vídeo:", error);
      return null;
    }
  }
}
