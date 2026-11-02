# Backend API
## Home Endpoint - /
Not yet implemented.

## Users - /users
*See userKeys in backend.js for JSON keys.*

### To access user data.
GET **[JSON data]** **[backend host]**/users
> May pass uid, username, or name, provided as JSON data.
> Returns JSON data of matched user(s), or all users if no data is passed.

POST **[JSON data]** **[backend host]**/users
> Requires username and Cal Poly email, provided as JSON data.
> Cannot define uid (this is handled by the database).
> Returns new JSON data of created user.

REMOVE **[backend host]**/users/**[uid]**
> Requires uid, provided in path.
> Returns JSON data of the deleted user.

PATCH **[JSON data]** **[backend host]**/users/**[uid]**
> Requires uid, provided in path.
> May pass any user key (to update those specific keys), provided as JSON data.
> Cannot change uid.

### To access loan data associated with a certain user.
GET **[JSON data]** **[backend host]**/users/**[uid]**/loans?=**[role]**
> Requires uid and role, provided in path; role can be 'lender' or 'borrower'.
> Returns JSON data of the loans associated with a user, given a role.

## Listings - /listings
*See listingKeys in backend.js for JSON keys.*

### To access listing data.
GET **[JSON data]** **[backend host]**/listings
> May pass any listing key, provided as JSON data.
> Returns JSON data of matched listing(s), or all listings if no data is provided.

POST **[JSON data]** **[backend host]**/listings
> Requires book_id and lender, provided as JSON data.
> Cannot define listing_id (this is handled by the database).
> Returns JSON data of the new listing.

REMOVE **[backend host]**/listings/**[listing_id]**
> Requires listing_id, provided in path.
> Returns JSON data of the deleted listing.

PATCH **[JSON data]** **[backend host]**/listings/**[listing_id]**
> Requires listing_id, provided in path.
> May pass any listing key (to update those specific keys), provided as JSON data.
> Returns JSON data of the updated listing.

## Loans - /loans
*See loanKeys in backend.js for JSON keys.*

### To access loan data.
GET **[JSON data]** **[backend host]**/loans
> May pass any loan key, provided as JSON data.
> Returns JSON data of matched loan(s), or all loans if no data is provided.

POST **[JSON data]** **[backend host]**/loans
> Requires listing_id, lender, and borrower, provided as JSON data.
> Cannot define loan_id (this is handled by the database).
> Returns JSON data of the new loan.

REMOVE **[backend host]**/loans/**[loan_id]**
> Requires loan_id, provided in path.
> Returns JSON data of the deleted loan.

PATCH **[JSON data]** **[backend host]**/loans/**[loan_id]**
> Requires loan_id, provided in path.
> May pass any loan key (to update those specific keys), provided as JSON data.
> Returns JSON data of the updated loan.

## Books - /books
*See bookKeys in backend.js for JSON keys.*
This is not the intended way to access book data from the frontend.
Book data is automatically appended to loans and listings, and filtering should be done there.
However, I still need to implement this...

### To access book data.
GET **[JSON data]** **[backend host]**/books
> May pass any book key, provided as JSON data.
> Returns JSON data of matched book(s), or all books if no data is provided.

POST **[JSON data]** **[backend host]**/books
> Does not require any data (this may be a bug...).
> Returns JSON data of the new book.

REMOVE **[backend host]**/books/**[book_id]**
> Requires book_id, provided in path.
> Returns JSON data of the deleted book.

PATCH **[JSON data]** **[backend host]**/books/**[book_id]**
> Requires book_id, provided in path.
> May pass any book key (to update those specific keys), provided as JSON data.
> Returns JSON data of the updated book.