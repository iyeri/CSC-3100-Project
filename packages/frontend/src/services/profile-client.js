// profile-client.js
import { apiRequest, ApiError } from "./api-client";

export async function getProfile(userId) {
  if (!userId) {
    throw new Error("A user ID is required.");
  }

  const users = await apiRequest(`/users?uid=${encodeURIComponent(userId)}`, {
    method: "GET",
  });

  if (!users[0]) {
    throw new ApiError("Profile not found.", 404);
  }

  return users[0];
}

export async function getBooks(userId) {
  if (!userId) {
    throw new Error("User ID is required to fetch books.");
  }

  return apiRequest(`/listings?lender=${encodeURIComponent(userId)}`, {
    method: "GET",
  });
}

export async function getReviews(userId) {
  if (!userId) {
    throw new Error("A user ID is required.");
  }

  return apiRequest(`/users/${encodeURIComponent(userId)}/reviews`, {
    method: "GET",
  });
}
