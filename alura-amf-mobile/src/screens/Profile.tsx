import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Screen } from "../components/base/Screen";
import { StackNavigationParams } from "../../App";
import { StackNavigationProp } from "@react-navigation/stack";
import { Alert, StyleSheet, Text } from "react-native";
import Auth from "../components/base/Auth";
import React from "react";
import { UserContextProvider } from "../contexts/UserContext";
import { AuthContextProvider } from "../contexts/AuthContext";
import CustomButton from "../components/CustomButton";
import { LocalStorage } from "../utils/LocalStorage";
import { UserData } from "../types/userTypes";

type ProfileStackUseNavigationProps = StackNavigationProp<
  StackNavigationParams,
  "Tabs"
>;

/**
 * Tela do perfil
 * É autenticado
 * */
export const Profile: React.FC<{}> = () => {
  const stackNavigation = useNavigation<ProfileStackUseNavigationProps>();
  const { getUser, user, setUser } = UserContextProvider();
  const { logOut } = AuthContextProvider();
  const [userData, setUserData] = useState<UserData | null>(null);

  const mangeStudent = useCallback(async () => {
    const id = await LocalStorage.userId.get();
    if (!id) {
      await LocalStorage.logoff();
      stackNavigation.navigate("Login");
      return;
    } else {
      const response = await getUser(id);

      if (response.error) {
        await LocalStorage.logoff();
        stackNavigation.navigate("Login");
        return;
      }

      setUserData(response.Data);
      return;
    }
  }, [stackNavigation, getUser]);

  const isMounted = useRef(true);

  useEffect(() => {
    if (isMounted.current) {
      mangeStudent();
      setUser(userData);
    }

    return () => {
      isMounted.current = false;
    };
  }, [mangeStudent, setUser, userData]);

  const handleLogOut = async () => {
    const response = await logOut();
    if (response.Success) {
      stackNavigation.navigate("Login");
    } else {
      Alert.alert("Erro", response.ErrorMessage);
    }
    return;
  };

  return (
    <Auth>
      <Screen>
        {userData ? (
          <>
            <Text style={styles.title}>
              {user.profile.name} {user.profile.lastName}
            </Text>
            <Text style={styles.info}>RA: {user?.academicRegister}</Text>
            <Text style={styles.info}>Email: {user?.email}</Text>
            <Text style={styles.info}>Telefone: {user?.profile.phone}</Text>
            <Text style={styles.info}>CPF {user?.cpf}</Text>
          </>
        ) : (
          <Text>Carregando...</Text>
        )}

        <CustomButton
          title="Editar"
          onPress={() => stackNavigation.navigate("EditProfile")}
        />

        <CustomButton
          title="Editar senha"
          onPress={() => stackNavigation.navigate("EditPassword")}
        />

        <CustomButton
          title="Playlists"
          onPress={() => stackNavigation.navigate("Playlists")}
        />

        <CustomButton title="Sair" onPress={() => handleLogOut()} />
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
