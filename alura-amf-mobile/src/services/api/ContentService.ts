import { ContentType, ContentDetailsType } from "../../types/contentTypes";
import { LocalStorage } from "../../utils/LocalStorage";
import Endpoints from "./base/Endpoints";

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
    const response = await Endpoints.Get<Response>({
      url: imageURl,
      authorization: `Bearer ${token}`,
    });
    const blob = await response.Data.blob();
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const uri = reader.result as string;
      return uri;
    };
  }
}
