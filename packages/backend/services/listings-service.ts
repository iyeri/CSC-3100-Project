// listings-service.ts
import { supabase } from "./client.ts";

/* getListings()
 *
 * Input:
 * listing_id, book_id, availability, condition, lender, date (these can be undefined)
 *
 * Returns:
 * An array of listing(s) within the database that match the given parameter(s).
 *
 * On error, returns undefined.
 */
async function getListings(
  listing_id,
  book_id,
  availability,
  condition,
  lender,
  date,
) {
  let query = supabase.from("listings").select("*, books(*)");

  if (listing_id !== undefined) {
    query.eq("listing_id", listing_id);
  }
  if (book_id !== undefined) {
    query.eq("book_id", book_id);
  }
  if (availability !== undefined) {
    query.eq("availability", availability);
  }
  if (condition !== undefined) {
    query.eq("condition", condition);
  }
  if (lender !== undefined) {
    query.eq("lender", lender);
  }
  if (date !== undefined) {
    query.gte("date_posted", date);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    return;
  }

  return data;
}

/* addListing()
 *
 * Input:
 * JSON data, representing a new listing.
 *
 * Output:
 * An array with the new listing (created by database).
 * If listing already exists PostgreSQL error code 23505, return an empty array.
 *
 * Errors return undefined.
 */
async function addListing(listingData) {
  const { data, error } = await supabase
    .from("listings")
    .insert(listingData)
    .select();

  if (error) {
    if (error.code === "23505") {
      // Listing already exists; I don't see why this should ever happen, unless UUIDs collide.
      return [];
    }

    console.error(error);
    return;
  }

  return data;
}

/* deleteListing()
 *
 * Input:
 * listing_id
 *
 * Output:
 * Array containing the deleted listing.
 * If listing does not exist returns empty array.
 *
 * On error, returns undefined.
 */
async function deleteListing(listing_id) {
  const { data, error } = await supabase
    .from("listings")
    .delete()
    .eq("listing_id", listing_id)
    .select();

  if (error) {
    console.error(error);
    return;
  }

  return data;
}

/* updateListing()
 *
 * Input:
 * JSON data, representing updated listing.
 *
 * Output:
 * An array containing the updated listing.
 */
async function updateListing(listing_id, listingData) {
  const { data, error } = await supabase
    .from("listings")
    .update(listingData)
    .eq("listing_id", listing_id)
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
  getListings,
  addListing,
  deleteListing,
  updateListing,
};
