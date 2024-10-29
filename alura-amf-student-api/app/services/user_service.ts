import { AccessToken } from "@adonisjs/auth/access_tokens"
import { CreateUserProps, UpdateUserProps } from "../types/user.js"
import { Pagination } from "../types/pagination.js"
import CustomException from "#exceptions/custom_exception"
import db from "@adonisjs/lucid/services/db"
import IUserService from "../interfaces/user.js"
import User from "#models/user"

export default class UserService implements IUserService {
    async Create(createProps: CreateUserProps, validate = true): Promise<User> {
        return await db.transaction(async (trx) => {
            if (validate) await this.Validate(createProps)
            return await User.create(createProps, { client: trx })
        })
    }

    async Update(updateProps: UpdateUserProps, validate = true): Promise<User> {
        const user = await this.Get(updateProps.id)
        if (!user) throw new CustomException(404, "Usuário não encontrado.")

        return await db.transaction(async (trx) => {
            if (validate) await this.Validate(updateProps)
            return await User.updateOrCreate({ id: updateProps.id }, updateProps, { client: trx })
        })
    }

    async Validate(_: CreateUserProps): Promise<void> { }

    async Get(id: number): Promise<User | null> {
        return await User.find(id)
    }

    async Delete(id: number): Promise<void> {
        const user = await this.Get(id)
        if (!user) throw new CustomException(404, "Usuário não encontrado.")
        await user.delete()
    }

    async List({
        page,
        limit,
        orderBy,
        orderByDirection
    }: Pagination) {
        return await User.query()
            .orderBy(orderBy, orderByDirection)
            .paginate(page, limit)
    }

    async Login(email: string, password: string) : Promise<AccessToken> {
        const user = await User.verifyCredentials(email, password)
        const token = await User.accessTokens.create(user, ["*"], { expiresIn: "1h" })
        return token
    }
}