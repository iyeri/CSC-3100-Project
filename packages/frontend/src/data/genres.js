// Single source of truth for genre names in the frontend.
//
// GENRES is the list shown on the signup genre-preferences form.
// LISTING_GENRES is what the home page filter chips show: the same genres
// plus "Textbook", which matters for listings but isn't a reading preference.
export const GENRES = [
  "Drama",
  "Romance",
  "Fantasy",
  "Mystery",
  "Thriller",
  "Horror",
  "Science fiction",
  "Historical fiction",
  "Western",
  "Comedy",
];

export const LISTING_GENRES = [...GENRES, "Textbook"];
