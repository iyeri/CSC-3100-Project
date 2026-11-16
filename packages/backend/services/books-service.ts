// books-service.ts
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert, TablesUpdate } from "./types.ts";

/* getBooks()
 *
 * Input:
 * book_id, title, author, genre (these can be undefined)
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
async function getBooks(
  supabase: SupabaseClient<Database>,
  book_id?: Tables<"books">["book_id"],
  title?: NonNullable<Tables<"books">["title"]>,
  author?: NonNullable<Tables<"books">["author"]>,
) {
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
async function addBook(
  supabase: SupabaseClient<Database>,
  bookData: TablesInsert<"books">,
) {
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
async function deleteBook(
  supabase: SupabaseClient<Database>,
  book_id: Tables<"books">["book_id"],
) {
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
async function updateBook(
  supabase: SupabaseClient<Database>,
  book_id: Tables<"books">["book_id"],
  bookData: TablesUpdate<"books">,
) {
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

/* getBookGenres()
 *
 * Input:
 * book_id
 *
 * Output:
 * An array of genres ('genre_id' and 'genre' name) associated with the given book_id.
 *
 * On error, returns undefined.
 */
async function getBookGenres(
  supabase: SupabaseClient<Database>,
  book_id: Tables<"books">["book_id"],
) {
  const { data, error } = await supabase
    .from("book_genres")
    .select("book_id, genres(genre_id, genre)")
    .eq("book_id", book_id);

  if (error) {
    console.error(error);
    return;
  }

  return data;
}

/* addBookGenres()
 *
 * Input:
 * book_id, genre_ids (array of genre_id)
 *
 * Output:
 * An array of the newly created book_genres entries.
 *
 * On error, returns undefined.
 */
async function addBookGenres(
  supabase: SupabaseClient<Database>,
  book_id: Tables<"books">["book_id"],
  genre_ids: Array<Tables<"genres">["genre_id"]>,
) {
  const { data, error } = await supabase
    .from("book_genres")
    .insert(genre_ids.map((genre_id) => ({ book_id, genre_id })))
    .select();

  if (error) {
    console.error(error);
    return;
  }

  return data;
}

/* deleteBookGenres()
 *
 * Input:
 * book_id, genre_ids (array of genre_id)
 *
 * Output:
 * An array of the deleted book_genres entries.
 *
 * On error, returns undefined.
 */
async function deleteBookGenres(
  supabase: SupabaseClient<Database>,
  book_id: Tables<"books">["book_id"],
  genre_ids: Array<Tables<"genres">["genre_id"]>,
) {
  const { data, error } = await supabase
    .from("book_genres")
    .delete()
    .eq("book_id", book_id)
    .in("genre_id", genre_ids)
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
  getBookGenres,
  addBookGenres,
  deleteBookGenres
};
