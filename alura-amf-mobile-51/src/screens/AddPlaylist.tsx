import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Switch,
} from "react-native";
import React, { useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackNavigationParams } from "../../App";
import { useNavigation } from "@react-navigation/native";
import Auth from "../components/base/Auth";
import { Screen } from "../components/base/Screen";
import PlaylistService from "../services/api/PlaylistService";

type AddPlaylistNavigationProp = StackNavigationProp<
  StackNavigationParams,
  "AddPlaylist"
>;

export const AddPlaylist: React.FC = () => {
  const navigation = useNavigation<AddPlaylistNavigationProp>();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const handleSubmit = async () => {
    try {
      const data = {
        name,
        description,
        isPublic,
      };
      const response = await PlaylistService.CreatePlaylist(data);
      console.log(response);
      if (response?.Success) {
        navigation.navigate("Playlists");
      } else {
        throw new Error("Erro ao criar playlist");
      }
    } catch (error) {
      alert(error);
      navigation.navigate("Playlists");
    }
  };

  return (
    <Auth>
      <Screen>
        <Text style={styles.title}>Criar Playlist</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome da Playlist"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Descrição da Playlist"
          value={description}
          onChangeText={(text) => setDescription(text)}
          multiline
          numberOfLines={4}
        />
        <View style={styles.toggleContainer}>
          <Text>Pública</Text>
          <Switch
            value={isPublic}
            onValueChange={(value) => setIsPublic(value)}
          />
        </View>
        <Button title="Criar Playlist" onPress={handleSubmit} />
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
});
