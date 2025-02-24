import { View, Text, TextInput, StyleSheet, Button } from "react-native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { Screen } from "../components/base/Screen";
import { TabNavigationParams } from "../../App";
import { Alert } from "react-native";
import Auth from "../components/base/Auth";
import React, { useState } from "react";
import { UserContextProvider } from "../contexts/UserContext";
type ProfileTabUseNavigationProps = BottomTabNavigationProp<
  TabNavigationParams,
  "Home"
>;

export const EditProfile: React.FC<{}> = () => {
  const tabNavigation = useNavigation<ProfileTabUseNavigationProps>();
  const { user, updateUser } = UserContextProvider();
  const [name, setName] = useState<string>(user.profile.name);
  const [lastName, setLastName] = useState<string>(user.profile.lastName);
  const [phone, setPhone] = useState<string>(user.profile.phone);
  const handleSave = async () => {
    if (name && lastName && phone) {
      const data = {
        name: name,
        lastName: lastName,
        phone: phone,
        email: user.email,
        cpf: user.cpf,
        academicRegister: user.academicRegister,
      };
      const response = await updateUser(data, user.id);
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
        <View style={styles.container}>
          <Text style={styles.title}>Editar Perfil</Text>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Jo o"
            value={name}
            onChangeText={setName}
          />
          <Text style={styles.label}>Sobrenome</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: da Silva"
            value={lastName}
            onChangeText={setLastName}
          />
          <Text style={styles.label}>Telefone</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: (11) 98888-8888"
            value={phone}
            onChangeText={setPhone}
          />
          <Button title="Salvar" onPress={() => handleSave()} />
        </View>
      </Screen>
    </Auth>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 100,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
  },
});
