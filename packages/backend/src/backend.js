// backend.js
import express from "express";
import userService from "../services/users-service.ts";
import bookService from "../services/books-service.ts";
import genreService from "../services/genres-service.ts";
import listingService from "../services/listings-service.ts";
import loanService from "../services/loans-service.ts";
import reviewService from "../services/reviews-service.ts";
import { signup, login } from "../services/signuplogin-service.ts";
import {
  attachAuthContext,
  requireAuth,
} from "../middlewares/authentication.js";
import {
  isValidNewUser,
  isValidUserUpdate,
} from "../services/request-validation.js";
import cors from "cors";

// Table columns (object keys) for checking post and patch requests.
const bookKeys = ["book_id", "title", "author", "description"];
const listingKeys = [
  "listing_id",
  "book_id",
  "availability",
  "condition",
  "lender_id",
  "date_posted",
];
const loanKeys = [
  "loan_id",
  "listing_id",
  "lender",
  "borrower",
  "date_lended",
  "due_date",
  "is_overdue",
];
const reviewKeys = [
  "review_id",
  "loan_id",
  "reviewer_id",
  "reviewee_id",
  "rating",
  "comment",
];

// Initialize express web application.
const app = express();
const port = 8000;

// Let the Expo web app (served by Metro on port 8081) call this API from the
// browser. Phones and simulators don't need this; browsers do. Add other
// origins with CORS_ORIGINS, comma-separated, e.g.
// CORS_ORIGINS=http://localhost:8081,http://192.168.1.20:8081
const allowedOrigins = (process.env.CORS_ORIGINS ?? "http://localhost:8081")
  .split(",")
  .map((origin) => origin.trim());
app.use(cors({ origin: allowedOrigins }));

app.use(express.json()); // Allow express to parse JSON data.
app.use(attachAuthContext); // Attach authentication context to each request.

// Root path.
app.get("/", (req, res) => {
  res.send("This is the root path/endpoint.");
});

// The /auth (signup, login, refresh token) path.
app.post("/auth/signup", async (req, res) => {
  const db_client = req.db_client;
  const email = req.body.email;
  const password = req.body.password;

  const user = await signup(db_client, email, password);

  if (user === undefined) {
    res.status(500).send("Database failure (signing up user).");
    return;
  }

  res.status(200).json(user);
});

app.post("/auth/login", async (req, res) => {
  const db_client = req.db_client;
  const email = req.body.email;
  const password = req.body.password;

  const session = await login(db_client, email, password);

  if (session === undefined) {
    res.status(500).send("Database failure (logging in user).");
    return;
  }

  res.status(200).json(session);
});

app.post("/auth/logout", requireAuth, async (req, res) => {
  // For now, just clear the access token on the client side. No server-side actions.
  // Supabase docs says:
  // There is no way to revoke a user's access token jwt until it expires.
  // It is recommended to set a shorter expiry on the jwt for this reason.
  res.status(200).send("Logged out successfully.");
});

app.get("/auth/me", requireAuth, async (req, res) => {
  // Return the authenticated user's information.
  res.status(200).json(req.user);
});

app.get("/auth/refresh", requireAuth, async (req, res) => {
  // TODO
  res.status(501).send("Not implemented.");
});

// The /users path.
app.get("/users", requireAuth, async (req, res) => {
  const data = await userService.getUsers(
    req.db_client,
    req.query.uid,
    req.query.username,
    req.query.name,
  );

  if (data === undefined) {
    res.status(500).send("Database failure (getting user).");
    return;
  }

  if (data.length === 0) {
    res.status(404).send("User not found.");
    return;
  }

  res.status(200).json(data);
});

app.post("/users", requireAuth, async (req, res) => {
  if (!isValidNewUser(req.body)) {
    res.status(400).send("Bad request.");
    return;
  }

  const newUser = await userService.addUser(req.db_client, req.body);

  if (newUser === undefined) {
    res.status(500).send("Database failure (adding user).");
    return;
  }

  if (newUser.length === 0) {
    res.status(409).send("User already exists.");
    return;
  }

  res.status(200).json(newUser);
});

app.delete("/users/:uid", requireAuth, async (req, res) => {
  const deletedUser = await userService.deleteUser(
    req.db_client,
    req.params.uid,
  );

  if (deletedUser === undefined) {
    res.status(500).send("Database failure (deleting user).");
    return;
  }

  if (deletedUser.length === 0) {
    res.status(404).send("User not found.");
    return;
  }

  res.status(200).send("User deleted.");
});

app.patch("/users/:uid", requireAuth, async (req, res) => {
  // Check if user exists.
  const user = await userService.getUsers(req.db_client, req.params.uid);
  if (user === undefined) {
    res.status(500).send("Database failure (fetching user).");
    return;
  }
  if (user.length === 0) {
    res.status(404).send("User not found.");
    return;
  }

  if (!isValidUserUpdate(req.body)) {
    res.status(409).send("Bad request.");
    return;
  }

  const updatedUser = await userService.updateUser(
    req.db_client,
    req.params.uid,
    req.body,
  );

  if (updatedUser === undefined) {
    res.status(500).send("Database failure (updating user).");
    return;
  }

  if (updatedUser.length === 0) {
    res.status(404).send("Username or Cal Poly email already exists.");
    return;
  }

  res.status(200).json(updatedUser);
});

app.get("/users/:uid/loans", requireAuth, async (req, res) => {
  const uid = req.params.uid;
  const role = req.query.role; // Required query parameter, user can be "lender" or "borrower".

  if (role !== "lender" && role !== "borrower") {
    res.status(400).send("Bad request. Role must be 'lender' or 'borrower'.");
    return;
  }

  let data;
  if (role === "lender") {
    data = await loanService.getLoans(
      req.db_client,
      undefined,
      undefined,
      uid,
      undefined,
      undefined,
      undefined,
      undefined,
    );
  } else if (role === "borrower") {
    data = await loanService.getLoans(
      req.db_client,
      undefined,
      undefined,
      undefined,
      uid,
      undefined,
      undefined,
      undefined,
    );
  }

  if (data === undefined) {
    res.status(500).send("Database failure (getting loans).");
    return;
  }

  res.status(200).json(data);
});

app.get("/users/:uid/preferences", requireAuth, async (req, res) => {
  genres = await userService.getUserPreferences(req.db_client, req.params.uid);

  if (genres === undefined) {
    res.status(500).send("Database failure (getting user preferences).");
    return;
  }

  res.status(200).json(genres);
});

app.put("/users/:uid/preferences", requireAuth, async (req, res) => {
  if (!Array.isArray(req.body.genres)) {
    res.status(400).send("Bad request. 'genres' must be an array.");
    return;
  }

  const data = await userService.addUserPreferences(
    req.db_client,
    req.params.uid,
    req.body.genres,
  );

  if (data === undefined) {
    res.status(500).send("Database failure (updating user preferences).");
    return;
  }

  res.status(200).json(data);
});

app.delete("/users/:uid/preferences", requireAuth, async (req, res) => {
  const data = await userService.deleteUserPreferences(
    req.db_client,
    req.params.uid,
    req.query.genre,
  );

  if (data === undefined) {
    res.status(500).send("Database failure (deleting user preferences).");
    return;
  }

  res.status(200).json(data);
});

app.get("/users/:uid/reviews", requireAuth, async (req, res) => {
  const data = await userService.getUserReviews(req.db_client, req.params.uid);

  if (data === undefined) {
    res.status(500).send("Database failure (getting user reviews).");
    return;
  }

  res.status(200).json(data);
});

// The /books path.
app.get("/books", async (req, res) => {
  const data = await bookService.getBooks(
    req.db_client,
    req.query.book_id,
    req.query.title,
    req.query.author,
    req.query.genre,
  );

  if (data === undefined) {
    res.status(500).send("Database failure (getting books).");
    return;
  }

  if (data.length === 0) {
    res.status(404).send("Book not found.");
    return;
  }

  res.status(200).json(data);
});

app.post("/books", requireAuth, async (req, res) => {
  // Validating request...
  if (
    req.body.book_id !== undefined || // Database generates book_id.
    typeof req.body.title !== "string" ||
    req.body.title.trim().length === 0 ||
    Object.keys(req.body).filter((key) => !bookKeys.includes(key)).length > 0 // Extraneous keys.
  ) {
    res.status(400).send("Bad request.");
    return;
  }

  const newBook = await bookService.addBook(req.db_client, req.body);

  if (newBook === undefined) {
    res.status(500).send("Database failure (adding book).");
    return;
  }

  if (newBook.length === 0) {
    res.status(409).send("Book already exists.");
    return;
  }

  res.status(200).json(newBook);
});

app.delete("/books/:book_id", requireAuth, async (req, res) => {
  const deletedBook = await bookService.deleteBook(
    req.db_client,
    req.params.book_id,
  );

  if (deletedBook === undefined) {
    res.status(500).send("Database failure (deleting book).");
    return;
  }

  if (deletedBook.length === 0) {
    res.status(404).send("Book not found.");
    return;
  }

  res.status(200).send("Book deleted.");
});

app.patch("/books/:book_id", requireAuth, async (req, res) => {
  // Validate request body.
  if (
    req.body.book_id !== undefined || // Not allowed to change book_id.
    Object.keys(req.body).filter((key) => !bookKeys.includes(key)).length > 0 // Extraneous keys.
  ) {
    res.status(409).send("Bad request.");
    return;
  }

  const updatedBook = await bookService.updateBook(
    req.db_client,
    req.params.book_id,
    req.body,
  );

  if (updatedBook === undefined) {
    res.status(500).send("Database failure (updating book).");
    return;
  }

  if (updatedBook.length === 0) {
    res.status(404).send("Book not found.");
    return;
  }

  res.status(200).json(updatedBook);
});

app.get("/books/:book_id/genres", async (req, res) => {
  const data = await bookService.getBookGenres(
    req.db_client,
    req.params.book_id,
  );

  if (data === undefined) {
    res.status(500).send("Database failure (getting book genres).");
    return;
  }

  res.status(200).json(data);
});

app.post("/books/:book_id/genres", requireAuth, async (req, res) => {
  if (!Array.isArray(req.body.genres)) {
    res.status(400).send("Bad request. 'genres' must be an array.");
    return;
  }

  const data = await bookService.addBookGenres(
    req.db_client,
    req.params.book_id,
    req.body.genres,
  );

  if (data === undefined) {
    res.status(500).send("Database failure (adding book genres).");
    return;
  }

  res.status(200).json(data);
});

app.delete("/books/:book_id/genres", requireAuth, async (req, res) => {
  const data = await bookService.deleteBookGenres(
    req.db_client,
    req.params.book_id,
    req.query.genre,
  );

  if (data === undefined) {
    res.status(500).send("Database failure (deleting book genres).");
    return;
  }

  res.status(200).json(data);
});

// The /genres path.
app.get("/genres", async (req, res) => {
  const data = await genreService.getGenres(req.db_client);

  if (data === undefined) {
    res.status(500).send("Database failure (getting genres).");
    return;
  }

  res.status(200).json(data);
});

app.post("/genres", requireAuth, async (req, res) => {
  if (req.body.genre === undefined) {
    res.status(400).send("Bad request. 'genre' is required.");
    return;
  }

  const newGenre = await genreService.addGenre(req.db_client, req.body.genre);

  if (newGenre === undefined) {
    res.status(500).send("Database failure (adding genre).");
    return;
  }

  if (newGenre.length === 0) {
    res.status(409).send("Genre already exists.");
    return;
  }

  res.status(200).json(newGenre);
});

app.delete("/genres/:genre", requireAuth, async (req, res) => {
  const deletedGenre = await genreService.deleteGenre(
    req.db_client,
    req.params.genre,
  );

  if (deletedGenre === undefined) {
    res.status(500).send("Database failure (deleting genre).");
    return;
  }

  if (deletedGenre.length === 0) {
    res.status(404).send("Genre not found.");
    return;
  }

  res.status(200).send("Genre deleted.");
});

// The /listings path.
app.get("/listings", async (req, res) => {
  const data = await listingService.getListings(
    req.db_client,
    req.query.listing_id,
    req.query.book_id,
    req.query.availability,
    req.query.condition,
    req.query.lender,
  );

  if (data === undefined) {
    res.status(500).send("Database failure (getting listings).");
    return;
  }

  if (data.length === 0) {
    res.status(404).send("Listing not found.");
    return;
  }

  res.status(200).json(data);
});

app.post("/listings", requireAuth, async (req, res) => {
  // Validating request...
  if (
    req.body.listing_id !== undefined || // Not allowed to choose listing_id.
    req.body.lender_id !== undefined || // Lender is the authenticated user.
    req.body.book_id === undefined || // Must have book_id.
    Object.keys(req.body).filter((key) => !listingKeys.includes(key)).length > 0 // Extraneous keys.
  ) {
    res.status(400).send("Bad request.");
    return;
  }

  const newListing = await listingService.addListing(req.db_client, {
    ...req.body,
    lender_id: req.user.id,
  });

  if (newListing === undefined) {
    res.status(500).send("Database failure (adding listing).");
    return;
  }

  // This should only occur in a UUID collision.
  if (newListing.length === 0) {
    res.status(409).send("Listing already exists.");
    return;
  }

  res.status(200).json(newListing);
});

app.delete("/listings/:listing_id", requireAuth, async (req, res) => {
  const deletedListing = await listingService.deleteListing(
    req.db_client,
    req.params.listing_id,
  );

  if (deletedListing === undefined) {
    res.status(500).send("Database failure (deleting listing).");
    return;
  }

  if (deletedListing.length === 0) {
    res.status(404).send("Listing not found.");
    return;
  }

  res.status(200).send("Listing deleted.");
});

app.patch("/listings/:listing_id", requireAuth, async (req, res) => {
  // Validate request body.
  if (
    req.body.listing_id !== undefined || // Not allowed to change listing_id.
    Object.keys(req.body).filter((key) => !listingKeys.includes(key)).length > 0 // Extraneous keys.
  ) {
    res.status(409).send("Bad request.");
    return;
  }

  const updatedListing = await listingService.updateListing(
    req.db_client,
    req.params.listing_id,
    req.body,
  );

  if (updatedListing === undefined) {
    res.status(500).send("Database failure (updating listing).");
    return;
  }

  if (updatedListing.length === 0) {
    res.status(404).send("Listing not found.");
    return;
  }

  res.status(200).json(updatedListing);
});

// The /loans path.
app.get("/loans", requireAuth, async (req, res) => {
  const data = await loanService.getLoans(
    req.db_client,
    req.query.loan_id,
    req.query.listing_id,
    req.query.lender,
    req.query.borrower,
    req.query.date_lended,
    req.query.due_date,
    req.query.is_overdue,
  );

  if (data === undefined) {
    res.status(500).send("Database failure (getting loans).");
    return;
  }

  if (data.length === 0) {
    res.status(404).send("Loan not found.");
    return;
  }

  res.status(200).json(data);
});

app.post("/loans", requireAuth, async (req, res) => {
  // Validating request...
  if (
    req.body.loan_id !== undefined || // Not allowed to choose loan_id.
    req.body.listing_id === undefined || // Must have listing_id.
    req.body.lender === undefined || // Must have lender.
    req.body.borrower === undefined || // Must have borrower.
    Object.keys(req.body).filter((key) => !loanKeys.includes(key)).length > 0 // Extraneous keys.
  ) {
    res.status(400).send("Bad request.");
    return;
  }

  const newLoan = await loanService.addLoan(req.db_client, req.body);

  if (newLoan === undefined) {
    res.status(500).send("Database failure (adding loan).");
    return;
  }

  // This should only occur in a UUID collision.
  if (newLoan.length === 0) {
    res.status(409).send("Loan already exists.");
    return;
  }

  res.status(200).json(newLoan);
});

app.delete("/loans/:loan_id", requireAuth, async (req, res) => {
  const deletedLoan = await loanService.deleteLoan(
    req.db_client,
    req.params.loan_id,
  );

  if (deletedLoan === undefined) {
    res.status(500).send("Database failure (deleting loan).");
    return;
  }

  if (deletedLoan.length === 0) {
    res.status(404).send("Loan not found.");
    return;
  }

  res.status(200).json({ message: "Loan deleted." });
});

app.patch("/loans/:loan_id", requireAuth, async (req, res) => {
  // Validate request body.
  if (
    req.body.loan_id !== undefined || // Not allowed to change loan_id.
    Object.keys(req.body).filter((key) => !loanKeys.includes(key)).length > 0 // Extraneous keys.
  ) {
    res.status(409).send("Bad request.");
    return;
  }

  const updatedLoan = await loanService.updateLoan(
    req.db_client,
    req.params.loan_id,
    req.body,
  );

  if (updatedLoan === undefined) {
    res.status(500).send("Database failure (updating loan).");
    return;
  }

  if (updatedLoan.length === 0) {
    res.status(404).send("Loan not found.");
    return;
  }

  res.status(200).json(updatedLoan);
});

app.post("/loans/:loan_id/reviews", requireAuth, async (req, res) => {
  // Validating request...
  if (
    req.body.review_id !== undefined || // Not allowed to choose review_id.
    req.body.loan_id === undefined || // Must have loan_id.
    req.body.reviewer_id === undefined || // Must have reviewer_id.
    req.body.reviewee_id === undefined || // Must have reviewee_id.
    req.body.rating === undefined || // Must have rating.
    Object.keys(req.body).filter(
      (key) =>
        ![
          "review_id",
          "loan_id",
          "reviewer_id",
          "reviewee_id",
          "rating",
          "comment",
        ].includes(key),
    ).length > 0 // Extraneous keys.
  ) {
    res.status(400).send("Bad request.");
    return;
  }

  const newReview = await reviewService.addReview(req.db_client, req.body);

  if (newReview === undefined) {
    res.status(500).send("Database failure (adding review).");
    return;
  }

  // This should only occur in a UUID collision.
  if (newReview.length === 0) {
    res.status(409).send("Review already exists.");
    return;
  }

  res.status(200).json(newReview);
});

// The /reviews path.
app.get("/reviews", requireAuth, async (req, res) => {
  const data = await reviewService.getReviews(
    req.db_client,
    req.query.review_id,
    req.query.loan_id,
    req.query.reviewer_id,
    req.query.reviewee_id,
    req.query.rating,
  );

  if (data === undefined) {
    res.status(500).send("Database failure (getting reviews).");
    return;
  }

  if (data.length === 0) {
    res.status(404).send("Review not found.");
    return;
  }

  res.status(200).json(data);
});

app.patch("/reviews/:review_id", requireAuth, async (req, res) => {
  // Validate request body.
  if (
    req.body.review_id !== undefined || // Not allowed to change review_id.
    Object.keys(req.body).filter((key) => !["rating", "comment"].includes(key))
      .length > 0 // Extraneous keys.
  ) {
    res.status(409).send("Bad request.");
    return;
  }

  const updatedReview = await reviewService.updateReview(
    req.db_client,
    req.params.review_id,
    req.body,
  );

  if (updatedReview === undefined) {
    res.status(500).send("Database failure (updating review).");
    return;
  }

  if (updatedReview.length === 0) {
    res.status(404).send("Review not found.");
    return;
  }

  res.status(200).json(updatedReview);
});

app.delete("/reviews/:review_id", requireAuth, async (req, res) => {
  const deletedReview = await reviewService.deleteReview(
    req.db_client,
    req.params.review_id,
  );

  if (deletedReview === undefined) {
    res.status(500).send("Database failure (deleting review).");
    return;
  }

  if (deletedReview.length === 0) {
    res.status(404).send("Review not found.");
    return;
  }

  res.status(200).json({ message: "Review deleted." });
});

app.listen(8000, () => {
  console.log(`Server is running locally at http://localhost:8000`);
});
