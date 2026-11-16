import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import {
  SourceSerif4_600SemiBold,
  SourceSerif4_700Bold,
} from "@expo-google-fonts/source-serif-4";
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";

import { BottomNav } from "./src/components/BottomNav";
import { AddScreen } from "./src/screens/AddScreen";
import { BrowseScreen } from "./src/screens/BrowseScreen";
import ListingsScreen from "./src/screens/ListingsScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import GenrePreferencesScreen from "./src/screens/GenrePreferencesScreen";
import { colors } from "./src/theme";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    SourceSerif4_600SemiBold,
    SourceSerif4_700Bold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  const [activeTab, setActiveTab] = useState("Home");
  // Frontend-only auth gate. Swap for the real Supabase session later.
  const [session, setSession] = useState(null);
  const [authScreen, setAuthScreen] = useState("login");
  // Onboarding flag — true only for fresh signups so returning users (and
  // eventually anyone with saved preferences in Supabase) skip the genre
  // picker.
  const [needsGenrePrefs, setNeedsGenrePrefs] = useState(false);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (!session) {
    return (
      <View style={styles.app}>
        <StatusBar style="dark" />
        {authScreen === "login" ? (
          <LoginScreen
            onAuthed={(info) => {
              setNeedsGenrePrefs(false);
              setSession(info);
            }}
            onSwitchToSignup={() => setAuthScreen("signup")}
          />
        ) : (
          <SignupScreen
            onAuthed={(info) => {
              setNeedsGenrePrefs(true);
              setSession(info);
            }}
            onSwitchToLogin={() => setAuthScreen("login")}
          />
        )}
      </View>
    );
  }

  if (needsGenrePrefs) {
    return (
      <View style={styles.app}>
        <StatusBar style="dark" />
        <GenrePreferencesScreen
          onComplete={(genres) => {
            // TODO(prefs): persist to Supabase (e.g. user_preferences table).
            setSession((prev) => ({ ...prev, favoriteGenres: genres }));
            setNeedsGenrePrefs(false);
          }}
        />
      </View>
    );
  }

  const screen = () => {
    switch (activeTab) {
      case "Home":
        return <ListingsScreen />;
      case "Browse":
        return <BrowseScreen />;
      case "Add":
        return <AddScreen />;
      case "Profile":
        return <ProfileScreen />;
      default:
        return <ListingsScreen />;
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
