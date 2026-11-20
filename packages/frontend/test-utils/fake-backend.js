// In-memory stand-in for the Express backend, used by the frontend tests.
//
// installFakeBackend() replaces global.fetch, so the app's real frontend code
// (screens, services, adapters, token storage) runs unchanged and only the
// network is faked. The routes and responses mirror packages/backend/src/backend.js.

const VALID_TOKEN = "test-access-token";

function jsonResponse(status, body) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: { get: () => "application/json" },
    json: async () => body,
    text: async () => JSON.stringify(body),
  };
}

function textResponse(status, body) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: { get: () => "text/plain" },
    json: async () => {
      throw new SyntaxError("Not JSON");
    },
    text: async () => body,
  };
}

// Reads a header whether the app passed a Headers instance or a plain object.
function readHeader(headers, name) {
  if (!headers) return null;
  if (typeof headers.get === "function") return headers.get(name);
  const key = Object.keys(headers).find(
    (k) => k.toLowerCase() === name.toLowerCase(),
  );
  return key ? headers[key] : null;
}

export function installFakeBackend({
  genres = [],
  books = [],
  listings = [],
  user = { id: "user-1", email: "student@calpoly.edu" },
  password = "correct-password",
} = {}) {
  const db = {
    genres: [...genres],
    books: [...books],
    bookGenres: [],
    listings: [...listings],
  };
  // Lets a test force a route to fail, e.g. failures["POST /listings"] = ...
  const failures = {};
  // Lets a test replace a route's response, e.g. the login body.
  const overrides = {};
  const requests = [];
  let nextId = 1;

  function currentUser(options) {
    const auth = readHeader(options.headers, "Authorization");
    return auth === `Bearer ${VALID_TOKEN}` ? user : null;
  }

  function route(method, path, options) {
    const body = options.body ? JSON.parse(options.body) : undefined;
    const signedIn = currentUser(options);

    if (method === "POST" && path === "/auth/login") {
      if (body.email !== user.email || body.password !== password) {
        return textResponse(500, "Database failure (logging in user).");
      }
      return jsonResponse(200, {
        access_token: VALID_TOKEN,
        token_type: "bearer",
        user,
      });
    }

    if (method === "GET" && path === "/auth/me") {
      if (readHeader(options.headers, "Authorization") && !signedIn) {
        return textResponse(401, "Invalid or expired auth token.");
      }
      if (!signedIn) return textResponse(401, "Authentication required.");
      return jsonResponse(200, user);
    }

    if (method === "GET" && path === "/genres") {
      return jsonResponse(200, db.genres);
    }

    if (method === "POST" && path === "/books") {
      if (!signedIn) return textResponse(401, "Authentication required.");
      const book = { book_id: `book-${nextId++}`, description: null, ...body };
      db.books.push(book);
      return jsonResponse(200, [book]);
    }

    const bookGenres = path.match(/^\/books\/([^/]+)\/genres$/);
    if (method === "POST" && bookGenres) {
      if (!signedIn) return textResponse(401, "Authentication required.");
      const rows = body.genres.map((genre_id) => ({
        book_id: bookGenres[1],
        genre_id,
      }));
      db.bookGenres.push(...rows);
      return jsonResponse(200, rows);
    }

    if (method === "POST" && path === "/listings") {
      if (!signedIn) return textResponse(401, "Authentication required.");
      const listing = {
        listing_id: `listing-${nextId++}`,
        condition: null,
        date_posted: "2026-11-16T12:00:00.000Z",
        ...body,
        lender_id: signedIn.id,
      };
      db.listings.push(listing);
      return jsonResponse(200, [listing]);
    }

    if (method === "GET" && path === "/listings") {
      // Same shape as listingService.getListings: each listing with books(*).
      // Like the real route, an empty result is a 404.
      if (db.listings.length === 0) {
        return textResponse(404, "Listing not found.");
      }
      return jsonResponse(
        200,
        db.listings.map((listing) => ({
          ...listing,
          books: db.books.find((b) => b.book_id === listing.book_id) ?? null,
        })),
      );
    }

    return textResponse(404, `No fake route for ${method} ${path}`);
  }

  const fetchMock = jest.fn(async (url, options = {}) => {
    const method = (options.method ?? "GET").toUpperCase();
    const path = new URL(url).pathname;
    const key = `${method} ${path}`;
    requests.push({
      method,
      path,
      authorization: readHeader(options.headers, "Authorization"),
      body: options.body ? JSON.parse(options.body) : undefined,
    });

    if (failures[key]) return failures[key]();
    if (overrides[key]) return overrides[key]();
    return route(method, path, options);
  });

  global.fetch = fetchMock;

  return {
    db,
    requests,
    failures,
    overrides,
    validToken: VALID_TOKEN,
    jsonResponse,
    textResponse,
  };
}

// expo-secure-store has no native module under Jest, so the tests swap in
// this Map-backed version. Use it with:
//   jest.mock("expo-secure-store", () => require("../test-utils/fake-backend").fakeSecureStore);
const secureStore = new Map();
export const fakeSecureStore = {
  setItemAsync: async (key, value) => {
    secureStore.set(key, value);
  },
  getItemAsync: async (key) => secureStore.get(key) ?? null,
  deleteItemAsync: async (key) => {
    secureStore.delete(key);
  },
  __clear: () => secureStore.clear(),
};
