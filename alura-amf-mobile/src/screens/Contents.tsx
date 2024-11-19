import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  StyleSheet,
} from "react-native";
import Auth from "../components/base/Auth";
import { useCallback, useEffect, useState } from "react";
import ContentService from "../services/api/ContentService";
import { ContentType } from "../types/contentTypes";
import ContentCard from "../components/ContentCard";

export const Contents: React.FC<{}> = () => {
  const [contents, setContents] = useState<ContentType[]>([]);
  const [loading, setLoading] = useState(true);

  const getContents = useCallback(() => {
    setLoading(true);
    ContentService.GetContents()
      .then((contents) => {
        if (contents) {
          setContents(contents.Data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    getContents();
  }, [getContents]);

  return (
    <Auth>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Conteúdos</Text>
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            data={contents}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <ContentCard {...item} />}
          />
        )}
      </View>
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
