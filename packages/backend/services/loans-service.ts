// loans-service.ts
import { supabase } from "./client.ts";

/* getLoans()
 *
 * Input:
 * loan_id, listing_id, lender, borrower, date_lended, due_date, is_overdue (these can be undefined)
 *
 * Returns:
 * An array of loan(s) within the database that match the given parameter(s).
 *
 * On error, returns undefined.
 */
async function getLoans(
  loan_id,
  listing_id,
  lender,
  borrower,
  date_lended,
  due_date,
  is_overdue,
) {
  let query = supabase.from("loans").select("*, listings(*, books(*))");

  if (loan_id !== undefined) {
    query.eq("loan_id", loan_id);
  }
  if (listing_id !== undefined) {
    query.eq("listing_id", listing_id);
  }
  if (lender !== undefined) {
    query.eq("lender", lender);
  }
  if (borrower !== undefined) {
    query.eq("borrower", borrower);
  }
  if (date_lended !== undefined) {
    query.gte("date_lended", date_lended);
  }
  if (due_date !== undefined) {
    query.lte("due_date", due_date);
  }
  if (is_overdue !== undefined) {
    query.eq("is_overdue", is_overdue);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    return;
  }

  return data;
}

/* addLoan()
 *
 * Input:
 * JSON data, representing a new loan.
 *
 * Output:
 * An array with the new loan (created by database).
 * If loan already exists PostgreSQL error code 23505, return an empty array.
 *
 * Errors return undefined.
 */
async function addLoan(loanData) {
  const { data, error } = await supabase
    .from("loans")
    .insert(loanData)
    .select();

  if (error) {
    if (error.code === "23505") {
      // Loan already exists; I don't see why this should ever happen, unless UUIDs collide.
      return [];
    }

    console.error(error);
    return;
  }

  return data;
}

/* deleteLoan()
 *
 * Input:
 * loan_id
 *
 * Output:
 * Array containing the deleted loan.
 * If loan does not exist returns empty array.
 *
 * On error, returns undefined.
 */
async function deleteLoan(loan_id) {
  const { data, error } = await supabase
    .from("loans")
    .delete()
    .eq("loan_id", loan_id)
    .select();

  if (error) {
    console.error(error);
    return;
  }

  return data;
}

/* updateLoan()
 *
 * Input:
 * JSON data, representing updated loan.
 *
 * Output:
 * An array containing the updated loan.
 */
async function updateLoan(loan_id, loanData) {
  const { data, error } = await supabase
    .from("loans")
    .update(loanData)
    .eq("loan_id", loan_id)
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
  getLoans,
  addLoan,
  deleteLoan,
  updateLoan,
};
