import { Text, StyleSheet } from "react-native";
import Auth from "../components/base/Auth";
import { Screen } from "../components/base/Screen";

export const Playlists: React.FC<{}> = () => {
  return (
    <Auth>
      <Screen>
        <Text style={styles.title}>Playlists</Text>
      </Screen>
    </Auth>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    width: "100%",
    alignItems: "center",
  },
  title: {
    marginTop: 100,
    fontSize: 20,
    fontWeight: "bold",
  },
});
