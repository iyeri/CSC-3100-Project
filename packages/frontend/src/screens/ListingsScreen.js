import {
  FlatList,
  SafeAreaView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { useEffect, useState } from "react";
import CategoryChips from "../components/CategoryChips";
import { BookCard } from "../components/BookCard";
import TopBar from "../components/TopBar";
//import { categories, mockListings } from "../data/mockListings";
import { getGenres, getListings } from "../services/listings-client";
import { toBookCardModel } from "../adapters/listing-adapter";

// Discover / home listings screen — matches screen 01 ("Discover") from the
// OurLibrary Figma mock. Rendered as the "Home" tab from App.js; the shared
// BottomNav is rendered by App, so this screen does not render its own.
// Keep in sync with px-20 on the list and the 2-up grid gutter.
const PAGE_PADDING = 20;
const GRID_GAP = 16;

export default function ListingsScreen({ onOpenListing }) {
  const { width } = useWindowDimensions();
  const bookWidth = (width - PAGE_PADDING * 2 - GRID_GAP) / 2;

  const [categories, setCategories] = useState([]);
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setError(null);

        const [genreData, listingData] = await Promise.all([
          getGenres(),
          getListings(),
        ]);

        if (!cancelled) {
          setCategories(genreData);
          setListings(listingData.map(toBookCardModel));
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load listings:", error);
          setError(error.message || "Unable to load listings.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-off-white">
      <View className="flex-1">
        <TopBar />
        <CategoryChips categories={categories} />

        <FlatList
          data={listings}
          keyExtractor={(item) => item.listing_id}
          renderItem={({ item }) => (
            <BookCard
              book={item}
              width={bookWidth}
              onPress={() => onOpenListing?.(item.listing_id)}
            />
          )}
          numColumns={2}
          columnWrapperClassName="justify-between"
          contentContainerClassName="px-20 pt-md pb-xl"
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View className="flex-row items-baseline justify-between mb-md">
              <Text className="font-serif text-22 text-text-primary">
                Fresh finds
              </Text>
              <Text className="text-12 text-text-muted">Reserve today</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}
