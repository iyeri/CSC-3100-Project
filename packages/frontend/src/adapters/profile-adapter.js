// profile-adapter.js
export function toProfileModel(userData, books, reviews) {
  if (!userData) {
    return null;
  }

  const ratings = reviews.map((review) => review.rating);

  const averageRating =
    ratings.length > 0
      ? (
          ratings.reduce((sum, rating) => sum + rating.score, 0) /
          ratings.length
        ).toFixed(2)
      : "N/A";

  return {
    name: userData.name?.trim() || userData.username,
    handle: `@${userData.username}`,
    initials: userData.name
      ? userData.name
          .split(" ")
          .map((n) => n[0])
          .join("")
      : userData.username.slice(0, 2).toUpperCase(),
    community: userData.on_campus === true ? "On Campus" : "Off Campus",
    bio: userData.bio || "No bio available.",
    interests: [],
    stats: [
      { label: "books", value: String(books.length) },
      { label: "reviews", value: String(reviews.length) },
      { label: "rating", value: averageRating },
    ],
  };
}
