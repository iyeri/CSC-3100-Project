// genres-service.ts
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert, TablesUpdate } from "./types.ts";

/* getGenres()
 *
 * Input:
 * None.
 *
 * Output:
 * An array of genres from the genre table.
 *
 * On error, returns undefined.
 */
async function getGenres(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase.from("genres").select();

  if (error) {
    console.error(error);
    return;
  }

  return data;
}

/* addGenre()
 *
 * Input:
 * JSON data, representing a new genre.
 *
 * Output:
 * An array containing the newly added genre.
 *
 * On error, returns undefined.
 */
async function addGenre(
  supabase: SupabaseClient<Database>,
  genreData: TablesInsert<"genres">,
) {
  const { data, error } = await supabase
    .from("genres")
    .insert(genreData)
    .select();

  if (error) {
    console.error(error);
    return;
  }

  return data;
}

/* deleteGenre()
 *
 * Input:
 * genre_id
 *
 * Output:
 * An array containing the deleted genre.
 *
 * On error, returns undefined.
 */
async function deleteGenre(
  supabase: SupabaseClient<Database>,
  genre_id: Tables<"genres">["genre_id"],
) {
  const { data, error } = await supabase
    .from("genres")
    .delete()
    .eq("genre_id", genre_id)
    .select();

  if (error) {
    console.error(error);
    return;
  }

  return data;
}

export default {
  getGenres,
  addGenre,
  deleteGenre,
};
