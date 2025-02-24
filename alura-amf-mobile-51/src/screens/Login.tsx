import { useNavigation } from "@react-navigation/native";
import { Screen } from "../components/base/Screen";
import { StackNavigationParams } from "../../App";
import { StackNavigationProp } from "@react-navigation/stack";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import CustomButton from "../components/CustomButton";
import { AuthContextProvider } from "../contexts/AuthContext";

type HomeStackUseNavigationProps = StackNavigationProp<
  StackNavigationParams,
  "Tabs"
>;

/** Tela home */
export const Login: React.FC<{}> = () => {
  const { signIn } = AuthContextProvider();
  const stackNavigation = useNavigation<HomeStackUseNavigationProps>();
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  async function handleLogin() {
    if (email && password) {
      const response = await signIn({ email, password });
      if (response.Success) {
        stackNavigation.navigate("Tabs");
      } else {
        Alert.alert("Erro", response.ErrorMessage);
      }
    } else {
      Alert.alert("Erro", "Preencha todos os campos");
    }
  }

  return (
    <Screen>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Studio</Text>
        <Text style={styles.underTitle}>Bem vindo!</Text>
        <Text style={styles.underTitle}>Faça login para continuar</Text>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.labelInput}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          textContentType="emailAddress"
          keyboardType="email-address"
          onChange={(e) => setEmail(e.nativeEvent.text)}
        />
        <Text style={styles.labelInput}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Senha"
          autoCapitalize="none"
          textContentType="password"
          keyboardType="default"
          onChange={(e) => setPassword(e.nativeEvent.text)}
        />
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Entrar"
          onPress={handleLogin}
          btnBorder={{ radius: 10, px: 0.5 }}
          btnTextColor="black"
          btnBackground="white"
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  underTitle: {
    textAlign: "center",
    width: "100%",
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
    width: "100%", // Make input occupy maximum width
  },
  labelInput: {
    fontWeight: "bold",
    marginBottom: 5,
    alignSelf: "flex-start",
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  inputContainer: {
    width: "90%", // Occupy maximum width
    alignItems: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    alignItems: "center",
  },
});
