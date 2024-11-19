import {
  UserData,
  UserUpdateData,
  UserUpdatePasswordData,
} from "../../types/userTypes";
import { LocalStorage } from "../../utils/LocalStorage";
import Endpoints from "./base/Endpoints";

export default class StudentService extends Endpoints {
  static async GetStudent(id: string) {
    const token = await LocalStorage.apiToken.get();
    if (!token) {
      return null;
    }
    const student = await this.Get<UserData>({
      url: `student/${id}`,
      authorization: `Bearer ${token}`,
    });
    return student;
  }

  static async UpdateStudent(data: UserUpdateData, id: string) {
    const token = await LocalStorage.apiToken.get();
    if (!token) {
      return null;
    }
    const student = await this.Put({
      url: `student/${id}`,
      authorization: `Bearer ${token}`,
      body: data,
    });
    return student;
  }

  static async UpdatePassword(data: UserUpdatePasswordData, id: string) {
    const token = await LocalStorage.apiToken.get();
    if (!token) {
      return null;
    }
    const student = await this.Put({
      url: `student/${id}/update-password`,
      authorization: `Bearer ${token}`,
      body: data,
    });
    return student;
  }
}
