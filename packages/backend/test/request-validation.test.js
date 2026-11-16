import assert from "node:assert/strict";
import test from "node:test";

import {
  isValidNewUser,
  isValidUserUpdate,
} from "../services/request-validation.js";

test("isValidNewUser accepts required user fields", () => {
  assert.equal(
    isValidNewUser({
      username: "reader",
      calpoly_email: "reader@calpoly.edu",
      bio: "Always looking for another book.",
    }),
    true,
  );
});

test("isValidNewUser rejects client-provided uid and unknown fields", () => {
  assert.equal(
    isValidNewUser({
      uid: "client-chosen-id",
      username: "reader",
      calpoly_email: "reader@calpoly.edu",
    }),
    false,
  );
  assert.equal(
    isValidNewUser({
      username: "reader",
      calpoly_email: "reader@calpoly.edu",
      is_admin: true,
    }),
    false,
  );
});

test("isValidUserUpdate accepts permitted partial updates", () => {
  assert.equal(isValidUserUpdate({ bio: "New bio", on_campus: true }), true);
});

test("isValidUserUpdate rejects uid changes and non-object bodies", () => {
  assert.equal(isValidUserUpdate({ uid: "different-user" }), false);
  assert.equal(isValidUserUpdate(["bio"]), false);
});
