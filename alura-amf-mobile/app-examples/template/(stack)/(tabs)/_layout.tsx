import { Tabs } from "expo-router"

export default function RootLayout() {
    return (
        <Tabs initialRouteName='index'>
            <Tabs.Screen name='index' options={{ headerShown: false, tabBarLabel: "Home" }} />
            <Tabs.Screen name='user' options={{ title: "Usuário", tabBarLabel: "Usuário" }} />
        </Tabs>
    )
}