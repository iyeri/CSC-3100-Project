// books-service.ts
import { supabase } from "./client.ts";

/* getBooks()
 *
 * Input:
 * isbn, title, author, genre (these can be undefined)
 *
 * Returns:
 * An array of books(s) within the database that match the given parameter(s).
 *
 * NOTE: How does the user specify which parameter to search by?
 * Maybe a more general search function should be implemented that searches across all
 * attributes, given a single input.
 *
 * On error, returns undefined.
 */
async function getBooks(book_id, title, author, genre) {
  let query = supabase.from("books").select();

  if (book_id !== undefined) {
    query.eq("book_id", book_id);
  }
  if (title !== undefined) {
    query.eq("title", title);
  }
  if (author !== undefined) {
    query.eq("author", author);
  }
  if (genre !== undefined) {
    query.eq("genre", genre);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    return;
  }

  return data;
}

/* addBook()
 *
 * Input:
 * JSON data, representing a new book.
 *
 * Output:
 * An array with the new book (created by database).
 * If book already exists PostgreSQL error code 23505, return an empty array.
 *
 * Errors return undefined.
 */
async function addBook(bookData) {
  const { data, error } = await supabase
    .from("books")
    .insert(bookData)
    .select();

  if (error) {
    if (error.code === "23505") {
      // ISBN already exists.
      return [];
    }

    console.error(error);
    return;
  }

  return data;
}

/* deleteBook()
 *
 * Input:
 * isbn
 *
 * Output:
 * Array containing the deleted book.
 * If book does not exist returns empty array.
 *
 * On error, returns undefined.
 */
async function deleteBook(book_id) {
  const { data, error } = await supabase
    .from("books")
    .delete()
    .eq("book_id", book_id)
    .select();

  if (error) {
    console.error(error);
    return;
  }

  return data;
}

/* updateBook()
 *
 * Input:
 * JSON data, representing updated book.
 *
 * Output:
 * An array containing the updated book.
 */
async function updateBook(book_id, bookData) {
  const { data, error } = await supabase
    .from("books")
    .update(bookData)
    .eq("book_id", book_id)
    .select();

  if (error) {
    console.error(error);
    return;
  }

  return data;
}

/* Export functions as default object.
 * Import within another .js file without curly braces:
 *   import someName from "path-to-this-file/supabase.ts"
 * Access functions with dot notation:
 *   someName.someFunction()
 */
export default {
  getBooks,
  addBook,
  deleteBook,
  updateBook,
};
