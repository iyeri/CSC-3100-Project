# Database Schema

## Database Type

- SQL database

## Book

| Field         | Key/Constraint | Data Type |
| ------------- | -------------- | --------- |
| `isbn`        | Primary key    | `text`    |
| `title`       |                | `text`    |
| `author`      |                | `text`    |
| `genre`       |                | `text`    |
| `description` |                | `text`    |

## Book Listing

| Field                   | Key/Constraint                                | Data Type   |
| ----------------------- | --------------------------------------------- | ----------- |
| `listing_id`            | Primary key                                   | `uuid`      |
| `isbn`                  | Foreign key referencing `Book.isbn`           | `text`      |
| `availability`          | Available, lent, current read, or unavailable | `text`      |
| `condition_description` |                                               | `text`      |
| `book_lender`           | Foreign key referencing `UserProfile.user_id` | `uuid`      |
| `date_posted`           |                                               | `timestamp` |

## Book Loan

| Field           | Key/Constraint                                   | Data Type   |
| --------------- | ------------------------------------------------ | ----------- |
| `loan_id`       | Primary key                                      | `uuid`      |
| `isbn`          | Foreign key referencing `Book.isbn`              | `text`      |
| `listing_id`    | Foreign key referencing `BookListing.listing_id` | `uuid`      |
| `book_lender`   | Foreign key referencing `UserProfile.user_id`    | `uuid`      |
| `book_borrower` | Foreign key referencing `UserProfile.user_id`    | `uuid`      |
| `date_lended`   |                                                  | `timestamp` |
| `due_date`      |                                                  | `timestamp` |
| `is_overdue`    |                                                  | `boolean`   |

## User Profile

| Field            | Key/Constraint                | Data Type   |
| ---------------- | ----------------------------- | ----------- |
| `user_id`        | Primary key                   | `uuid`      |
| `username`       | Unique                        | `text`      |
| `student_name`   |                               | `text`      |
| `calpoly_email`  | Unique                        | `text`      |
| `bio`            |                               | `text`      |
| `pfp_url`        |                               | `text`      |
| `credit_balance` |                               | `integer`   |
| `housing_status` | On campus or off campus       | `text`      |
| `date_joined`    |                               | `timestamp` |
| `account_status` | Active, suspended, or deleted | `text`      |
