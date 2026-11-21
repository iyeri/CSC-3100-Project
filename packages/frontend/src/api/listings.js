import { API_BASE } from "../config";
import { colors } from "../theme";

// Fetches book postings from the Express backend. GET /listings returns each
// listing joined with its book row:
//
//   { listing_id, book_id, availability, condition, lender, date_posted,
//     books: { book_id, title, author, genre, description } }
//
// The backend answers 404 when there are no listings, so that resolves to an
// empty array instead of an error.
export async function fetchListings() {
  const url = `${API_BASE}/listings`;
  let res;
  try {
    res = await fetch(url, { headers: { Accept: "application/json" } });
  } catch (err) {
    // Network-level failure: include the address so it's clear which
    // server the app tried to reach.
    throw new Error(`Can't reach ${url} (${err.message})`);
  }

  if (res.status === 404) return [];
  if (!res.ok) {
    throw new Error(`Couldn't load listings (HTTP ${res.status}).`);
  }

  const rows = await res.json();
  return rows.map(toListing);
}

// Cover color pairs (background + type color), all from the theme tokens.
// A listing always gets the same pair, picked from a hash of its id.
const COVERS = [
  { cover: colors.butter, accent: colors.forest },
  { cover: colors.sky, accent: colors.ink },
  { cover: colors.lavender, accent: colors.ink },
  { cover: colors.forest, accent: colors.acid },
  { cover: colors.ink, accent: colors.coral },
  { cover: colors.sageGreen, accent: colors.textPrimary },
  { cover: colors.cream, accent: colors.darkGreen },
  { cover: colors.coral, accent: colors.ink },
];

// Maps a backend row to the shape BookCard and ListingDetailScreen render.
function toListing(row) {
  const book = row.books ?? {};
  const title = book.title ?? "Untitled";

  return {
    id: row.listing_id,
    bookId: row.book_id,
    title,
    author: book.author ?? "Unknown author",
    genre: book.genre ?? "",
    description: book.description ?? "",
    condition: row.condition ?? "",
    // The listings table has no hardcover/paperback column yet.
    format: "",
    // "available" -> "AVAILABLE", which BookCard checks for its green dot.
    status: (row.availability ?? "").toUpperCase(),
    postedAt: row.date_posted ?? null,
    mark: title.charAt(0).toUpperCase(),
    ...COVERS[hash(row.listing_id) % COVERS.length],
    // TODO(users): /listings only returns the lender's uid. Replace these
    // placeholders once the backend joins the users table.
    postedBy: {
      uid: row.lender,
      name: "Cal Poly student",
      email: "Email not available yet",
      initial: "?",
      avatarBg: colors.darkGreen,
    },
    // TODO(tokens): the schema doesn't store a borrow cost yet.
    tokens: 1,
  };
}

function hash(value) {
  const str = String(value ?? "");
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}
