import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import {
  SourceSerif4_400Regular,
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
import ListingDetailScreen from "./src/screens/ListingDetailScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import GenrePreferencesScreen from "./src/screens/GenrePreferencesScreen";
import { mockListings } from "./src/data/mockListings";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    SourceSerif4_400Regular,
    SourceSerif4_600SemiBold,
    SourceSerif4_700Bold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  const [activeTab, setActiveTab] = useState("Home");
  // When set, overlays the active tab with the listing detail screen. Null
  // means no listing is open. Reset to null to "go back" to the tab.
  const [selectedListingId, setSelectedListingId] = useState(null);
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
      <View className="flex-1 bg-canvas">
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
      <View className="flex-1 bg-canvas">
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
        return <ListingsScreen onOpenListing={setSelectedListingId} />;
      case "Browse":
        return <BrowseScreen />;
      case "Add":
        return <AddScreen />;
      case "Profile":
        return <ProfileScreen />;
      default:
        return <ListingsScreen onOpenListing={setSelectedListingId} />;
    }
  };

  // When a listing is selected, present its detail screen full-bleed over
  // the tabs. No bottom nav on the detail screen to match the Figma mock.
  // If the id doesn't resolve (stale state after a data refresh) we silently
  // fall through to the tab view; the next card tap will overwrite the id.
  const selectedListing = selectedListingId
    ? mockListings.find((l) => l.id === selectedListingId)
    : null;

  if (selectedListing) {
    return (
      <View className="flex-1 bg-canvas">
        <StatusBar style="dark" />
        <ListingDetailScreen
          listing={selectedListing}
          onBack={() => setSelectedListingId(null)}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-canvas">
      <StatusBar style="dark" />
      <View className="flex-1">{screen()}</View>
      <BottomNav activeTab={activeTab} onNavigate={setActiveTab} />
    </View>
  );
}
