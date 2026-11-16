import { apiRequest, ApiError } from "./api-client";
import { clearAccessToken, storeAccessToken } from "./token-storage";

export async function signup(email, password) {
  await clearAccessToken(); // Clear any existing token before signing up.

  const response = await apiRequest("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  return response;
}

export async function login(email, password) {
  await clearAccessToken(); // Clear any existing token before logging in.

  const session = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (!session?.access_token || !session.user?.id) {
    throw new ApiError(
      "The login response did not include a complete session.",
      500,
      session,
    );
  }

  await storeAccessToken(session.access_token);
  return session;
}

export async function logout() {
  await clearAccessToken();
}

export async function restoreSession() {
  const user = await apiRequest("/auth/me", { method: "GET" });

  return user;
}
