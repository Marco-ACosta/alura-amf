import { DateFormatter } from "../../utils/DateFormatter"
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker"
import { StyleProp, Text, TextStyle, StyleSheet } from "react-native"
import Box from "../base/Box"
import IconIonicons from "react-native-vector-icons/Ionicons"

type TimePickerShowProps = {
    time: Date
    onChange: (e : Date) => void
    textStyle?: StyleProp<TextStyle>
    iconSize?: number
    iconColor?: string
}

export default function TimePickerShow({ time, onChange, textStyle, iconSize = 20, iconColor = "black" }: TimePickerShowProps) {
    const openTimePicker = () => {
        DateTimePickerAndroid.open({
            value: time,
            onChange: (event, date) => {
                if (event.type === "set") {
                    if (date) {
                        if (date.getTime() === time.getTime()) return
                        onChange(DateFormatter.fixUTC(date.getTime()))
                    }
                }
            },
            mode: "time",
            is24Hour: true,
            timeZoneName: "America/Sao_Paulo",
        })
    }

    return (
        <Box.Row style={ styles.container }>
            <Text
                style={ textStyle }
                onPress={ () => openTimePicker() }
            >
                { DateFormatter.removeDate(time.toISOString()) }
            </Text>
            <IconIonicons
                name="time-outline"
                size={ iconSize }
                color={ iconColor }
                onPress={ () => openTimePicker() }
            />
        </Box.Row>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        gap: 5,
    },
})