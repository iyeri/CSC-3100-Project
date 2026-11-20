import Constants from "expo-constants";
import { Platform } from "react-native";

// Base URL for the Express backend (packages/backend, port 8000).
//
// In development, Expo knows the address of the computer running `npm start`
// (hostUri, e.g. "192.168.1.20:8081"). The backend runs on that same computer,
// so we reuse its host. That makes Expo Go on a phone, the iOS simulator, and
// the Android emulator all work without extra setup.
//
// Set EXPO_PUBLIC_API_BASE to override it, e.g. when using `expo start --tunnel`
// (the tunnel only forwards Metro, not port 8000) or a deployed backend.
const PORT = 8000;

const devHost = Constants.expoConfig?.hostUri?.split(":")[0];

export const API_BASE =
  process.env.EXPO_PUBLIC_API_BASE ??
  (devHost
    ? `http://${devHost}:${PORT}`
    : Platform.OS === "android"
      ? `http://10.0.2.2:${PORT}`
      : `http://localhost:${PORT}`);
