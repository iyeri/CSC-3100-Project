import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const ACCESS_TOKEN_KEY = "ourlibrary.accessToken";
const USER_ID_KEY = "ourlibrary.userId";

function getWebStorage() {
  if (typeof globalThis === "undefined") {
    return null;
  }

  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

export async function storeAccessToken(token) {
  if (typeof token !== "string" || token.length === 0) {
    throw new TypeError("A non-empty access token is required.");
  }

  if (Platform.OS === "web") {
    const storage = getWebStorage();
    if (!storage) {
      throw new Error("Browser storage is unavailable.");
    }

    storage.setItem(ACCESS_TOKEN_KEY, token);
    return;
  }

  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
}

export async function getAccessToken() {
  if (Platform.OS === "web") {
    return getWebStorage()?.getItem(ACCESS_TOKEN_KEY) ?? null;
  }

  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

export async function clearAccessToken() {
  if (Platform.OS === "web") {
    getWebStorage()?.removeItem(ACCESS_TOKEN_KEY);
    return;
  }

  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
}

export async function storeUserId(userId) {
  if (typeof userId !== "string" || userId.length === 0) {
    throw new TypeError("A non-empty user ID is required.");
  }

  if (Platform.OS === "web") {
    const storage = getWebStorage();
    if (!storage) {
      throw new Error("Browser storage is unavailable.");
    }

    storage.setItem(USER_ID_KEY, userId);
    return;
  }

  await SecureStore.setItemAsync(USER_ID_KEY, userId);
}

export async function getUserId() {
  if (Platform.OS === "web") {
    return getWebStorage()?.getItem(USER_ID_KEY) ?? null;
  }

  return SecureStore.getItemAsync(USER_ID_KEY);
}

export async function clearUserId() {
  if (Platform.OS === "web") {
    getWebStorage()?.removeItem(USER_ID_KEY);
    return;
  }

  await SecureStore.deleteItemAsync(USER_ID_KEY);
}
