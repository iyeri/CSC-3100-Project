import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";

import CategoryChips from "../components/CategoryChips";
import ListingCard from "../components/ListingCard";
import TopBar from "../components/TopBar";
import { categories, mockListings } from "../data/mockListings";
import { colors, spacing } from "../theme";

// Discover / home listings screen — matches screen 01 ("Discover") from the
// OurLibrary Figma mock. Rendered as the "Home" tab from App.js; the shared
// BottomNav is rendered by App, so this screen does not render its own.
export default function ListingsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <TopBar />
        <CategoryChips categories={categories} />

        <FlatList
          data={mockListings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ListingCard listing={item} />}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Fresh finds</Text>
              <Text style={styles.sectionLink}>Reserve today</Text>
            </View>
          }
        />
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
    fontFamily: "serif",
    fontSize: 22,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  sectionLink: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
