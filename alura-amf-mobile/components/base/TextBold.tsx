import { StyleProp, Text, TextStyle } from "react-native"

type TextBoldProps = {
    children: any
    style?: StyleProp<TextStyle>
}

export default function TextBold({ children, style }: TextBoldProps) {
    return <Text style={{ fontWeight: "bold", ...style as any }}>{ children }</Text>
}