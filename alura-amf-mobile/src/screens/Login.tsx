import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { Screen } from "../components/base/Screen"
import { StackNavigationParams, TabNavigationParams } from "../../App"
import { StackNavigationProp } from "@react-navigation/stack"
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native"
import React from "react"
import CustomButton from "../components/CustomButton"
import { AuthContextProvider } from "../contexts/AuthContext"
type HomeStackUseNavigationProps = StackNavigationProp<StackNavigationParams, "Tabs">
type HomeStackUseRouteProps = RouteProp<StackNavigationParams, "Tabs">



/** Tela home */
export const Login: React.FC<{}> = ({ }) => {
    const { signIn } = AuthContextProvider()
    const stackNavigation = useNavigation<HomeStackUseNavigationProps>()
    const stackRoute = useRoute<HomeStackUseRouteProps>()
    const [email, setEmail] = React.useState<string>("")
    const [password, setPassword] = React.useState<string>("")

    async function handleLogin() {
        if (email && password) {
          const response = await signIn({ email, password })
          if (response.Success) {
            stackNavigation.navigate("Tabs")
          } else {
            Alert.alert("Erro", response.ErrorMessage);
          }
        } else {
          Alert.alert("Erro", "Preencha todos os campos");
        }
      }


    return (
        <Screen>
            <Text style={styles.title}>Studio</Text>
                <Text style={styles.underTitle}>Bem vindo!</Text>
                <Text style={styles.underTitle}>Faça login para continuar</Text>
                <Text style={styles.labelInput}>Email</Text>
                <TextInput style={styles.input}
                    placeholder="Email"
                    autoCapitalize="none"
                    textContentType='emailAddress'
                    keyboardType="email-address"
                    onChange={(e) => setEmail(e.nativeEvent.text)}
                />
                <Text style={styles.labelInput}>Senha</Text>
                <TextInput style={styles.input}
                    placeholder="Senha"
                    autoCapitalize="none"
                    textContentType="password"
                    keyboardType="default"
                    onChange={(e) => setPassword(e.nativeEvent.text)}
                />
                <CustomButton title="Entrar" onPress={ handleLogin } btnBorder={{ radius: 10 , px: 0.5 }} btnTextColor="black" btnBackground="white"/>
        </Screen>
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
    underTitle: {
        flex: 1,
        textAlign: "center",
        width: "100%",
        fontSize: 15,
        fontWeight: "bold",
        maxHeight: 50
    },
    input: {
        width: "80%",
        flex: 1,
        maxHeight: 50,
        marginBottom: 10,
        borderWidth: 0.5,
        borderColor: "black",
        borderRadius: 10,
        paddingHorizontal: 10
    },
    labelInput: {
        width: "80%",
        flex: 1,
        maxHeight: 30,
        fontWeight: "bold",
    },
    button: {
        flex: 1,
    }
})