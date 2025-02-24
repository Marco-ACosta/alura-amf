import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import { Text, StyleSheet, FlatList, View } from "react-native";
import Auth from "../components/base/Auth";
import { StackNavigationParams } from "../../App";
import { useCallback, useEffect, useState } from "react";
import PlaylistService from "../services/api/PlaylistService";
import { PlaylistDetailsType } from "../types/playlistTypes";
import ContentCard from "../components/ContentCard";

const PlaylistDetails: React.FC<{}> = () => {
  const { params } =
    useRoute<RouteProp<StackNavigationParams, "ContentDetails">>();
  const id = params.id;
  const [playlist, setPlaylist] = useState<PlaylistDetailsType | null>(null);

  const getPlaylist = useCallback(async () => {
    const response = await PlaylistService.GetPlaylist(id);
    if (!response) {
      return;
    }
    setPlaylist(response.Data);
  }, [id]);

  useEffect(() => {
    getPlaylist();
  }, [getPlaylist]);

  useFocusEffect(
    useCallback(() => {
      getPlaylist();
      return () => {};
    }, [getPlaylist]),
  );

  return (
    <Auth>
      <View style={styles.container}>
        {playlist && (
          <View style={styles.content}>
            <Text style={styles.title}>{playlist.name}</Text>
            <View style={styles.infoContainer}>
              <Text>{playlist.isPublic ? "Publica" : "Privada"}</Text>
              <Text>
                Conteúdo{Number(playlist.contentCount) > 1 ? "s" : ""}:
                {playlist.contentCount}
              </Text>
            </View>
            <View style={styles.descriptionContainer}>
              <Text>Descrição:</Text>
              <Text>{playlist.description}</Text>
            </View>
            <Text style={styles.title}>Conteúdos:</Text>
            <FlatList
              data={playlist.contents}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <ContentCard
                  content={item}
                  isInPlaylist={true}
                  playlistId={id}
                  studentId={playlist.studentsId}
                />
              )}
              contentContainerStyle={styles.flatListContainer}
            />
          </View>
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
    alignItems: "center", // Centralize o card
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  flatListContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  infoContainer: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  descriptionContainer: {
    width: "100%",
    marginVertical: 10,
    textAlign: "justify",
  },
});

export default PlaylistDetails;
