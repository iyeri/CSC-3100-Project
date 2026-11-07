import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";

import { BottomNav } from "./src/components/BottomNav";
import { AddScreen } from "./src/screens/AddScreen";
import { BrowseScreen } from "./src/screens/BrowseScreen";
import ListingsScreen from "./src/screens/ListingsScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { colors } from "./src/theme";
import { AuthDemoScreen } from "./src/screens/AuthDemoScreen";
  
export default function App() {
  const [activeTab, setActiveTab] = useState("Home");

  const screen = () => {
    switch (activeTab) {
      case "Home":
        return <AuthDemoScreen />;
      case "Browse":
        return <BrowseScreen />;
      case "Add":
        return <AddScreen />;
      case "Profile":
        return <ProfileScreen />;
      default:
        return <AuthDemoScreen />;
    }
  };

  return (
    <View style={styles.app}>
      <StatusBar style="dark" />
      <View style={styles.content}>{screen()}</View>
      <BottomNav activeTab={activeTab} onNavigate={setActiveTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  content: { flex: 1 },
});
