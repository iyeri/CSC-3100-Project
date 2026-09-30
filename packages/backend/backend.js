// backend.js
import express from "express";
import userService from "./services/user-services.ts";

// Allowed columns (object keys).
const allowedKeys = [
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

// Initialize express web application.
const app = express();
const port = 8000;
app.use(express.json()); // Allow express to parse JSON data.

// Root path.
app.get("/", (req, res) => {
  res.send("This is the root path/endpoint.");
});

// /users path.
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
    req.body.credit_balance !== undefined // Not allowed to choose credit balance.
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
    res.status(404).send("User not found.");
    return;
  }

  // Validate request body.
  if (
    req.body.uid !== undefined || // Not allowed to change uid.
    Object.keys(req.body).filter((key) => !allowedKeys.includes(key)).length > 0 // Extraneous keys.
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

// /books path.
// todo

// /listings path.
// todo

// /loans path.
// todo

app.listen(8000, () => {
  console.log(`Server is running locally at http://localhost:8000`);
});
