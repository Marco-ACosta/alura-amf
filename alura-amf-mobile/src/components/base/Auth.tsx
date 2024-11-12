import { ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { StackNavigationParams } from "../../../App"
import { AuthContextProvider } from "../../contexts/AuthContext"
import { StackNavigationProp } from "@react-navigation/stack"
import { useEffect } from "react"
import { LocalStorage } from "../../utils/LocalStorage"

type AuthProps = {
    children: JSX.Element | JSX.Element[]
}
type LoginStackUseNavigationProps = StackNavigationProp<ParamListBase, string, undefined>

/**
 * Componente responsável pelo controle de rotas autenticadas  
 * Oferece redirecionamento ou outras tratativas quando usuário não autenticado  
 * Necessita englobar o componente necessitado de autenticação
 * */
export default function Auth({ children }: AuthProps) {
    const stackNavigation = useNavigation<LoginStackUseNavigationProps>()
    const { isLogged, setIsLogged } = AuthContextProvider()
    useEffect(() => {
        const manageAuth = async () => {
            if(isLogged) {
                stackNavigation.navigate('Tabs') 
            }
            const token = await LocalStorage.apiToken.get()
            if (!token) {
                stackNavigation.navigate("Login")
            }
            setIsLogged(true)
            stackNavigation.navigate("Tabs")
        }
        manageAuth()
    })
    return children
}