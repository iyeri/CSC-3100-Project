import { useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar as NativeStatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  TextInput,
} from "react-native";

import { BookCard } from "../components/BookCard";
import { BottomNav } from "../components/BottomNav";
import { books as initialBooks } from "../data/profile";
import { colors } from "../theme";

const PAGE_PADDING = 18;
const GRID_GAP = 12;
const MAX_CONTENT_WIDTH = 560;

export function BrowseScreen() {
  const { width } = useWindowDimensions();
  const [query, setQuery] = useState("");
  const contentWidth = Math.min(width, MAX_CONTENT_WIDTH);
  const bookWidth = useMemo(
    () => (contentWidth - PAGE_PADDING * 2 - GRID_GAP) / 2,
    [contentWidth],
  );

  const filteredBooks = initialBooks.filter((book) =>
    `${book.title} ${book.author}`
      .toLowerCase()
      .includes(query.toLowerCase().trim()),
  );
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.topBar}>
              <Text style={styles.wordmark}>OUR/LIBRARY</Text>
              <Text style={styles.calloutEyebrow}>Find Your Next Read</Text>
            </View>
            <View style={styles.intro}>
              <Text style={styles.heading}>FIND YOUR NEXT READ HERE!</Text>
              <Text style={styles.sub}>
                Search for Books, Authors, and Genres
              </Text>
            </View>
            <View style={styles.searchbar}>
              <Text style={styles.searchIcon}>⌕</Text>
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search by title/author/genre"
                placeholderTextColor={colors.muted}
                style={styles.searchInput}
                returnKeyType="search"
              />

              {query.length > 0 && (
                <Pressable
                  onPress={() => setQuery("")}
                  accessibilityRole="button"
                  accessibilityLabel="Clear"
                >
                  <Text style={styles.clear}>X</Text>
                </Pressable>
              )}
            </View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {query.trim() ? "SEARCH RESULTS" : "START YOUR SEARCH"}
              </Text>
              {query.trim() !== "" && (
                <Text style={styles.sectionCOunt}>
                  {filteredBooks.length} FOUND
                </Text>
              )}
            </View>

            {!query.trim() ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>
                  Enter a book title, author, or genere to search out library
                </Text>
              </View>
            ) : filteredBooks.length > 0 ? (
              <View style={styles.grid}>
                {filteredBooks.map((book) => (
                  <BookCard book={book} key={book.id} width={bookWidth} />
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No Books Found</Text>
                <Text style={styles.emptyText}>
                  Try a differnt title or author!
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
        <BottomNav />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.paper,
    paddingTop: Platform.OS === "android" ? NativeStatusBar.currentHeight : 0,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  content: {
    width: "100%",
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: "center",
    backgroundColor: colors.paper,
    paddingHorizontal: PAGE_PADDING,
  },
  topBar: {
    height: 62,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  wordmark: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: -0.6,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pressed: {
    opacity: 0.58,
  },

  actions: {
    flexDirection: "row",
    gap: 9,
    marginTop: 22,
  },

  callout: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.acid,
    marginTop: 18,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },

  chevron: {
    color: colors.ink,
    fontSize: 26,
    fontWeight: "400",
  },
  section: {
    marginTop: 26,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.8,
  },

  emptyState: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.softMuted,
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
  emptyText: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingTop: 18,
    rowGap: GRID_GAP,
  },
  intro: {
    paddingTop: 28,
    paddingBottom: 22,
  },
  heading: {
    color: colors.ink,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "900",
    letterSpacing: -0.8,
  },
  sub: {
    color: colors.muted,
  },
  searchbar: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.canvas,
    paddingHorizontal: 12,
    gap: 10,
  },
  searchIcon: {
    color: colors.ink,
    fontSize: 24,
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    color: colors.ink,
    fontSize: 13,
    paddingVertical: 12,
  },
  clear: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: "600",
    paddingHorizontal: 4,
  },
});
