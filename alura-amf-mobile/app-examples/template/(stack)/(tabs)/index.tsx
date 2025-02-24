import { Link } from "expo-router"
import { Text, View } from "react-native"

export default function Index() {
    return (
        <View style={{ gap: 15 }}>
            <Text>TELA HOME</Text>
            <Link href="/details">details</Link>
        </View>
    )
}