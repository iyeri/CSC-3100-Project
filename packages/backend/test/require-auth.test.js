import assert from "node:assert/strict";
import test from "node:test";

import { requireAuth } from "../middlewares/require-auth.js";

function createResponse() {
  return {
    statusCode: undefined,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    send(body) {
      this.body = body;
      return this;
    },
  };
}

test("requireAuth rejects requests without an authenticated user", () => {
  const response = createResponse();
  let nextCalled = false;

  requireAuth({}, response, () => {
    nextCalled = true;
  });

  assert.equal(response.statusCode, 401);
  assert.equal(response.body, "Authentication required.");
  assert.equal(nextCalled, false);
});

test("requireAuth allows requests with an authenticated user", () => {
  const response = createResponse();
  let nextCalled = false;

  requireAuth({ user: { id: "user-123" } }, response, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(response.statusCode, undefined);
});
