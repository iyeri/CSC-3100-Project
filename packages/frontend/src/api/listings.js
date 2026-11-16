import { API_BASE } from "../config";
import { colors } from "../theme";

// Fetches listings from the OurLibrary backend and shapes them into the form
// ListingCard + ListingDetailScreen already expect. The backend returns
// listings joined with their book row:
//
//   {
//     listing_id, isbn, availability, condition, lender, date_posted,
//     books: { isbn, title, author, genre, description }
//   }
//
// The grid card + detail screen were originally built against mockListings
// (title/author/condition/format/coverBg/accent/genre/tokens/postedBy/
// postedAt). `adaptListing` fills in deterministic covers and sensible
// placeholders for fields the DB doesn't yet carry.
//
// On a 404 (backend's "no listings match") we resolve to an empty array so
// callers can render an empty state instead of an error.
export async function fetchListings() {
  const res = await fetch(`${API_BASE}/listings`, {
    headers: { Accept: "application/json" },
  });

  if (res.status === 404) return [];

  if (!res.ok) {
    throw new Error(`Failed to load listings (${res.status})`);
  }

  const rows = await res.json();
  return rows.map(adaptListing);
}

// Pool of cover color combos, matching the Figma mock's palette rotation.
// Keeping this stable per listing_id means covers don't flicker between
// renders or fetches.
const COVER_PALETTE = [
  { coverBg: colors.cream, accent: colors.darkGreen },
  { coverBg: colors.sageGreen, accent: colors.darkGreen },
  { coverBg: colors.offWhite, accent: colors.sageGreen },
  { coverBg: colors.sageGreen, accent: colors.offWhite },
  { coverBg: colors.cream, accent: colors.sageGreen },
];

function adaptListing(row) {
  const book = row.books ?? {};
  const id = row.listing_id;
  const palette = COVER_PALETTE[hashId(id) % COVER_PALETTE.length];

  return {
    id,
    isbn: row.isbn,
    title: book.title ?? "Untitled",
    author: book.author ?? "Unknown author",
    genre: book.genre ?? "",
    condition: row.condition ?? "",
    // The listings table doesn't store format (hardcover/paperback) today.
    // Leaving blank; ListingCard hides the separator when format is empty.
    format: "",
    availability: row.availability ?? "available",
    postedAt: row.date_posted ?? null,
    // TODO(users): resolve lender uid → UserProfile row so we can show the
    // real name, email, and initial. Needs either /listings to join users or
    // a per-listing /users/:uid call. Until then, these are placeholders so
    // the detail screen doesn't crash.
    postedBy: {
      uid: row.lender,
      name: "Lender",
      email: "unknown@calpoly.edu",
      initial: "?",
      avatarBg: colors.darkGreen,
    },
    // Tokens aren't in the schema yet; default to 1 for the UI.
    tokens: 1,
    ...palette,
  };
}

// Tiny deterministic hash so a listing id maps to a stable palette slot.
function hashId(id) {
  const str = String(id ?? "");
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}
