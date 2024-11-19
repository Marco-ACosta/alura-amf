import { RouteProp, useRoute } from "@react-navigation/native";
import { Text } from "react-native";
import { Screen } from "../components/base/Screen";
import Auth from "../components/base/Auth";
import { StackNavigationParams } from "../../App";
import { useCallback, useEffect, useState } from "react";
import ContentService from "../services/api/ContentService";
import { ContentDetailsType } from "../types/contentTypes";

const ContentDetails: React.FC<{}> = () => {
  const { params } =
    useRoute<RouteProp<StackNavigationParams, "ContentDetails">>();
  const id = params.id;
  const [content, setContent] = useState<ContentDetailsType | null>(null);
  const getContent = useCallback(async () => {
    const response = await ContentService.GetContent(id);
    if (!response) {
      return;
    }
    setContent(response.Data);
  }, [id]);

  useEffect(() => {
    getContent();
  }, [getContent]);

  return (
    <Auth>
      <Screen>
        <Text>{content?.title}</Text>
        <Text>{content?.description}</Text>
      </Screen>
    </Auth>
  );
};

export default ContentDetails;
