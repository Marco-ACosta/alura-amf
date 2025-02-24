import { StyleSheet, View, FlatList } from "react-native";
import Auth from "../components/base/Auth";
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import { StackNavigationParams } from "../../App";
import { Screen } from "../components/base/Screen";
import { useCallback, useEffect, useState } from "react";
import { PlaylistsType } from "../types/playlistTypes";
import PlaylistService from "../services/api/PlaylistService";
import Loading from "../components/base/Loading";
import PlaylistCard from "../components/PlaylistCard";

export const AddContentToPlaylist: React.FC<{}> = () => {
  const { params } =
    useRoute<RouteProp<StackNavigationParams, "AddContentToPlaylist">>();
  const [playlists, setPlaylist] = useState<PlaylistsType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const GetPlaylists = useCallback(async () => {
    setLoading(true);
    const playlists = await PlaylistService.GetPlaylists();
    if (playlists?.Data) setPlaylist(playlists?.Data);
    setLoading(false);
  }, [setPlaylist]);
  useEffect(() => {
    GetPlaylists();
  }, [GetPlaylists]);

  useFocusEffect(
    useCallback(() => {
      GetPlaylists();
      return () => {};
    }, [GetPlaylists]),
  );

  if (loading) {
    return <Screen>{Loading()}</Screen>;
  }

  return (
    <Auth>
      <View style={styles.container}>
        {loading ? (
          <View>{Loading()}</View>
        ) : (
          <FlatList
            data={playlists}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <PlaylistCard
                playlist={item}
                refresh={GetPlaylists}
                hasButtons={false}
                contentId={params.id}
                addToPlaylist={true}
              />
            )}
          />
        )}
      </View>
    </Auth>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 100,
  },
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
});
