import { Screen } from "@/components/base/Screen"
import { useLocalSearchParams } from "expo-router"
import AuthRoute from "@/components/auth/Auth"
import Box from "@/components/base/Box"
import TextBold from "@/components/base/TextBold"

export default function PostScreen() {
    const { id } = useLocalSearchParams<{ id: string }>()

    return (
        <AuthRoute>
            <Screen>
                <Box.Column>
                    <TextBold>TELA DO POST</TextBold>
                    <TextBold>POST { id }</TextBold>
                </Box.Column>
            </Screen>
        </AuthRoute>
    )
}