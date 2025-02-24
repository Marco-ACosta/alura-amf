import { AuthContextProvider } from "../../contexts/AuthContext"
import { useFocusEffect } from "@react-navigation/native"
import { Redirect, router } from "expo-router"

type AuthProps = {
    children: JSX.Element | JSX.Element[]
}

export default function AuthRoute({ children }: AuthProps) {
    const { isLogged } = AuthContextProvider()

    // useFocusEffect(() => {
    //     if (!isLogged) {
    //         router.navigate("/")
    //     }
    // })

    if (!isLogged)
        return <Redirect href={"/"} />

    return children
}