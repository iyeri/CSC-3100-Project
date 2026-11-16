// reviews-service.ts
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert, TablesUpdate } from "./types.ts";

async function getReviews(
  supabase: SupabaseClient<Database>,
  review_id?: Tables<"reviews">["review_id"],
  loan_id?: Tables<"reviews">["loan_id"],
  reviewer_id?: Tables<"reviews">["reviewer_id"],
  reviewee_id?: Tables<"reviews">["reviewee_id"],
  rating?: NonNullable<Tables<"reviews">["rating"]>,
) {
  let query = supabase.from("reviews").select();

  if (review_id !== undefined) {
    query = query.eq("review_id", review_id);
  }
  if (loan_id !== undefined) {
    query = query.eq("loan_id", loan_id);
  }
  if (reviewer_id !== undefined) {
    query = query.eq("reviewer_id", reviewer_id);
  }
  if (reviewee_id !== undefined) {
    query = query.eq("reviewee_id", reviewee_id);
  }
  if (rating !== undefined) {
    query = query.eq("rating", rating);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    return;
  }

  return data;
}

async function addReview(
  supabase: SupabaseClient<Database>,
  reviewData: TablesInsert<"reviews">,
) {
  const { data, error } = await supabase
    .from("reviews")
    .insert(reviewData)
    .select();

  if (error) {
    console.error(error);
    return;
  }

  return data;
}

async function updateReview(
  supabase: SupabaseClient<Database>,
  review_id: Tables<"reviews">["review_id"],
  reviewData: TablesUpdate<"reviews">,
) {
  const { data, error } = await supabase
    .from("reviews")
    .update(reviewData)
    .eq("review_id", review_id)
    .select();

  if (error) {
    console.error(error);
    return;
  }

  return data;
}

async function deleteReview(
  supabase: SupabaseClient<Database>,
  review_id: Tables<"reviews">["review_id"],
) {
  const { data, error } = await supabase
    .from("reviews")
    .delete()
    .eq("review_id", review_id)
    .select();

  if (error) {
    console.error(error);
    return;
  }

  return data;
}

export default {
  getReviews,
  addReview,
  updateReview,
  deleteReview,
};
