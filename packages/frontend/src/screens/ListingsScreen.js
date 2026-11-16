import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import CategoryChips from "../components/CategoryChips";
import ListingCard from "../components/ListingCard";
import TopBar from "../components/TopBar";
import { fetchListings } from "../api/listings";
import { colors, fonts, spacing } from "../theme";

// Sentinel id for the "all genres" chip. Kept out of band from real genre
// strings so there's no chance of collision.
const ALL_ID = "__all__";

// Discover / home listings screen — pulls listings from the backend
// (packages/backend, Express on port 8000) which joins book metadata so a
// single call gives us title, author, genre, etc.
//
// Clicking a genre chip filters the grid client-side. The listings endpoint
// doesn't accept a genre query param today, so filtering stays on the
// client — fine for the current dataset size.
export default function ListingsScreen({ onOpenListing }) {
  const [listings, setListings] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [error, setError] = useState(null);
  const [activeGenre, setActiveGenre] = useState(ALL_ID);
  // Bumping this forces the fetch effect to re-run (pull-to-retry).
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setError(null);

    fetchListings()
      .then((data) => {
        if (cancelled) return;
        setListings(data);
        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err);
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  // Build the chip list from the genres that actually appear in the data,
  // sorted alphabetically with "For you" pinned at the front as the
  // "no filter" chip.
  const chips = useMemo(() => {
    const unique = new Set();
    for (const listing of listings) {
      if (listing.genre) unique.add(listing.genre);
    }
    const genreChips = Array.from(unique)
      .sort((a, b) => a.localeCompare(b))
      .map((g) => ({ id: g, label: g }));
    return [{ id: ALL_ID, label: "For you" }, ...genreChips];
  }, [listings]);

  const visibleListings = useMemo(() => {
    if (activeGenre === ALL_ID) return listings;
    return listings.filter((l) => l.genre === activeGenre);
  }, [listings, activeGenre]);

  const activeLabel =
    activeGenre === ALL_ID
      ? "Fresh finds"
      : activeGenre;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <TopBar />
        <CategoryChips
          categories={chips}
          activeId={activeGenre}
          onChange={setActiveGenre}
        />

        {status === "loading" ? (
          <View style={styles.center}>
            <ActivityIndicator color={colors.darkGreen} />
          </View>
        ) : status === "error" ? (
          <View style={styles.center}>
            <Text style={styles.errorTitle}>Couldn't load listings</Text>
            <Text style={styles.errorBody}>
              {error?.message ?? "Please try again."}
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => setReloadKey((k) => k + 1)}
              style={({ pressed }) => [styles.retry, pressed && styles.retryPressed]}
            >
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        ) : visibleListings.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.emptyTitle}>No listings yet</Text>
            <Text style={styles.emptyBody}>
              {activeGenre === ALL_ID
                ? "Check back once someone posts a book."
                : `No books in "${activeLabel}" right now.`}
            </Text>
          </View>
        ) : (
          <FlatList
            data={visibleListings}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ListingCard listing={item} onPress={() => onOpenListing?.(item)} />
            )}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{activeLabel}</Text>
                <Text style={styles.sectionLink}>Reserve today</Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.offWhite,
  },
  container: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  row: {
    justifyContent: "space-between",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontFamily: fonts.serif,
    fontSize: 22,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  sectionLink: {
    fontSize: 12,
    color: colors.textMuted,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: spacing.sm,
  },
  errorTitle: {
    fontFamily: fonts.serifBold,
    fontSize: 18,
    color: colors.textPrimary,
  },
  errorBody: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: "center",
  },
  retry: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm + 2,
    borderRadius: 999,
    backgroundColor: colors.darkGreen,
  },
  retryPressed: {
    opacity: 0.85,
  },
  retryText: {
    fontFamily: fonts.sansBold,
    color: colors.white,
    fontSize: 14,
  },
  emptyTitle: {
    fontFamily: fonts.serifBold,
    fontSize: 18,
    color: colors.textPrimary,
  },
  emptyBody: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: "center",
  },
});
