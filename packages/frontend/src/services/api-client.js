// api-client.js
import { getAccessToken } from "./token-storage";

const DEFAULT_API_URL = "http://localhost:8000";
const API_URL = (process.env.EXPO_PUBLIC_API_URL || DEFAULT_API_URL).replace(
  /\/$/,
  "",
);

/* ApiError
 *
 * Custom error class for API errors. It extends the built-in Error class and includes
 * additional properties for the HTTP status code and the response data.
 */
export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/* readResponse()
 *
 * Helper function for reading the response body of a fetch request.
 * It checks the content type of the response and returns the body as JSON if the content
 * type is application/json, or as text otherwise. If the response body is empty, it returns null.
 */
async function readResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text || null;
}

/* apiRequest()
 *
 * Makes an API request to the specified path with the given options. It automatically includes
 * the access token in the Authorization header if it is available. It also sets the Content-Type
 * header to application/json if the request body is present and the header is not already set.
 *
 * options - An object containing options for the fetch request, such as method, headers, and body.
 *   method - The HTTP method to use for the request (GET, POST, PATCH, DELETE).
 *   headers - An object containing any additional headers to include in the request.
 *   body - The request body containing the data to be sent.
 */
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
    // The backend may return a string message or a JSON object with an error message.
    const message =
      typeof data === "string" ? data : `Request failed (${response.status}).`;
    throw new ApiError(message, response.status, data);
  }

  return data;
}
