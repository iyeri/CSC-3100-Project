import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import CategoryChips from "../components/CategoryChips";
import { BookCard } from "../components/BookCard";
import TopBar from "../components/TopBar";
import { fetchListings } from "../api/listings";
import { LISTING_GENRES } from "../data/genres";
import { colors } from "../theme";

// Discover / home listings screen — matches screen 01 ("Discover") from the
// OurLibrary Figma mock. Rendered as the "Home" tab from App.js; the shared
// BottomNav is rendered by App, so this screen does not render its own.
//
// Postings come from GET /listings on the backend. Tapping a genre chip
// filters the grid to that genre; "For you" shows every posting.

// Keep in sync with px-20 on the list and the 2-up grid gutter.
const PAGE_PADDING = 20;
const GRID_GAP = 16;

const ALL = "__all__";
const CHIPS = [
  { id: ALL, label: "For you" },
  ...LISTING_GENRES.map((genre) => ({ id: genre, label: genre })),
];

// DB genres are free text, so compare without case or surrounding spaces.
const sameGenre = (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase();

export default function ListingsScreen({ onOpenListing }) {
  const { width } = useWindowDimensions();
  const bookWidth = (width - PAGE_PADDING * 2 - GRID_GAP) / 2;

  const [listings, setListings] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [errorMessage, setErrorMessage] = useState("");
  const [genre, setGenre] = useState(ALL);
  // Incrementing this re-runs the fetch (used by the Retry button).
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");

    fetchListings()
      .then((data) => {
        if (cancelled) return;
        setListings(data);
        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        setErrorMessage(err.message);
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const visible = useMemo(
    () =>
      genre === ALL
        ? listings
        : listings.filter((listing) => sameGenre(listing.genre, genre)),
    [listings, genre],
  );

  return (
    <SafeAreaView className="flex-1 bg-off-white">
      <View className="flex-1">
        <TopBar />
        <CategoryChips
          categories={CHIPS}
          activeId={genre}
          onChange={setGenre}
        />

        {status === "loading" ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color={colors.darkGreen} />
          </View>
        ) : status === "error" ? (
          <View className="flex-1 items-center justify-center px-32 gap-sm">
            <Text className="font-serif-bold text-18 text-text-primary">
              Couldn't load listings
            </Text>
            <Text className="font-sans text-13 text-text-muted text-center">
              {errorMessage || "Check that the backend is running."}
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => setAttempt((n) => n + 1)}
              className="mt-md px-xl py-10 rounded-pill bg-dark-green active:opacity-85"
            >
              <Text className="font-sans-bold text-14 text-white">Retry</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={visible}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <BookCard
                book={item}
                width={bookWidth}
                onPress={() => onOpenListing?.(item)}
              />
            )}
            numColumns={2}
            columnWrapperClassName="justify-between"
            contentContainerClassName="px-20 pt-md pb-xl"
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View className="flex-row items-baseline justify-between mb-md">
                <Text className="font-serif text-22 text-text-primary">
                  {genre === ALL ? "Fresh finds" : genre}
                </Text>
                <Text className="text-12 text-text-muted">Reserve today</Text>
              </View>
            }
            ListEmptyComponent={
              <View className="items-center pt-40 gap-sm">
                <Text className="font-serif-bold text-18 text-text-primary">
                  No listings yet
                </Text>
                <Text className="font-sans text-13 text-text-muted text-center">
                  {genre === ALL
                    ? "Check back once someone posts a book."
                    : `Nobody has posted a ${genre.toLowerCase()} book yet.`}
                </Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}
