// user-services.ts
import { supabase } from "./client.ts";

/* getUsers()
 *
 * Input:
 * uid, username, name (these can be undefined)
 *
 * Returns:
 * An array of user(s) within the database that match the given parameter.
 * Only one defined parameter is searched with priority:
 *   uid > username > name
 * This can change... but when are all three going to be queried at the same time?
 *
 * On error, returns undefined.
 */
async function getUsers(uid, username, name) {
  if (uid !== undefined) {
    var { data, error } = await supabase.from("users").select().eq("uid", uid);
  } else if (username !== undefined) {
    var { data, error } = await supabase
      .from("users")
      .select()
      .eq("username", username);
  } else if (name !== undefined) {
    var { data, error } = await supabase
      .from("users")
      .select()
      .eq("name", name); // Maybe this should be .ilike()?
  } else {
    var { data, error } = await supabase.from("users").select();
  }

  if (error) {
    console.error(error);
    return;
  }

  return data;
}

/* addUser()
 *
 * Input:
 * JSON data, representing a new user.
 *
 * Output:
 * An array with the new user (created by database).
 * If user already exists PostgreSQL error code 23505, return an empty array.
 *
 * Errors return undefined.
 */
async function addUser(userData) {
  const { data, error } = await supabase
    .from("users")
    .insert(userData)
    .select();

  if (error) {
    if (error.code === "23505") {
      // User already exists.
      return [];
    }

    console.error(error);
    return;
  }

  return data;
}

/* deleteUser()
 *
 * Input:
 * uid
 *
 * Output:
 * Array containing the deleted user.
 * If user does not exist returns empty array.
 *
 * On error, returns undefined.
 */
async function deleteUser(uid) {
  const { data, error } = await supabase
    .from("users")
    .delete()
    .eq("uid", uid)
    .select();

  if (error) {
    console.error(error);
    return;
  }

  return data;
}

/* updateUser()
 *
 * Input:
 * JSON data, representing updated user.
 *
 * Output:
 * An array containing the updated user.
 */
async function updateUser(uid, userData) {
  const { data, error } = await supabase
    .from("users")
    .update(userData)
    .eq("uid", uid)
    .select();

  if (error) {
    if (error.code === "23505") {
      // Username or Cal Poly email already exists.
      return [];
    }

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
  getUsers,
  addUser,
  deleteUser,
  updateUser,
};
