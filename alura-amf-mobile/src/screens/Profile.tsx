import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { Screen } from "../components/base/Screen"
import { StackNavigationParams, TabNavigationParams } from "../../App"
import { StackNavigationProp } from "@react-navigation/stack"
import { Alert, StyleSheet, Text } from "react-native"
import Auth from "../components/base/Auth"
import React from "react"
import { UserContextProvider } from "../contexts/UserContext"
import { AuthContextProvider } from "../contexts/AuthContext"
import CustomButton from "../components/CustomButton"

type ProfileStackUseNavigationProps = StackNavigationProp<StackNavigationParams, "Tabs">
type ProfileStackUseRouteProps = RouteProp<StackNavigationParams, "Tabs">

type ProfileTabUseNavigationProps = BottomTabNavigationProp<TabNavigationParams, "Home">
type ProfileTabUseRouteProps = RouteProp<TabNavigationParams, "Home">

/**
 * Tela do Profileistrador  
 * É autenticado
 * */
export const Profile: React.FC<{}> = ({ }) => {
    const stackNavigation = useNavigation<ProfileStackUseNavigationProps>()
    const tabNavigation = useNavigation<ProfileTabUseNavigationProps>()
    const stackRoute = useRoute<ProfileStackUseRouteProps>()
    const tabRoute = useRoute<ProfileTabUseRouteProps>()
    const { user } = UserContextProvider()
    const { logOut } = AuthContextProvider()

    const handleLogOut = async () => {
        const response = await logOut()
        if (response.Success) {
            stackNavigation.navigate("Login")
        } else {
            Alert.alert("Erro", response.ErrorMessage);
        }
        return
    }

    return (
        <Auth>
            <Screen>
                <Text style={styles.title}>{ user.profile.name } { user.profile.lastName }</Text>
                <Text style={styles.info}>RA: { user?.academicRegister }</Text>
                <Text style={styles.info}>Email: { user?.email }</Text>
                <Text style={styles.info}>Telefone: { user?.profile.phone }</Text>
                <Text style={styles.info}>CPF { user?.cpf }</Text>

                <CustomButton title="Editar" onPress={() => stackNavigation.navigate("EditProfile")} />
                <CustomButton title="Editar senha" onPress={() => stackNavigation.navigate("EditPassword")} />
                <CustomButton title="Sair" onPress={() => handleLogOut() } />
            </Screen>
        </Auth>
    )
}

const styles = StyleSheet.create({
    title: {
        flex: 1,
        width: "100%",
        maxHeight: "5%",
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold",
    },
    info: {
        flex: 1,
        textAlign: "center",
        width: "100%",
        fontSize: 15,
        maxHeight: 50
    }
})