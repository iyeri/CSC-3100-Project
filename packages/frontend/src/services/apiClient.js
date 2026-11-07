import {
  clearAccessToken,
  clearUserId,
  getAccessToken,
  storeAccessToken,
  storeUserId,
} from "./tokenStorage";

const DEFAULT_API_URL = "http://localhost:8000";
const API_URL = (process.env.EXPO_PUBLIC_API_URL || DEFAULT_API_URL).replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function readResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text || null;
}

export async function apiRequest(path, options = {}) {
  const { headers: suppliedHeaders, ...fetchOptions } = options;
  const headers = new Headers(suppliedHeaders);
  const token = await getAccessToken();

  if (fetchOptions.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...fetchOptions,
    headers,
  });
  const data = await readResponse(response);

  if (!response.ok) {
    const message = typeof data === "string" ? data : `Request failed (${response.status}).`;
    throw new ApiError(message, response.status, data);
  }

  return data;
}

export async function loginWithPassword(email, password) {
  const session = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (!session?.access_token || !session.user?.id) {
    throw new ApiError("The login response did not include a complete session.", 500, session);
  }

  await Promise.all([
    storeAccessToken(session.access_token),
    storeUserId(session.user.id),
  ]);
  return session;
}

export async function signupWithPassword(email, password) {
  return apiRequest("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function deleteUserProfile(userId) {
  const result = await apiRequest(`/users/${encodeURIComponent(userId)}`, {
    method: "DELETE",
  });

  await Promise.all([clearAccessToken(), clearUserId()]);
  return result;
}

export async function getUserById(userId) {
  return apiRequest(`/users?uid=${encodeURIComponent(userId)}`, {
    method: "GET",
  });
}

export async function logout() {
  await Promise.all([clearAccessToken(), clearUserId()]);
}

export { API_URL };
