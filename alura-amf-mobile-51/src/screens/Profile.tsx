import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Screen } from "../components/base/Screen";
import { StackNavigationParams } from "../../App";
import { StackNavigationProp } from "@react-navigation/stack";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import Auth from "../components/base/Auth";
import React from "react";
import { UserContextProvider } from "../contexts/UserContext";
import { AuthContextProvider } from "../contexts/AuthContext";
import { LocalStorage } from "../utils/LocalStorage";
import { UserData } from "../types/userTypes";
import Loading from "../components/base/Loading";

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
        <View style={styles.content}>
          {userData ? (
            <>
              <Text style={styles.title}>
                {user.profile.name} {user.profile.lastName}
              </Text>
              <Text style={styles.info}>RA: {user?.academicRegister}</Text>
              <Text style={styles.info}>Email: {user?.email}</Text>
              <Text style={styles.info}>Telefone: {user?.profile.phone}</Text>
              <Text style={styles.info}>CPF {user?.cpf}</Text>

              <View style={styles.buttonContainer}>
                <View style={styles.buttonRow}>
                  <View style={styles.button}>
                    <Button
                      title="Editar"
                      onPress={() => stackNavigation.navigate("EditProfile")}
                    />
                  </View>
                  <View style={styles.button}>
                    <Button
                      title="Editar senha"
                      onPress={() => stackNavigation.navigate("EditPassword")}
                    />
                  </View>
                </View>
                <View style={styles.buttonRow}>
                  <View style={styles.button}>
                    <Button
                      title="Playlists"
                      onPress={() => stackNavigation.navigate("Playlists")}
                    />
                  </View>
                  <View style={styles.button}>
                    <Button title="Sair" onPress={() => handleLogOut()} />
                  </View>
                </View>
              </View>
            </>
          ) : (
            <Screen>{Loading()}</Screen>
          )}
        </View>
      </Screen>
    </Auth>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  info: {
    textAlign: "left",
    width: "100%",
    fontSize: 15,
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 50,
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    width: "48%",
    marginBottom: 10,
  },
});
