import { Stack } from "expo-router"

export default function RootLayout() {
    return (
        <Stack initialRouteName='(tabs)'>
            <Stack.Screen name='(tabs)' options={{ title: "Tabs", headerShown: false }} />
            <Stack.Screen name='details' options={{ title: "Detalhes" }} />
        </Stack>
    )
}