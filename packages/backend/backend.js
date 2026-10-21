// backend.js
import express from "express";
import userService from "./services/users-service.ts";
import bookService from "./services/books-service.ts";
import listingService from "./services/listings-service.ts";
import loanService from "./services/loans-service.ts";

const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

const RESPONSE_MESSAGES = {
  ADD_USER_DATABASE_FAILURE: "Database failure (adding user).",
  DELETE_USER_DATABASE_FAILURE: "Database failure (deleting user).",
  FETCH_USER_DATABASE_FAILURE: "Database failure (fetching user).",
  GET_USER_DATABASE_FAILURE: "Database failure (getting user).",
  UPDATE_USER_DATABASE_FAILURE: "Database failure (updating user).",
  BAD_REQUEST: "Bad request.",
  USER_ALREADY_EXISTS: "User already exists.",
  USER_DELETED: "User deleted.",
  USER_NOT_FOUND: "User not found.",
  USERNAME_OR_EMAIL_ALREADY_EXISTS: "Username or Cal Poly email already exists.",
};

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

const USER_UPDATE_ALLOWED_KEYS = userKeys.filter((key) => key !== "uid");
const REQUIRED_NEW_USER_KEYS = ["username", "calpoly_email"];

function sendResponse(res, status, body) {
  return res.status(status).send(body);
}

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasRequiredKeys(body, keys) {
  return keys.every((key) => body[key] !== undefined);
}

function hasOnlyAllowedKeys(body, allowedKeys) {
  return Object.keys(body).every((key) => allowedKeys.includes(key));
}

function isValidNewUser(body) {
  return (
    isObject(body) &&
    body.uid === undefined &&
    body.credit_balance === undefined &&
    hasRequiredKeys(body, REQUIRED_NEW_USER_KEYS)
  );
}

function isValidUserUpdate(body) {
  return (
    isObject(body) &&
    body.uid === undefined &&
    hasOnlyAllowedKeys(body, USER_UPDATE_ALLOWED_KEYS)
  );
}

// Initialize express web application.
const app = express();
const port = 8000;
app.use(express.json()); // Allow express to parse JSON data.

// Root path.
app.get("/", (req, res) => {
  return res.send("This is the root path/endpoint.");
});

// The /users path.
app.get("/users", async (req, res) => {
  const uid = req.query.uid;
  const username = req.query.username;
  const name = req.query.name;

  const data = await userService.getUsers(uid, username, name);

  if (data === undefined) {
    return sendResponse(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      RESPONSE_MESSAGES.GET_USER_DATABASE_FAILURE,
    );
  }

  if (data.length === 0) {
    return sendResponse(res, HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.USER_NOT_FOUND);
  }

  return sendResponse(res, HTTP_STATUS.OK, data);
});

app.post("/users", async (req, res) => {
  if (!isValidNewUser(req.body)) {
    return sendResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      RESPONSE_MESSAGES.BAD_REQUEST,
    );
  }

  const newUser = await userService.addUser(req.body);

  if (newUser === undefined) {
    return sendResponse(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      RESPONSE_MESSAGES.ADD_USER_DATABASE_FAILURE,
    );
  }

  if (newUser.length === 0) {
    return sendResponse(
      res,
      HTTP_STATUS.CONFLICT,
      RESPONSE_MESSAGES.USER_ALREADY_EXISTS,
    );
  }

  return sendResponse(res, HTTP_STATUS.OK, newUser);
});

app.delete("/users/:uid", async (req, res) => {
  const deletedUser = await userService.deleteUser(req.params.uid);

  if (deletedUser === undefined) {
    return sendResponse(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      RESPONSE_MESSAGES.DELETE_USER_DATABASE_FAILURE,
    );
  }

  if (deletedUser.length === 0) {
    return sendResponse(res, HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.USER_NOT_FOUND);
  }

  return sendResponse(res, HTTP_STATUS.OK, RESPONSE_MESSAGES.USER_DELETED);
});

app.patch("/users/:uid", async (req, res) => {
  // Check if user exists.
  const user = await userService.getUsers(req.params.uid);
  if (user === undefined) {
    return sendResponse(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      RESPONSE_MESSAGES.FETCH_USER_DATABASE_FAILURE,
    );
  }
  if (user.length === 0) {
    return sendResponse(res, HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.USER_NOT_FOUND);
  }

  // Validate request body.
  if (!isValidUserUpdate(req.body)) {
    return sendResponse(
      res,
      HTTP_STATUS.CONFLICT,
      RESPONSE_MESSAGES.BAD_REQUEST,
    );
  }

  const updatedUser = await userService.updateUser(req.params.uid, req.body);

  if (updatedUser === undefined) {
    return sendResponse(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      RESPONSE_MESSAGES.UPDATE_USER_DATABASE_FAILURE,
    );
  }

  if (updatedUser.length === 0) {
    return sendResponse(
      res,
      HTTP_STATUS.NOT_FOUND,
      RESPONSE_MESSAGES.USERNAME_OR_EMAIL_ALREADY_EXISTS,
    );
  }

  return sendResponse(res, HTTP_STATUS.OK, updatedUser);
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

app.listen(port, () => {
  console.log(`Server is running locally at http://localhost:8000`);
});
