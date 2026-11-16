import { Platform } from "react-native";

// Base URL for the OurLibrary backend (packages/backend, Express on port 8000).
//
// Platform caveats:
//   - iOS simulator can reach the host machine via `localhost`.
//   - Android emulator reaches the host machine via the magic address
//     10.0.2.2 — `localhost` on Android resolves to the emulator itself.
//   - Physical devices must use the dev machine's LAN IP (e.g. 192.168.x.x).
//     Set EXPO_PUBLIC_API_BASE when running on a device.
//
// We honor EXPO_PUBLIC_API_BASE first (Expo exposes EXPO_PUBLIC_* env vars to
// the client bundle at build time) so running on a phone is just an env tweak.
const DEFAULT_PORT = 8000;
const envBase = process.env.EXPO_PUBLIC_API_BASE;

export const API_BASE =
  envBase ??
  (Platform.OS === "android"
    ? `http://10.0.2.2:${DEFAULT_PORT}`
    : `http://localhost:${DEFAULT_PORT}`);
