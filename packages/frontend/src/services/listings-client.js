// listings-client.js
import { apiRequest, ApiError } from "./api-client";

export async function getListings() {
  try {
    const response = await apiRequest("/listings", {
      method: "GET",
    });

    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError("Failed to fetch listings.");
  }
}

export async function getGenres() {
  try {
    const response = await apiRequest("/genres", {
      method: "GET",
    });

    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError("Failed to fetch genres.");
  }
}