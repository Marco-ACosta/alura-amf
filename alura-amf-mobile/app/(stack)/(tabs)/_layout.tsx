import { Tabs } from "expo-router"
import IconAntDesign from "react-native-vector-icons/AntDesign"
import IconFontAwesome6 from "react-native-vector-icons/FontAwesome6"
import IconIonicons from "react-native-vector-icons/Ionicons"

const TabScreensStyle = {
    /** Cor de fundo da tab ativa */
    tabBarActiveBackgroundColor: "",
    /** Cor de fundo das tabs inativas */
    tabBarInactiveBackgroundColor: "",
    /** Cor de título do header da tab atual */
    headerTintColor: "white",
    /** Cor de fundo do header da tab atual */
    headerStyle: {
        backgroundColor: "darkblue"
    },
    /** Cor de fundo do footer */
    tabBarStyle: {
        backgroundColor: "darkblue",
    },
}

export default function RootLayout() {
    return (
        <Tabs
            initialRouteName='index'
            screenOptions={ TabScreensStyle }
        >
            <Tabs.Screen
                name='user'
                options={{
                    headerShown: false,
                    tabBarLabel: "Usuário",
                    tabBarIcon: ({ color, size }) => (<IconAntDesign name="user" color={ color } size={ size } />),
                }}
            />
            <Tabs.Screen
                name='index'
                options={{
                    headerShown: false,
                    tabBarLabel: "Home",
                    tabBarIcon: ({ color, size }) => (<IconIonicons name="home-outline" color={ color } size={ size } />),
                }}
            />
            <Tabs.Screen
                name='posts'
                options={{
                    headerShown: false,
                    tabBarLabel: "Posts",
                    tabBarIcon: ({ color, size }) => (<IconFontAwesome6 name="newspaper" color={ color } size={ size } />),
                }}
            />
        </Tabs>
    )
}