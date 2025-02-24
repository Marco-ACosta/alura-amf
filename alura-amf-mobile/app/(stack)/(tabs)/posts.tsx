import { Link } from "expo-router"
import { Screen } from "@/components/base/Screen"
import AuthRoute from "@/components/auth/Auth"
import Box from "@/components/base/Box"
import TextBold from "@/components/base/TextBold"

export default function PostsScreen() {
    return (
        <AuthRoute>
            <Screen>
                <Box.Column>
                    <TextBold>TELA DE POSTS</TextBold>
                    <Link href={{ pathname: "/post", params: { id: "1" }}}>Post 01</Link>
                    <Link href={{ pathname: "/post", params: { id: "2" }}}>Post 02</Link>
                    <Link href={{ pathname: "/post", params: { id: "3" }}}>Post 03</Link>
                </Box.Column>
            </Screen>
        </AuthRoute>
    )
}