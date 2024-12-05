import { FlatList, Text, View, StyleSheet } from "react-native";
import Auth from "../components/base/Auth";
import { useCallback, useEffect, useState } from "react";
import ContentService from "../services/api/ContentService";
import { ContentType } from "../types/contentTypes";
import ContentCard from "../components/ContentCard";
import { Screen } from "../components/base/Screen";
import Loading from "../components/base/Loading";

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
  }, [setLoading, setContents]);

  useEffect(() => {
    getContents();
  }, [getContents]);

  if (loading) {
    return <Screen>{Loading()}</Screen>;
  }

  return (
    <Auth>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Conteúdos</Text>
          {loading ? (
            <View>{Loading()}</View>
          ) : (
            <FlatList
              data={contents}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <ContentCard content={item} isInPlaylist={false} />
              )}
            />
          )}
        </View>
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
