export type UserInput = {
    fullName : string
    email : string
    password : string
}

export type UserOutput = {
    id : number
} & UserInput

export type CreateUserProps = { } & UserInput

export type UpdateUserProps = { } & CreateUserProps & UserOutput