import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { Screen } from "../components/base/Screen";
import { StackNavigationParams, TabNavigationParams } from "../../App";
import { StackNavigationProp } from "@react-navigation/stack";
import { Alert, StyleSheet, Text, TextInput } from "react-native";
import Auth from "../components/base/Auth";
import React from "react";
import { UserContextProvider } from "../contexts/UserContext";
import CustomButton from "../components/CustomButton";

type ProfileStackUseNavigationProps = StackNavigationProp<
  StackNavigationParams,
  "Tabs"
>;
type ProfileStackUseRouteProps = RouteProp<StackNavigationParams, "Tabs">;

type ProfileTabUseNavigationProps = BottomTabNavigationProp<
  TabNavigationParams,
  "Home"
>;
type ProfileTabUseRouteProps = RouteProp<TabNavigationParams, "Home">;

export const EditProfile: React.FC<{}> = ({}) => {
  const tabNavigation = useNavigation<ProfileTabUseNavigationProps>();
  const { user, updateUser } = UserContextProvider();
  const [name, setName] = React.useState<string>(user.profile.name);
  const [lastName, setLastName] = React.useState<string>(user.profile.lastName);
  const [phone, setPhone] = React.useState<string>(user.profile.phone);
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
        <Text style={styles.title}>Editar Perfil</Text>
        <Text style={styles.info}>Nome:</Text>
        <TextInput
          style={styles.info}
          placeholder="Nome"
          value={name}
          onChangeText={setName}
        />

        <Text> Sobrenome: </Text>
        <TextInput
          style={styles.info}
          placeholder="Sobrenome"
          value={lastName}
          onChangeText={setLastName}
        />

        <Text> Telefone </Text>
        <TextInput
          style={styles.info}
          placeholder="Telefone"
          value={phone}
          onChangeText={setPhone}
        />

        <CustomButton title="Salvar" onPress={() => handleSave()} />
      </Screen>
    </Auth>
  );
};

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
    maxHeight: 50,
  },
});
