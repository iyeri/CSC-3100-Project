# CSC-3100-Project


## Backend unit tests

Backend unit tests use Node.js's built-in test runner (`node --test`). They test request-validation rules and the `requireAuth` middleware in isolation.

Install dependencies from the project root, then run the tests:

```bash
npm install
npm test
```

The request-validation and authentication middleware are the test-driven feature area: the tests define accepted and rejected user payloads and authenticated versus unauthenticated requests.

No external service, environment variable, seed data, or test database is required for these unit tests. Current limitations: API routes and Supabase queries do not yet have automated integration tests; future backend tests should add isolated database and authorization-path coverage.
