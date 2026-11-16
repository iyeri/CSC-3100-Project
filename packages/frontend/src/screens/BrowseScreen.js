import { useMemo, useState, useEffect } from "react";
import {
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar as NativeStatusBar,
  Text,
  useWindowDimensions,
  View,
  TextInput,
} from "react-native";

import { BookCard } from "../components/BookCard";
import { BottomNav } from "../components/BottomNav";
import { mockListings } from "../data/mockListings";
import { getListings } from "../services/listings-client";
import { toBookCardModel } from "../adapters/listing-adapter";
import { colors } from "../theme";

// Used to compute card widths. Keep in sync with px-18 / gap-y-12 /
// max-w-[560px] in the classNames below.
const PAGE_PADDING = 18;
const GRID_GAP = 12;
const MAX_CONTENT_WIDTH = 560;

const androidStatusBarPadding = {
  paddingTop: Platform.OS === "android" ? NativeStatusBar.currentHeight : 0,
};

export function BrowseScreen() {
  const { width } = useWindowDimensions();
  const [query, setQuery] = useState("");
  const contentWidth = Math.min(width, MAX_CONTENT_WIDTH);
  const bookWidth = useMemo(
    () => (contentWidth - PAGE_PADDING * 2 - GRID_GAP) / 2,
    [contentWidth],
  );

  const [listings, setListings] = useState([]);

  useEffect(() => {
    async function fetchListings() {
      try {
        const data = await getListings();
        setListings(data.map(toBookCardModel));
      } catch (error) {
        console.error("Failed to load listings:", error);
      }
    }

    fetchListings();
  }, []);

  const filteredBooks = listings.filter((book) =>
    `${book.title} ${book.author}`
      .toLowerCase()
      .includes(query.toLowerCase().trim()),
  );
  return (
    <SafeAreaView className="flex-1 bg-paper" style={androidStatusBarPadding}>
      <View className="flex-1 bg-canvas">
        <ScrollView
          contentContainerClassName="pb-16"
          showsVerticalScrollIndicator={false}
        >
          <View className="w-full max-w-[560px] self-center bg-paper px-18">
            <View className="h-62 flex-row items-center justify-between border-b border-line">
              <Text className="text-ink text-16 font-black tracking-[-0.6px]">
                OUR/LIBRARY
              </Text>
              <Text>Find Your Next Read</Text>
            </View>
            <View className="pt-28 pb-22">
              <Text className="text-ink text-28 leading-34 font-black tracking-[-0.8px]">
                FIND YOUR NEXT READ HERE!
              </Text>
              <Text className="text-muted">
                Search for Books, Authors, and Genres
              </Text>
            </View>
            <View className="min-h-48 flex-row items-center bg-canvas px-12 gap-10">
              <Text className="text-ink text-24">⌕</Text>
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search by title/author/genre"
                placeholderTextColor={colors.muted}
                className="flex-1 min-w-0 text-ink text-13 py-12"
                returnKeyType="search"
              />

              {query.length > 0 && (
                <Pressable
                  onPress={() => setQuery("")}
                  accessibilityRole="button"
                  accessibilityLabel="Clear"
                >
                  <Text className="text-ink text-22 font-semibold px-4">X</Text>
                </Pressable>
              )}
            </View>
            <View className="flex-row items-center justify-between mb-12">
              <Text className="text-ink text-11 font-black tracking-[0.8px]">
                {query.trim() ? "SEARCH RESULTS" : "START YOUR SEARCH"}
              </Text>
              {query.trim() !== "" && <Text>{filteredBooks.length} FOUND</Text>}
            </View>

            {!query.trim() ? (
              <View className="border border-dashed border-soft-muted px-14 py-16">
                <Text className="text-muted text-12 leading-18 text-center">
                  Enter a book title, author, or genre to search out library
                </Text>
              </View>
            ) : filteredBooks.length > 0 ? (
              <View className="flex-row flex-wrap justify-between pt-18 gap-y-12">
                {filteredBooks.map((book) => (
                  <BookCard book={book} key={book.book_id} width={bookWidth} />
                ))}
              </View>
            ) : (
              <View className="border border-dashed border-soft-muted px-14 py-16">
                <Text className="text-muted text-12 leading-18 text-center">
                  No Books Found
                </Text>
                <Text className="text-muted text-12 leading-18 text-center">
                  Try a differnt title or author!
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
