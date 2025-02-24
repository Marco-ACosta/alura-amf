import {
  CreatePlaylistType,
  PlaylistDetailsType,
  PlaylistsType,
  UpdatePlaylistType,
} from "../../types/playlistTypes";
import { LocalStorage } from "../../utils/LocalStorage";
import Endpoints from "./base/Endpoints";

export default class PlaylistService extends Endpoints {
  static async GetPlaylists() {
    const token = await LocalStorage.apiToken.get();
    const studentId = await LocalStorage.userId.get();
    if (!token || !studentId) {
      return null;
    }
    const response = await Endpoints.Get<PlaylistsType[]>({
      url: `playlists/${studentId}`,
      authorization: `Bearer ${token}`,
    });
    return response;
  }
  static async GetPlaylist(id: string) {
    const token = await LocalStorage.apiToken.get();
    const studentId = await LocalStorage.userId.get();
    if (!token || !studentId) {
      return null;
    }
    const response = await Endpoints.Get<PlaylistDetailsType>({
      url: `playlists/${studentId}/${id}`,
      authorization: `Bearer ${token}`,
    });
    return response;
  }
  static async DeletePlaylist(id: string) {
    const token = await LocalStorage.apiToken.get();
    const studentId = await LocalStorage.userId.get();
    if (!token || !studentId) {
      return null;
    }
    const response = await Endpoints.Delete({
      url: `playlists/${studentId}/${id}`,
      authorization: `Bearer ${token}`,
    });
    return response;
  }

  static async CreatePlaylist(data: CreatePlaylistType) {
    const token = await LocalStorage.apiToken.get();
    const studentId = await LocalStorage.userId.get();
    if (!token || !studentId) {
      return null;
    }
    const response = await Endpoints.Post({
      url: `playlists`,
      authorization: `Bearer ${token}`,
      body: data,
    });
    return response;
  }

  static async AddContentToPlaylist(
    id: string,
    contentId: string,
    studentId: string,
  ) {
    const token = await LocalStorage.apiToken.get();
    if (!token) {
      return null;
    }
    const response = await Endpoints.Put<any>({
      url: `playlists/${studentId}/${id}/add-content`,
      authorization: `Bearer ${token}`,
      body: { contentId },
    });
    return response;
  }

  static async RemoveContentFromPlaylist(
    id: string,
    contentId: string,
    studentId: string,
  ) {
    const token = await LocalStorage.apiToken.get();
    if (!token) {
      return null;
    }
    const response = await Endpoints.Put<any>({
      url: `playlists/${studentId}/${id}/remove-content`,
      authorization: `Bearer ${token}`,
      body: { contentId },
    });
    return response;
  }

  static async UpdatePlaylist(
    data: UpdatePlaylistType,
    id: string,
    studentId: string,
  ) {
    const token = await LocalStorage.apiToken.get();
    if (!token || !studentId) {
      return null;
    }
    const response = await Endpoints.Put<any>({
      url: `playlists/${studentId}/${id}`,
      authorization: `Bearer ${token}`,
      body: data,
    });
    return response;
  }
}
