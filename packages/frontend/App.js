import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";

import { ProfileScreen } from "./src/screens/ProfileScreen";
import { colors } from "./src/theme";

export default function App() {
  return (
    <View style={styles.app}>
      <StatusBar style="dark" />
      <ProfileScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
});
