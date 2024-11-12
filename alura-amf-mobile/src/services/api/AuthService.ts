import { loginBody, loginResponse } from "../../types/authTypes"
import { LocalStorage } from "../../utils/LocalStorage"
import Endpoints from "./base/Endpoints"

export default class AuthService extends Endpoints {
    static async Login(body: loginBody) {
        const response = await this.Post<loginResponse>({
            url: "student/login",
            body: body
        })
        return response
    }

    static async LogOut() {
        const token = await LocalStorage.apiToken.get()
        if (!token) {
            return null
        }
        const student = await this.Delete({ url: `student/logout`, authorization: `Bearer ${token}` })
        return student
    }
}