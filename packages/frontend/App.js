import React, {useState} from "react";

import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";

import { BottomNav } from "./src/components/BottomNav";
import { BrowseScreen } from "./src/screens/BrowseScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { AddScreen } from "./src/screens/AddScreen";

import { colors } from "./src/theme";

export default function App() {
  const [activeTab, setActiveTab] = useState("Profile");
  
  const screen=()=>{
    switch(activeTab){
      case "Home":
        return<ProfileScreen/>;
      case "Browse":
        return <BrowseScreen/>;
      case "Profile":
        return <ProfileScreen/>;
      case "Add":
        return <AddScreen/>;
      default:
        return <ProfileScreen/>;
      }
  };
  return (
    <View style={styles.app}>
      <StatusBar style="dark" />
      <View style={styles.content}>{screen()}</View> 
      <BottomNav 
      activeTab={activeTab}
      onNavigate={setActiveTab}/>
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  content:{flex:1,},
});
