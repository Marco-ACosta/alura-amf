import { ActivityIndicator, View } from "react-native";

/** Componente de loading padrão para a aplicação */
export default function Loading(text?: string) {
  return (
    <View>
      <ActivityIndicator color="darkblue" size="large" />
    </View>
  );
}
