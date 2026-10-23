// backend.js
import express from "express";
import userService from "./services/users-service.ts";
import bookService from "./services/books-service.ts";
import listingService from "./services/listings-service.ts";
import loanService from "./services/loans-service.ts";

// Table columns (object keys) for checking post and patch requests.
const userKeys = [
  "uid",
  "username",
  "name",
  "calpoly_email",
  "bio",
  "pfp_url",
  "credit_balance",
  "on_campus",
  "date_joined",
  "account_status",
];
const bookKeys = ["book_id", "title", "author", "genre", "description"];
const listingKeys = [
  "listing_id",
  "book_id",
  "availability",
  "condition",
  "lender",
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

// Initialize express web application.
const app = express();
const port = 8000;
app.use(express.json()); // Allow express to parse JSON data.

// Root path.
app.get("/", (req, res) => {
  res.send("This is the root path/endpoint.");
});

// The /users path.
app.get("/users", async (req, res) => {
  const uid = req.query.uid;
  const username = req.query.username;
  const name = req.query.name;

  const data = await userService.getUsers(uid, username, name);

  if (data === undefined) {
    res.status(500).send("Database failure (getting user).");
    return;
  }

  if (data.length === 0) {
    res.status(404).send("User not found.");
    return;
  }

  res.status(200).send(data);
});

app.post("/users", async (req, res) => {
  // Validating request...
  if (
    req.body.uid !== undefined || // Not allowed to choose uid.
    req.body.username === undefined || // Must have username.
    req.body.calpoly_email === undefined || // Must have Cal Poly email.
    // req.body.credit_balance !== undefined || // Not allowed to choose credit balance.
    Object.keys(req.body).filter((key) => !userKeys.includes(key)).length > 0 // Extraneous keys.
  ) {
    res.status(400).send("Bad request.");
  }

  const newUser = await userService.addUser(req.body);

  if (newUser === undefined) {
    res.status(500).send("Database failure (adding user).");
    return;
  }

  if (newUser.length === 0) {
    res.status(409).send("User already exists.");
  }

  res.status(200).send(newUser);
});

app.delete("/users/:uid", async (req, res) => {
  const deletedUser = await userService.deleteUser(req.params.uid);

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

app.patch("/users/:uid", async (req, res) => {
  // Check if user exists.
  const user = await userService.getUsers(req.params.uid);
  if (user === undefined) {
    res.status(500).send("Database failure (fetching user).");
    return;
  }
  if (user.length === 0) {
    res.status(404).send("User not found.");
    return;
  }

  // Validate request body.
  if (
    req.body.uid !== undefined || // Not allowed to change uid.
    Object.keys(req.body).filter((key) => !userKeys.includes(key)).length > 0 // Extraneous keys.
  ) {
    res.status(409).send("Bad request.");
    return;
  }

  const updatedUser = await userService.updateUser(req.params.uid, req.body);

  if (updatedUser === undefined) {
    res.status(500).send("Database failure (updating user).");
    return;
  }

  if (updatedUser.length === 0) {
    res.status(404).send("Username or Cal Poly email already exists.");
    return;
  }

  res.status(200).send(updatedUser);
});

app.get("/users/:uid/loans", async (req, res) => {
  const uid = req.params.uid;
  const role = req.query.role; // Required query parameter, user can be "lender" or "borrower".

  if (role !== "lender" && role !== "borrower") {
    res.status(400).send("Bad request. Role must be 'lender' or 'borrower'.");
    return;
  }

  let data;
  if (role === "lender") {
    data = await loanService.getLoans(
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

  res.status(200).send(data);
});

// The /books path.
app.get("/books", async (req, res) => {
  const book_id = req.query.book_id;
  const title = req.query.title;
  const author = req.query.author;
  const genre = req.query.genre;

  const data = await bookService.getBooks(book_id, title, author, genre);

  if (data === undefined) {
    res.status(500).send("Database failure (getting books).");
    return;
  }

  if (data.length === 0) {
    res.status(404).send("Book not found.");
    return;
  }

  res.status(200).send(data);
});

app.post("/books", async (req, res) => {
  // Validating request...
  if (
    req.body.book_id === undefined || // Must have book_id.
    Object.keys(req.body).filter((key) => !bookKeys.includes(key)).length > 0 // Extraneous keys.
  ) {
    res.status(400).send("Bad request.");
  }

  const newBook = await bookService.addBook(req.body);

  if (newBook === undefined) {
    res.status(500).send("Database failure (adding book).");
    return;
  }

  if (newBook.length === 0) {
    res.status(409).send("Book already exists.");
  }

  res.status(200).send(newBook);
});

app.delete("/books/:book_id", async (req, res) => {
  const deletedBook = await bookService.deleteBook(req.params.book_id);

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

app.patch("/books/:book_id", async (req, res) => {
  // Validate request body.
  if (
    req.body.book_id !== undefined || // Not allowed to change book_id.
    Object.keys(req.body).filter((key) => !bookKeys.includes(key)).length > 0 // Extraneous keys.
  ) {
    res.status(409).send("Bad request.");
    return;
  }

  const updatedBook = await bookService.updateBook(
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

  res.status(200).send(updatedBook);
});

// The /listings path.
app.get("/listings", async (req, res) => {
  const listing_id = req.query.listing_id;
  const book_id = req.query.book_id;
  const availability = req.query.availability;
  const condition = req.query.condition;
  const lender = req.query.lender;

  const data = await listingService.getListings(
    listing_id,
    book_id,
    availability,
    condition,
    lender,
  );

  if (data === undefined) {
    res.status(500).send("Database failure (getting listings).");
    return;
  }

  if (data.length === 0) {
    res.status(404).send("Listing not found.");
    return;
  }

  res.status(200).send(data);
});

app.post("/listings", async (req, res) => {
  // Validating request...
  if (
    req.body.listing_id !== undefined || // Not allowed to choose listing_id.
    req.body.book_id === undefined || // Must have book_id.
    req.body.lender === undefined || // Must have lender.
    Object.keys(req.body).filter((key) => !listingKeys.includes(key)).length > 0 // Extraneous keys.
  ) {
    res.status(400).send("Bad request.");
  }

  const newListing = await listingService.addListing(req.body);

  if (newListing === undefined) {
    res.status(500).send("Database failure (adding listing).");
    return;
  }

  // This should only occur in a UUID collision.
  if (newListing.length === 0) {
    res.status(409).send("Listing already exists.");
  }

  res.status(200).send(newListing);
});

app.delete("/listings/:listing_id", async (req, res) => {
  const deletedListing = await listingService.deleteListing(
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

app.patch("/listings/:listing_id", async (req, res) => {
  // Validate request body.
  if (
    req.body.listing_id !== undefined || // Not allowed to change listing_id.
    Object.keys(req.body).filter((key) => !listingKeys.includes(key)).length > 0 // Extraneous keys.
  ) {
    res.status(409).send("Bad request.");
    return;
  }

  const updatedListing = await listingService.updateListing(
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

  res.status(200).send(updatedListing);
});

// The /loans path.
app.get("/loans", async (req, res) => {
  const loan_id = req.query.loan_id;
  const listing_id = req.query.listing_id;
  const lender = req.query.lender;
  const borrower = req.query.borrower;
  const date_lended = req.query.date_lended;
  const due_date = req.query.due_date;
  const is_overdue = req.query.is_overdue;

  const data = await loanService.getLoans(
    loan_id,
    listing_id,
    lender,
    borrower,
    date_lended,
    due_date,
    is_overdue,
  );

  if (data === undefined) {
    res.status(500).send("Database failure (getting loans).");
    return;
  }

  if (data.length === 0) {
    res.status(404).send("Loan not found.");
    return;
  }

  res.status(200).send(data);
});

app.post("/loans", async (req, res) => {
  // Validating request...
  if (
    req.body.loan_id !== undefined || // Not allowed to choose loan_id.
    req.body.listing_id === undefined || // Must have listing_id.
    req.body.lender === undefined || // Must have lender.
    req.body.borrower === undefined || // Must have borrower.
    Object.keys(req.body).filter((key) => !loanKeys.includes(key)).length > 0 // Extraneous keys.
  ) {
    res.status(400).send("Bad request.");
  }

  const newLoan = await loanService.addLoan(req.body);

  if (newLoan === undefined) {
    res.status(500).send("Database failure (adding loan).");
    return;
  }

  // This should only occur in a UUID collision.
  if (newLoan.length === 0) {
    res.status(409).send("Loan already exists.");
  }

  res.status(200).send(newLoan);
});

app.delete("/loans/:loan_id", async (req, res) => {
  const deletedLoan = await loanService.deleteLoan(req.params.loan_id);

  if (deletedLoan === undefined) {
    res.status(500).send("Database failure (deleting loan).");
    return;
  }

  if (deletedLoan.length === 0) {
    res.status(404).send("Loan not found.");
    return;
  }

  res.status(200).send("Loan deleted.");
});

app.patch("/loans/:loan_id", async (req, res) => {
  // Validate request body.
  if (
    req.body.loan_id !== undefined || // Not allowed to change loan_id.
    Object.keys(req.body).filter((key) => !loanKeys.includes(key)).length > 0 // Extraneous keys.
  ) {
    res.status(409).send("Bad request.");
    return;
  }

  const updatedLoan = await loanService.updateLoan(
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

  res.status(200).send(updatedLoan);
});

app.listen(8000, () => {
  console.log(`Server is running locally at http://localhost:8000`);
});
