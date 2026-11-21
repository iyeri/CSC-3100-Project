// System tests: each one runs several real frontend modules together
// (screen -> service -> api-client -> token storage) against a fake backend
// that only replaces the network.

import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";

import { AddScreen } from "../src/screens/AddScreen";
import { addBookListing } from "../src/services/add-client";
import { getListings } from "../src/services/listings-client";
import { toBookCardModel } from "../src/adapters/listing-adapter";
import { login, logout, restoreSession } from "../src/services/auth-client";
import { getAccessToken } from "../src/services/token-storage";
import {
  fakeSecureStore,
  installFakeBackend,
} from "../test-utils/fake-backend";

jest.mock(
  "expo-secure-store",
  () => require("../test-utils/fake-backend").fakeSecureStore,
);

const EMAIL = "student@calpoly.edu";
const PASSWORD = "correct-password";

beforeEach(() => {
  fakeSecureStore.__clear();
  jest.spyOn(console, "error").mockImplementation(() => {});
  // React Native warns that its SafeAreaView is deprecated; not relevant here.
  jest.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("System test 1: a user creates a new book posting", () => {
  let backend;

  beforeEach(async () => {
    backend = installFakeBackend({
      genres: [
        { genre_id: "genre-fantasy", name: "Fantasy" },
        { genre_id: "genre-mystery", name: "Mystery" },
      ],
    });
    // Posting a book requires being signed in.
    await login(EMAIL, PASSWORD);
  });

  test("the posting is saved and then appears in the homepage listings", async () => {
    const created = await addBookListing({
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      genre: "Fantasy",
      status: "Available",
      condition: "Good",
    });

    // The service made the backend calls in order, all signed in.
    expect(backend.requests.map((r) => `${r.method} ${r.path}`)).toEqual([
      "POST /auth/login",
      "GET /genres",
      "POST /books",
      `POST /books/${created.book_id}/genres`,
      "POST /listings",
    ]);
    const writes = backend.requests.filter((r) => r.method === "POST").slice(1);
    for (const request of writes) {
      expect(request.authorization).toBe(`Bearer ${backend.validToken}`);
    }

    // The book, its genre, and the listing were all stored.
    expect(backend.db.books).toEqual([
      expect.objectContaining({
        book_id: created.book_id,
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
      }),
    ]);
    expect(backend.db.bookGenres).toEqual([
      { book_id: created.book_id, genre_id: "genre-fantasy" },
    ]);
    expect(backend.db.listings).toEqual([
      expect.objectContaining({
        listing_id: created.listing_id,
        book_id: created.book_id,
        availability: "available",
        condition: "Good",
        lender_id: "user-1",
      }),
    ]);

    // Fetching listings the way the homepage does returns the new posting.
    const cards = (await getListings()).map(toBookCardModel);
    expect(cards).toEqual([
      expect.objectContaining({
        id: created.listing_id,
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        status: "AVAILABLE",
      }),
    ]);
  });

  test("if the posting can't be saved, the user is told and nothing is listed", async () => {
    backend.failures["POST /listings"] = () =>
      backend.textResponse(500, "Database failure (adding listing).");

    await render(<AddScreen />);
    await fireEvent.changeText(
      screen.getByPlaceholderText("ex. Beloved"),
      "Dune",
    );
    await fireEvent.changeText(
      screen.getByPlaceholderText("ex. Toni Morrison "),
      "Frank Herbert",
    );
    await fireEvent.changeText(
      screen.getByPlaceholderText("ex. Available, Current Read, Lent"),
      "Available",
    );
    await fireEvent.press(screen.getByText("Submit Book"));

    expect(
      await screen.findByText("Database failure (adding listing)."),
    ).toBeOnTheScreen();
    expect(screen.queryByText("Your listing was added.")).toBeNull();
    expect(backend.db.listings).toHaveLength(0);
    // No listings means the homepage request comes back as "not found".
    await expect(getListings()).rejects.toMatchObject({ status: 404 });
  });

  test("an unknown genre is rejected before anything is saved", async () => {
    await expect(
      addBookListing({
        title: "Dune",
        author: "Frank Herbert",
        genre: "Space Opera",
        status: "Available",
      }),
    ).rejects.toThrow("Unknown genre: Space Opera.");

    expect(backend.db.books).toHaveLength(0);
    expect(backend.db.listings).toHaveLength(0);
  });
});

describe("System test 2: a user logs in and stays logged in", () => {
  let backend;

  beforeEach(() => {
    backend = installFakeBackend();
  });

  test("logging in saves the token, and the next session check uses it", async () => {
    const session = await login(EMAIL, PASSWORD);

    expect(session.user.id).toBe("user-1");
    expect(await getAccessToken()).toBe(backend.validToken);

    // This is what App.js does on startup to restore the session.
    const restored = await restoreSession();

    expect(restored).toEqual({
      user: { id: "user-1", email: "student@calpoly.edu" },
    });
    const meRequest = backend.requests.find((r) => r.path === "/auth/me");
    expect(meRequest.authorization).toBe(`Bearer ${backend.validToken}`);
  });

  test("an incomplete login response is rejected and no token is saved", async () => {
    backend.overrides["POST /auth/login"] = () =>
      backend.jsonResponse(200, { user: { id: "user-1" } });

    await expect(login(EMAIL, PASSWORD)).rejects.toThrow(
      "The login response did not include a complete session.",
    );
    expect(await getAccessToken()).toBeNull();
    await expect(restoreSession()).rejects.toMatchObject({ status: 401 });
  });

  test("logging out ends the session", async () => {
    await login(EMAIL, PASSWORD);
    await logout();

    expect(await getAccessToken()).toBeNull();
    await expect(restoreSession()).rejects.toMatchObject({
      status: 401,
      message: "Authentication required.",
    });
    const lastMe = backend.requests.filter((r) => r.path === "/auth/me").at(-1);
    expect(lastMe.authorization).toBeNull();
  });
});
