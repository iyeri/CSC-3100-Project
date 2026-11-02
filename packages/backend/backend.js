// backend.js
import express from "express";
import userService from "./services/user-services.ts";

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

// Allowed columns (object keys) for updates.
const USER_UPDATE_ALLOWED_KEYS = [
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

// /users path.
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

// /books path.
// todo

// /listings path.
// todo

// /loans path.
// todo

app.listen(port, () => {
  console.log(`Server is running locally at http://localhost:8000`);
});
