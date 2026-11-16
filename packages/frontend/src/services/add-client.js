import { apiRequest, ApiError } from "./api-client";

function requireText(value, fieldName) {
  const text = value?.trim();

  if (!text) {
    throw new TypeError(`${fieldName} is required.`);
  }

  return text;
}

function parseGenreNames(value) {
  return [
    ...new Set(
      value
        .split(",")
        .map((genre) => genre.trim())
        .filter(Boolean),
    ),
  ];
}

export function getGenres() {
  return apiRequest("/genres", { method: "GET" });
}

export function addBook({ title, author, description }) {
  return apiRequest("/books", {
    method: "POST",
    body: JSON.stringify({
      title: requireText(title, "Book title"),
      author: requireText(author, "Author"),
      ...(description?.trim() ? { description: description.trim() } : {}),
    }),
  });
}

export function addBookGenres(bookId, genreIds) {
  if (!bookId) {
    throw new TypeError("A book ID is required.");
  }

  if (!Array.isArray(genreIds)) {
    throw new TypeError("Genre IDs must be an array.");
  }

  return apiRequest(`/books/${encodeURIComponent(bookId)}/genres`, {
    method: "POST",
    body: JSON.stringify({ genres: genreIds }),
  });
}

export function addListing({ bookId, availability, condition }) {
  if (!bookId) {
    throw new TypeError("A book ID is required.");
  }

  return apiRequest("/listings", {
    method: "POST",
    body: JSON.stringify({
      book_id: bookId,
      availability: requireText(availability, "Status")
        .toLowerCase()
        .replace(/\s+/g, "_"),
      ...(condition?.trim() ? { condition: condition.trim() } : {}),
    }),
  });
}

export async function addBookListing({
  title,
  author,
  genre,
  status,
  condition,
}) {
  const genreNames = parseGenreNames(genre ?? "");
  let matchedGenres = [];

  if (genreNames.length > 0) {
    const availableGenres = await getGenres();
    const genresByName = new Map(
      availableGenres.map((item) => [item.name.toLowerCase(), item]),
    );

    matchedGenres = genreNames
      .map((name) => genresByName.get(name.toLowerCase()))
      .filter(Boolean);

    const matchedIds = new Set(matchedGenres.map((item) => item.genre_id));
    const unknownGenres = genreNames.filter((name) => {
      const match = genresByName.get(name.toLowerCase());
      return !match || !matchedIds.has(match.genre_id);
    });

    if (unknownGenres.length > 0) {
      throw new ApiError(
        `Unknown genre${unknownGenres.length === 1 ? "" : "s"}: ${unknownGenres.join(", ")}.`,
        400,
        { genres: unknownGenres },
      );
    }
  }

  const books = await addBook({ title, author });
  const book = books?.[0];

  if (!book?.book_id) {
    throw new ApiError("The API did not return the new book.", 500, books);
  }

  if (matchedGenres.length > 0) {
    await addBookGenres(
      book.book_id,
      matchedGenres.map((item) => item.genre_id),
    );
  }

  const listings = await addListing({
    bookId: book.book_id,
    availability: status,
    condition,
  });
  const listing = listings?.[0];

  if (!listing?.listing_id) {
    throw new ApiError(
      "The API did not return the new listing.",
      500,
      listings,
    );
  }

  return {
    ...listing,
    books: book,
    genres: matchedGenres,
  };
}
