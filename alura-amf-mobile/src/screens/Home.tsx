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
      stackNavigation.navigate("Login");
      return;
    } else {
      const response = await getUser(id);
      if (!response) {
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
        <View style={styles.container}>
          <Text>Project Template Mobile</Text>
          <Text>HOME</Text>
        </View>
      </Screen>
    </Auth>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
});
