import { DateFormatter } from "@/utils/DateFormatter"
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker"
import CustomButton, { CustomButtonProps } from "./CustomButton"
import React from "react"

type TimePickerProps = {
    onChange: (e: Date) => void
    time: Date
    buttonProps?: CustomButtonProps
}

export default function TimePicker({ onChange, time, buttonProps }: TimePickerProps) {
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
        })
    }

    return <CustomButton title="Selecionar Hora" { ...buttonProps } onPress={ () => openTimePicker() } />
}