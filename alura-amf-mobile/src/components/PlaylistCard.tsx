import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackNavigationParams } from "../../App";
import { PlaylistCardProps } from "../types/playlistTypes";
import CustomButton from "./CustomButton";
import PlaylistService from "../services/api/PlaylistService";

type ContentStackUseNavigationProps = StackNavigationProp<
  StackNavigationParams,
  "Tabs"
>;

const { width, height } = Dimensions.get("window");

const PlaylistCard: React.FC<PlaylistCardProps> = ({
  playlist: { id, name, description, contentCount, studentsId },
  refresh,
  hasButtons,
  addToPlaylist,
  contentId,
}) => {
  const stackNavigation = useNavigation<ContentStackUseNavigationProps>();
  const handleNavigation = async () => {
    stackNavigation.navigate("PlaylistDetails", { id });
  };
  const handleDelete = async () => {
    await PlaylistService.DeletePlaylist(id);
    refresh();
  };

  const handleEdit = async () => {
    stackNavigation.navigate("EditPlaylist", { id });
  };

  const handleAddToPlaylist = async () => {
    if (!contentId) {
      alert("Selecione um conteúdo");
      stackNavigation.navigate("Contents");
      return;
    }
    const response = await PlaylistService.AddContentToPlaylist(
      id,
      contentId,
      studentsId,
    );
    if (response) {
      if (response.Success) {
        alert("Conteúdo adicionado a playlist");
        stackNavigation.navigate("Contents");
        refresh();
      } else {
        console.log(response.Data.errors);
        alert(
          `Erro ao adicionar conteúdo a playlist: ${response.Data.errors[0].message}`,
        );
        stackNavigation.navigate("Contents");
      }
    }
  };

  return (
    <TouchableOpacity
      onPress={addToPlaylist ? handleAddToPlaylist : handleNavigation}
      style={styles.card}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.about}>Sobre: {description}</Text>
        <Text style={styles.contentCount}>Conteúdos: {contentCount}</Text>
        {hasButtons && (
          <View style={styles.buttonContainer}>
            <CustomButton
              title="Deletar"
              onPress={handleDelete}
              btnBackground="red"
              btnWidth="48.5%"
              btnBorder={{ px: 0, radius: 10 }}
            ></CustomButton>
            <CustomButton
              title="Editar"
              onPress={handleEdit}
              btnBackground="#2196f3"
              btnWidth="48.5%"
              btnBorder={{ px: 0, radius: 10 }}
            ></CustomButton>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
    marginVertical: 10,
    overflow: "hidden",
  },
  innerContainer: {
    alignItems: "flex-start",
    padding: 15,
    paddingBottom: 5,
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
    textAlign: "center",
    width: "100%",
  },
  about: {
    textAlign: "justify",
    width: "100%",
    fontSize: 14,
  },
  contentCount: {
    width: "100%",
    textAlign: "right",
    fontSize: 14,
  },
  thumbnail: {
    width: width * 0.8,
    height: height * 0.3,
    borderRadius: 8,
  },
});

export default PlaylistCard;
