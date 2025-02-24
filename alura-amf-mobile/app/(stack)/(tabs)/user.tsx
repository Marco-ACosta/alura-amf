import { Screen } from "@/components/base/Screen"
import AuthRoute from "@/components/auth/Auth"
import Box from "@/components/base/Box"
import TextBold from "@/components/base/TextBold"

export default function UserScreen() {
    return (
        <AuthRoute>
            <Screen>
                <Box.Column>
                    <TextBold>TELA DO USUÁRIO</TextBold>
                </Box.Column>
            </Screen>
        </AuthRoute>
    )
}