// UI tests: render real screens and check only what a user can see and do.
// The network is replaced by the fake backend; everything else is real.

import {
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react-native";

import App from "../App";
import { BrowseScreen } from "../src/screens/BrowseScreen";
import {
  fakeSecureStore,
  installFakeBackend,
} from "../test-utils/fake-backend";

jest.mock(
  "expo-secure-store",
  () => require("../test-utils/fake-backend").fakeSecureStore,
);
// Fonts and the splash screen are native-only; treat fonts as loaded.
jest.mock("expo-font", () => ({ useFonts: () => [true, null] }));
jest.mock("expo-splash-screen", () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));

const BOOKS = [
  { book_id: "book-1", title: "The Hobbit", author: "J.R.R. Tolkien" },
  { book_id: "book-2", title: "Dune", author: "Frank Herbert" },
];
const LISTINGS = [
  {
    listing_id: "listing-1",
    book_id: "book-1",
    availability: "available",
    condition: "Good",
    lender_id: "user-2",
    date_posted: "2026-11-10T12:00:00.000Z",
  },
  {
    listing_id: "listing-2",
    book_id: "book-2",
    availability: "lent",
    condition: "Fair",
    lender_id: "user-3",
    date_posted: "2026-11-12T12:00:00.000Z",
  },
];

beforeEach(() => {
  fakeSecureStore.__clear();
  jest.spyOn(console, "error").mockImplementation(() => {});
  // React Native warns that its SafeAreaView is deprecated; not relevant here.
  jest.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("UI test 1: a user opens a book posting to see its details", () => {
  beforeEach(async () => {
    installFakeBackend({ books: BOOKS, listings: LISTINGS });
    // Start signed in, so App skips the login screen.
    await fakeSecureStore.setItemAsync(
      "ourlibrary.accessToken",
      "test-access-token",
    );
  });

  test("tapping a posting on the home page shows its detail view", async () => {
    await render(<App />);

    const card = await screen.findByHintText(
      "View The Hobbit by J.R.R. Tolkien",
    );
    expect(screen.getByText("Fresh finds")).toBeOnTheScreen();

    await fireEvent.press(card);

    // The detail view shows the book, its condition, when it was posted,
    // and the borrow action.
    expect(
      await screen.findByText("Request to Borrow (1 Token)"),
    ).toBeOnTheScreen();
    expect(screen.getAllByText("The Hobbit").length).toBeGreaterThan(0);
    expect(screen.getByText("J.R.R. Tolkien")).toBeOnTheScreen();
    expect(screen.getByText("Good")).toBeOnTheScreen();
    expect(screen.getByText(/^Posted /)).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Go back" })).toBeOnTheScreen();
    // The home grid is no longer showing.
    expect(screen.queryByText("Fresh finds")).toBeNull();
  });

  test("the back button returns to the home page", async () => {
    await render(<App />);

    await fireEvent.press(
      await screen.findByHintText("View The Hobbit by J.R.R. Tolkien"),
    );
    await fireEvent.press(
      await screen.findByRole("button", { name: "Go back" }),
    );

    expect(await screen.findByText("Fresh finds")).toBeOnTheScreen();
    expect(screen.queryByText("Request to Borrow (1 Token)")).toBeNull();
  });
});

describe("UI test 2: a user searches for a book and sees results", () => {
  beforeEach(() => {
    installFakeBackend({ books: BOOKS, listings: LISTINGS });
  });

  async function searchFor(text) {
    await fireEvent.changeText(
      screen.getByPlaceholderText("Search by title/author/genre"),
      text,
    );
  }

  test("searching by title shows only the matching book", async () => {
    await render(<BrowseScreen />);
    expect(
      screen.getByText(
        "Enter a book title, author, or genre to search out library",
      ),
    ).toBeOnTheScreen();

    // "e" matches every book, so this waits for the listings to load.
    await searchFor("e");
    await screen.findByText("2 FOUND");

    await searchFor("hobbit");

    expect(screen.getByText("SEARCH RESULTS")).toBeOnTheScreen();
    expect(screen.getByText("1 FOUND")).toBeOnTheScreen();
    const result = screen.getByHintText("View The Hobbit by J.R.R. Tolkien");
    expect(within(result).getAllByText("The Hobbit").length).toBeGreaterThan(0);
    expect(screen.queryByHintText("View Dune by Frank Herbert")).toBeNull();
  });

  test("searching by author finds that author's book", async () => {
    await render(<BrowseScreen />);
    await searchFor("e");
    await screen.findByText("2 FOUND");

    await searchFor("Herbert");

    expect(screen.getByText("1 FOUND")).toBeOnTheScreen();
    expect(
      screen.getByHintText("View Dune by Frank Herbert"),
    ).toBeOnTheScreen();
  });

  test("a search with no matches says no books were found", async () => {
    await render(<BrowseScreen />);
    await searchFor("e");
    await screen.findByText("2 FOUND");

    await searchFor("zzz");

    expect(screen.getByText("0 FOUND")).toBeOnTheScreen();
    expect(screen.getByText("No Books Found")).toBeOnTheScreen();
  });

  test("clearing the search goes back to the start prompt", async () => {
    await render(<BrowseScreen />);
    await searchFor("e");
    await screen.findByText("2 FOUND");

    await fireEvent.press(screen.getByRole("button", { name: "Clear" }));

    expect(
      screen.getByText(
        "Enter a book title, author, or genre to search out library",
      ),
    ).toBeOnTheScreen();
    expect(screen.queryByText("SEARCH RESULTS")).toBeNull();
  });
});
