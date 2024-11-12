import { createContext, useContext, useState } from "react"
import StudentService from "../services/api/StudentService"
import { UserData, UserUpdateData, UserUpdatePasswordData } from "../types/userTypes"
import { LocalStorage } from "../utils/LocalStorage"

type UserContextProps = {
    children: JSX.Element | JSX.Element[]
}

type UserContext = {
    user: UserData
    setUser: React.Dispatch<React.SetStateAction<any>>
    getUser: (id: string) => Promise<any>
    updateUser: (data: UserUpdateData, id: string) => Promise<any>
    updatePassword: (data: UserUpdatePasswordData, id: string) => Promise<any>
}

const UserContext = createContext<UserContext | null>(null)

export default function UserContextComponent({ children }: UserContextProps) {
    const [ user, setUser ] = useState<any>(null)
    async function getUser(id: string) {
       const response = await StudentService.GetStudent(id)
       if (!response?.Success) {
           return null
       }
       setUser(response.Data)
       return response
    }

    async function updateUser(data: UserUpdateData, id: string) {
        const response = await StudentService.UpdateStudent(data, id)
        if (!response?.Success) {
            return null
        }
        return response
    }

    async function updatePassword(data: UserUpdatePasswordData, id: string) {
        const response = await StudentService.UpdatePassword(data, id)
        if (!response?.Success) {
            return null
        }
        await LocalStorage.logoff()
        return response
    }

    return (
        <UserContext.Provider value={{ user, setUser: () => {}, getUser, updateUser, updatePassword }}>
            {children}
        </UserContext.Provider>
    )
}


export function UserContextProvider() {
    const context = useContext(UserContext)
    if (!context) throw new Error("UserContext chamado fora do provider.")

    return context
}