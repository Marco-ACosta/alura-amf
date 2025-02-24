import { Link } from "expo-router"
import { Text, View } from "react-native"

export default function Index() {
    return (
        <View style={{ gap: 15 }}>
            <Text>TELA DE CRÉDITOS</Text>
            <Link href="..">home</Link>
            <Link href={ "/" as any }>home</Link>
        </View>
    )
}