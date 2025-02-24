import { useNavigation } from "@react-navigation/native";
import { Screen } from "../components/base/Screen";
import { StackNavigationParams } from "../../App";
import { StackNavigationProp } from "@react-navigation/stack";
import { StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect } from "react";
import Auth from "../components/base/Auth";
import { LocalStorage } from "../utils/LocalStorage";
import { UserContextProvider } from "../contexts/UserContext";

type HomeStackUseNavigationProps = StackNavigationProp<
  StackNavigationParams,
  "Tabs"
>;

/** Tela home */
export const Home: React.FC<{}> = () => {
  const stackNavigation = useNavigation<HomeStackUseNavigationProps>();
  const { getUser, setUser } = UserContextProvider();

  const mangeStudent = useCallback(async () => {
    const id = await LocalStorage.userId.get();
    if (!id) {
      await LocalStorage.logoff();
      stackNavigation.navigate("Login");
      return;
    } else {
      const response = await getUser(id);
      if (!response) {
        await LocalStorage.logoff();
        stackNavigation.navigate("Login");
        return;
      }
      setUser(response.Data);
      return;
    }
  }, [stackNavigation, getUser, setUser]);

  useEffect(() => {
    mangeStudent();
  }, [mangeStudent]);

  return (
    <Auth>
      <Screen>
        <View style={styles.content}>
          <Text style={styles.title}>Project Template Mobile</Text>
          <Text style={styles.info}></Text>
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
    textAlign: "center",
    width: "100%",
    fontSize: 15,
    marginBottom: 10,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
});
