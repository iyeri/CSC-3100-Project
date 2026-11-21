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

## System tests

Frontend system tests use Jest with the `jest-expo` preset. They are in `packages/frontend/__tests__/system.test.js` and check that several parts of the app work together to complete one feature: the screen, the frontend service, the API client, and token storage all run for real, and only the network is replaced by an in-memory fake backend (`packages/frontend/test-utils/fake-backend.js`).

Install dependencies from the project root, then run the tests:

```bash
npm install
npm --workspace frontend run test
```

The tests cover two features:

- **Creating a book posting:** the posting is saved and then appears in the homepage listings; if it can't be saved, the Add screen shows an error and nothing is listed; an unknown genre is rejected before anything is saved.
- **Logging in and staying logged in:** logging in saves the token and the next session check sends it; a login response without a token is rejected and nothing is saved; logging out ends the session.

These tests were written after the features they cover, so they were not developed with TDD; the team's TDD feature area is the backend validation and middleware above.

No external service, environment variable, seed data, or test database is required: the tests don't connect to the real backend or Supabase, and each test creates its own sample genres, books, listings, and test user in the fake backend. Current limitations: because the backend is faked, these tests won't catch bugs in Express routes, Supabase queries, or database permissions; the root `npm test` (and so CI) doesn't run them yet; borrow requests aren't tested because the "Request to Borrow" button isn't connected to the backend. Future tests should run the real Express app against a separate Supabase test project and cover borrow requests once they're built.

## UI tests

Frontend UI tests use Jest with `jest-expo` and React Native Testing Library. They are in `packages/frontend/__tests__/ui.test.js`. They render real screens and check only what a user can see and do, such as text on screen, buttons, and search results, not component state.

Install dependencies from the project root, then run the tests (the same command runs the system tests):

```bash
npm install
npm --workspace frontend run test
```

The tests cover two user stories:

- **"As a user, I want to click on a book posting and see a detailed book posting view":** tapping a posting on the home page shows its title, author, condition, posted date, and "Request to Borrow" button; the back button returns to the home page.
- **"As a user, I want to search for an item and see results of books":** searching by title or author shows only matching books; a search with no matches shows "No Books Found"; clearing the search shows the starting prompt again.

These tests were written after the screens they cover, so they were not developed with TDD.

No external service, environment variable, seed data, or test database is required: the tests use the same fake backend as the system tests and replace the native modules that don't run under Jest (`expo-secure-store`, `expo-font`, and `expo-splash-screen`). Current limitations: the tests render components in Jest rather than on a phone or simulator, so real navigation and layout aren't covered; the home page genre filter isn't tested because the backend no longer returns a genre with each listing; searching by genre isn't supported yet. Future tests should add end-to-end tests on a device with a tool such as Maestro or Detox.
