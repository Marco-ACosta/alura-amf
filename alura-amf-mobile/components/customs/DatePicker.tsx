import { DateTimePickerAndroid } from "@react-native-community/datetimepicker"
import CustomButton, { CustomButtonProps } from "./CustomButton"
import React from "react"

type DatePickerProps = {
    onChange: (e: Date) => void
    date: Date
    buttonProps?: CustomButtonProps
}

export default function DatePicker({ onChange, date, buttonProps }: DatePickerProps) {
    const openDatePicker = () => {
        DateTimePickerAndroid.open({
            value: date,
            onChange: (event, newDate) => {
                if (event.type === "set") {
                    if (newDate) {
                        if (newDate.getTime() === date.getTime()) return
                        onChange(newDate)
                    }
                }
            },
            mode: "date",
        })
    }

    return <CustomButton title="Selecionar Data" { ...buttonProps } onPress={ () => openDatePicker() } />
}