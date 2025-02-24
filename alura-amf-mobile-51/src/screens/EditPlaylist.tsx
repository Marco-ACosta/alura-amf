import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { Text, StyleSheet, View, TextInput, Switch } from "react-native";
import Auth from "../components/base/Auth";
import { StackNavigationParams } from "../../App";
import { useCallback, useEffect, useState } from "react";
import PlaylistService from "../services/api/PlaylistService";
import { PlaylistDetailsType } from "../types/playlistTypes";
import ContentCard from "../components/ContentCard";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import CustomButton from "../components/CustomButton";
import { StackNavigationProp } from "@react-navigation/stack";
type EditPlaylistStackUseNavigationProps = StackNavigationProp<
  StackNavigationParams,
  "EditPlaylist"
>;

const EditPlaylist: React.FC<{}> = () => {
  const stackNavigation = useNavigation<EditPlaylistStackUseNavigationProps>();
  const { params } =
    useRoute<RouteProp<StackNavigationParams, "ContentDetails">>();
  const id = params.id;
  const [playlist, setPlaylist] = useState<PlaylistDetailsType | null>(null);
  const [name, setName] = useState<string>(playlist?.name ?? "");
  const [isPublic, setIsPublic] = useState<boolean>(
    playlist?.isPublic ?? false,
  );
  const [description, setDescription] = useState<string>(
    playlist?.description ?? "",
  );
  const [contents, setContents] = useState(playlist?.contents ?? []);

  const getPlaylist = useCallback(async () => {
    const response = await PlaylistService.GetPlaylist(id);
    if (!response) {
      return;
    }
    setPlaylist(response.Data);
    setName(response.Data.name);
    setIsPublic(response.Data.isPublic);
    setDescription(response.Data.description);
    setContents(response.Data.contents);
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

  const renderContentCard = useCallback(
    ({ item, drag }: RenderItemParams<(typeof contents)[number]>) => (
      <ContentCard
        content={item}
        isInPlaylist={true}
        playlistId={id}
        studentId={playlist?.studentsId}
        onLongPress={drag}
      />
    ),
    [id, playlist?.studentsId],
  );

  const handleOrderChange = useCallback((newOrder: typeof contents) => {
    setContents(newOrder);
  }, []);

  const updatePlaylist = useCallback(async () => {
    if (!playlist) {
      alert("Playlist não encontrada");

      return;
    }
    const data = {
      name,
      description,
      isPublic,
      contents: contents.map((content, index) => ({
        contentId: content.id,
        order: index + 1,
      })),
    };

    const response = await PlaylistService.UpdatePlaylist(
      data,
      id,
      playlist.studentsId,
    );

    if (response) {
      if (response.Success) {
        alert("Playlist atualizada com sucesso");
        stackNavigation.navigate("Playlists");
        return;
      } else {
        alert(`Erro ao atualizar playlist: ${response.Data.errors[0].message}`);
        return;
      }
    }
  }, [name, isPublic, description, contents, id, playlist, stackNavigation]);

  return (
    <Auth>
      <View style={styles.container}>
        {playlist && (
          <View style={styles.content}>
            <TextInput
              value={name}
              onChangeText={setName}
              style={styles.textInput}
              placeholder="Nome da playlist"
            />
            <TextInput
              value={description}
              onChangeText={setDescription}
              style={styles.textInput}
              placeholder="Descrição da playlist"
            />
            <View style={styles.switchContainer}>
              <Text>{isPublic ? "Pública" : "Privada"}</Text>
              <Switch value={isPublic} onValueChange={setIsPublic} />
            </View>
            <CustomButton
              title="Salvar"
              onPress={updatePlaylist}
              btnBackground="#2196f3"
              btnBorder={{
                radius: 10,
                px: 0,
              }}
            />
            <Text>Conteúdos</Text>
            <View style={{ flex: 1 }}>
              <DraggableFlatList
                data={contents}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderContentCard}
                onDragEnd={({ data }) => handleOrderChange(data)}
                contentContainerStyle={{ paddingBottom: 20 }}
                ListFooterComponent={<View style={{ height: 50 }} />}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
              />
            </View>
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
  },
  content: {
    flex: 1,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 15,
  },
  flatListContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});

export default EditPlaylist;
