// listing-adapter.js
import { coverThemes } from "../data/coverThemes";

// Helper function to hash a string into a number. 
// Used to assign a cover theme to a listing based on its book_id.
function hashString(value) {
  return [...value].reduce(
    (hash, character) => hash + character.charCodeAt(0),
    0,
  );
}

// Convert the listing data from the backend into the format expected by the BookCard component.
export function toBookCardModel(listing) {
  const book = listing.books;
  const theme =
    coverThemes[hashString(listing.book_id) % coverThemes.length];
  const title = book?.title ?? "Untitled";

  return {
    ...listing,
    id: listing.listing_id,
    title,
    author: book?.author ?? "Unknown author",
    status: listing.availability.toUpperCase(),
    mark: title.charAt(0).toUpperCase(),
    ...theme,
  };
}