import { AccessToken } from "@adonisjs/auth/access_tokens"
import { CreateUserProps, UpdateUserProps } from "../types/user.js"
import IBase from "./base/base.js"
import User from "#models/user"

export default interface IUserService extends IBase<User, CreateUserProps, UpdateUserProps> {
    /**
     * Login do usuário
     * @returns {Promise<AccessToken>} Token de acesso completo
    */
    Login(email: string, password: string): Promise<AccessToken>
}