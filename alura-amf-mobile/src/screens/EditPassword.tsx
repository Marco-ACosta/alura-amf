import { Screen } from "../components/base/Screen"
import Auth from "../components/base/Auth"
import { Alert, StyleSheet, Text, TextInput } from "react-native"
import { useState } from "react"
import { UserContextProvider } from "../contexts/UserContext"
import { TabNavigationParams } from "../../App"
import { RouteProp, useNavigation } from "@react-navigation/native"
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs"
import CustomButton from "../components/CustomButton"

type ProfileTabUseNavigationProps = BottomTabNavigationProp<TabNavigationParams, "Home">

export const EditPassword: React.FC<{}> = ({ }) => {
    const tabNavigation = useNavigation<ProfileTabUseNavigationProps>()

    const [newPassword, setNewPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")
    const [currentPassword, setCurrentPassword] = useState<string>("")

    const { user, updatePassword } = UserContextProvider()

    const handleSave = async () => {
        if (newPassword && currentPassword) {
            const data = {
                newPassword: newPassword,
                newPassword_confirmation: newPassword,
                oldPassword: currentPassword
            }
            const response = await updatePassword(data, user.id)
            if (!response?.Success) {
                Alert.alert("Erro", response.ErrorMessage);
            }
            tabNavigation.navigate("Home")
            return
        }
    }
    return (
        <Auth>
            <Screen>
                <Text style={styles.info}>Senha Atual:</Text>
                <TextInput style={styles.info} placeholder="Senha Atual" onChangeText={setCurrentPassword} value={currentPassword}/>


                <Text style={styles.info}>Nova Senha:</Text>
                <TextInput style={styles.info} placeholder="Nova Senha" onChangeText={setNewPassword} value={newPassword}/>

                <Text style={styles.info}>Confirmar Nova Senha:</Text>
                <TextInput style={styles.info} placeholder="Confirmar Nova Senha" onChangeText={setConfirmPassword} value={confirmPassword}/>

                <CustomButton title="Salvar" onPress={handleSave} />
            </Screen>
        </Auth>
    )
}

const styles = StyleSheet.create({
    title: {
        flex: 1,
        width: "100%",
        maxHeight: "5%",
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold",
    },
    info: {
        flex: 1,
        textAlign: "center",
        width: "100%",
        fontSize: 15,
        maxHeight: 50
    }
})