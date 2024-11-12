
export type loginBody = {
    email: string
    password: string
}

export type loginResponse = {
    data: {
        type: string,
        token: string,
        userId: string,
        abilities: string[]
        expiresAt: Date
    }
}