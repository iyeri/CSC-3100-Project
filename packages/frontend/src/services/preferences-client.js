// preferences-client.js
import { apiRequest, ApiError } from "./api-client";

export async function getUserPreferences(userId) {
  if (!userId) {
    throw new Error("A user ID is required.");
  }

  return apiRequest(`/users/${encodeURIComponent(userId)}/preferences`, {
    method: "GET",
  });
}

export async function addUserPreferences(userId, preferences) {
  if (!userId) {
    throw new Error("A user ID is required.");
  }

  return apiRequest(`/users/${encodeURIComponent(userId)}/preferences`, {
    method: "POST",
    body: JSON.stringify(preferences),
    headers: { "Content-Type": "application/json" },
  });
}

// WIP
export async function deleteUserPreferences(userId) {
  if (!userId) {
    throw new Error("A user ID is required.");
  }

  return apiRequest(`/users/${encodeURIComponent(userId)}/preferences`, {
    method: "DELETE",
  });
}
