import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs"
import { RouteProp, useFocusEffect, useNavigation, useRoute } from "@react-navigation/native"
import { Screen } from "../components/base/Screen"
import { StackNavigationParams, TabNavigationParams } from "../../App"
import { StackNavigationProp } from "@react-navigation/stack"
import { StyleSheet, Text } from "react-native"
import React, { useCallback, useEffect } from "react"
import Auth from "../components/base/Auth"
import { LocalStorage } from "../utils/LocalStorage"
import { UserContextProvider } from "../contexts/UserContext"

type HomeStackUseNavigationProps = StackNavigationProp<StackNavigationParams, "Tabs">
type HomeStackUseRouteProps = RouteProp<StackNavigationParams, "Tabs">

type HomeTabUseNavigationProps = BottomTabNavigationProp<TabNavigationParams, "Home">
type HomeTabUseRouteProps = RouteProp<TabNavigationParams, "Home">

/** Tela home */
export const Home: React.FC<{}> = ({ }) => {
    const stackNavigation = useNavigation<HomeStackUseNavigationProps>()
    const tabNavigation = useNavigation<HomeTabUseNavigationProps>()
    const stackRoute = useRoute<HomeStackUseRouteProps>()
    const tabRoute = useRoute<HomeTabUseRouteProps>()
    const { getUser, setUser, user } = UserContextProvider()
    
    const mangeStudent = async () => {
        const id = await LocalStorage.userId.get()
        if (!id) {
            stackNavigation.navigate("Login")
            return
        } else {
            const response = await getUser(id)
            if (!response) {
                stackNavigation.navigate("Login")
                return
            }
            setUser(response.Data)
            return
        }
    }

    useEffect(() => {
        mangeStudent()
    },  [])

    useFocusEffect(
        useCallback(() => {
            mangeStudent();
        }, [])
      );

    return (
        <Auth>
            <Screen>
                <Text>Project Template Mobile</Text>
                <Text>HOME</Text>
            </Screen>
        </Auth>
    )
}

const styles = StyleSheet.create({
})
