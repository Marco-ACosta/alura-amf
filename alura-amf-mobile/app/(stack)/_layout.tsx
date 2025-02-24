import { Stack } from "expo-router"

const StackScreensStyle = {
    /** Cor do header */
    headerStyle: { backgroundColor: "darkblue" },
    /** Cor do título do header */
    headerTintColor: "white",
}

export default function RootLayout() {
    return (
        <Stack
            initialRouteName='(tabs)'
            screenOptions={ StackScreensStyle }
        >
            <Stack.Screen name='(tabs)' options={{ title: "Tabs", headerShown: false }} />
            <Stack.Screen name='post' options={{ title: "Post" }} />
        </Stack>
    )
}