import { Screen } from "../components/base/Screen";
import Auth from "../components/base/Auth";
import { Alert, Button, StyleSheet, Text, TextInput } from "react-native";
import { useState } from "react";
import { UserContextProvider } from "../contexts/UserContext";
import { TabNavigationParams } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

type ProfileTabUseNavigationProps = BottomTabNavigationProp<
  TabNavigationParams,
  "Home"
>;

export const EditPassword: React.FC<{}> = () => {
  const tabNavigation = useNavigation<ProfileTabUseNavigationProps>();

  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [currentPassword, setCurrentPassword] = useState<string>("");

  const { user, updatePassword } = UserContextProvider();

  const handleSave = async () => {
    if (newPassword && currentPassword) {
      const data = {
        newPassword: newPassword,
        newPassword_confirmation: newPassword,
        oldPassword: currentPassword,
      };
      const response = await updatePassword(data, user.id);
      if (!response?.Success) {
        Alert.alert("Erro", response.ErrorMessage);
      }
      tabNavigation.navigate("Home");
      return;
    }
  };
  return (
    <Auth>
      <Screen>
        <Text style={styles.title}>Editar Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Senha Atual"
          onChangeText={setCurrentPassword}
          value={currentPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Nova Senha"
          onChangeText={setNewPassword}
          value={newPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirmar Nova Senha"
          onChangeText={setConfirmPassword}
          value={confirmPassword}
        />

        <Button title="Salvar" onPress={handleSave} />
      </Screen>
    </Auth>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
  },
});
