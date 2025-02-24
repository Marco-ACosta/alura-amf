import { Text, StyleSheet } from "react-native"
import { useState } from "react"
import Box from "../base/Box"
import CustomButton from "../customs/CustomButton"
import CustomModal from "../customs/CustomModal"

type FutureDevelopmentButtonProps = {
    btnTitle: string
}

export default function FutureDevelopmentButton({ btnTitle }: FutureDevelopmentButtonProps) {
    const [ open, setOpen ] = useState<boolean>(false)

    return <>
            <CustomModal
                visible={ open }
                setVisible={ setOpen }
                blurBackground
            >
                <Box.Center style={ styles.container }>
                    <Text style={ styles.text }>Essa funcionalidade não está pronta para uso ainda, aguarde em novas atualizações do aplicativo!</Text>
                </Box.Center>
            </CustomModal>
            <CustomButton
                title={ btnTitle }
                onPress={ () => setOpen(true) }
            />
    </>
}

const styles = StyleSheet.create({
    container: {
        width: "80%",
        padding: 15,
        backgroundColor: "darkblue",
        borderRadius: 30,
    },
    text: {
        color: "white",
        textAlign: "center",
        fontSize: 18,
    },
})