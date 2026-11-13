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
} from "react-native";

import { BookCard } from "../components/BookCard";
import { BottomNav } from "../components/BottomNav";
import { CurrentReadCard } from "../components/CurrentReadCard";
import { ReviewCard } from "../components/ReviewCard";
import { books as initialBooks, profile, reviews } from "../data/profile";
import { colors } from "../theme";

const PAGE_PADDING = 18;
const GRID_GAP = 12;
const MAX_CONTENT_WIDTH = 560;

function HeaderButton({ accessibilityLabel, children }) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      hitSlop={10}
      style={({ pressed }) => [styles.headerButton, pressed && styles.pressed]}
    >
      <Text style={styles.headerButtonText}>{children}</Text>
    </Pressable>
  );
}

export function ProfileScreen() {
  const [activeTab, setActiveTab] = useState("library");
  const [books, setBooks] = useState(initialBooks);
  const currentReads = useMemo(
    () => books.filter((book) => book.isCurrentRead),
    [books],
  );

  // Local-only for now; swap for an API call once the backend supports it.
  const toggleCurrentRead = (bookId) => {
    setBooks((prev) =>
      prev.map((book) =>
        book.id === bookId
          ? { ...book, isCurrentRead: !book.isCurrentRead }
          : book,
      ),
    );
  };
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(width, MAX_CONTENT_WIDTH);
  const bookWidth = useMemo(
    () => (contentWidth - PAGE_PADDING * 2 - GRID_GAP) / 2,
    [contentWidth],
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
              <Text style={styles.wordmark}>OurLibrary</Text>
              <View style={styles.headerActions}>
                <HeaderButton accessibilityLabel="Share profile">
                  ↗
                </HeaderButton>
                <HeaderButton accessibilityLabel="Profile settings">
                  •••
                </HeaderButton>
              </View>
            </View>

            <View style={styles.profileHeader}>
              <View style={styles.avatarWrap}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarInitials}>{profile.initials}</Text>
                </View>
                <View style={styles.onlineDot} />
              </View>

              <Text style={styles.name}>{profile.name}</Text>
              <Text style={styles.handle}>{profile.handle}</Text>
              <View style={styles.communityPill}>
                <Text style={styles.pin}>◆</Text>
                <Text style={styles.community}>{profile.community}</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              {profile.stats.map((stat, index) => (
                <View
                  key={stat.label}
                  style={[
                    styles.stat,
                    index < profile.stats.length - 1 && styles.statDivider,
                  ]}
                >
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.bio}>{profile.bio}</Text>

            <View style={styles.interests}>
              {profile.interests.map((interest) => (
                <View key={interest} style={styles.interestPill}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>

            <View style={styles.actions}>
              <Pressable
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.primaryAction,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.primaryActionText}>EDIT PROFILE</Text>
              </Pressable>
              <Pressable
                accessibilityLabel="Share profile"
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.secondaryAction,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.secondaryActionText}>↗</Text>
              </Pressable>
            </View>

            {/* <View style={styles.callout}>
              <View style={styles.calloutIcon}>
                <Text style={styles.calloutIconText}>↺</Text>
              </View>
              <View style={styles.calloutCopy}>
                <Text style={styles.calloutEyebrow}>COMMUNITY READER</Text>
                <Text style={styles.calloutText}>12 successful local handoffs</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </View> */}

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>CURRENTLY READING</Text>
                <Text style={styles.sectionCount}>{currentReads.length}</Text>
              </View>
              {currentReads.length > 0 ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.currentReadList}
                >
                  {currentReads.map((book) => (
                    <CurrentReadCard
                      book={book}
                      key={book.id}
                      onRemove={() => toggleCurrentRead(book.id)}
                    />
                  ))}
                </ScrollView>
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>
                    Nothing on the nightstand. Tap “+ READING” on a book in your
                    library to add it here.
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.tabs}>
              <Pressable
                accessibilityRole="tab"
                accessibilityState={{ selected: activeTab === "library" }}
                onPress={() => setActiveTab("library")}
                style={[
                  styles.tab,
                  activeTab === "library" && styles.activeTab,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "library" && styles.activeTabText,
                  ]}
                >
                  LIBRARY · {books.length}
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="tab"
                accessibilityState={{ selected: activeTab === "reviews" }}
                onPress={() => setActiveTab("reviews")}
                style={[
                  styles.tab,
                  activeTab === "reviews" && styles.activeTab,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "reviews" && styles.activeTabText,
                  ]}
                >
                  REVIEWS · {reviews.length}
                </Text>
              </Pressable>
            </View>

            {activeTab === "library" ? (
              <View style={styles.grid}>
                {books.map((book) => (
                  <BookCard
                    book={book}
                    key={book.id}
                    onToggleCurrentRead={() => toggleCurrentRead(book.id)}
                    width={bookWidth}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.reviewList}>
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.offWhite,
    paddingTop: Platform.OS === "android" ? NativeStatusBar.currentHeight : 0,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.offWhite,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  content: {
    width: "100%",
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: "center",
    backgroundColor: colors.offWhite,
    paddingHorizontal: PAGE_PADDING,
  },
  topBar: {
    height: 62,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  wordmark: {
    color: colors.darkGreen,
    fontFamily: "serif",
    fontSize: 19,
    fontWeight: "600",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  headerButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    lineHeight: 19,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.58,
  },
  profileHeader: {
    alignItems: "center",
    paddingTop: 30,
  },
  avatarWrap: {
    position: "relative",
  },
  avatar: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: colors.sageGreen,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    color: colors.textPrimary,
    fontFamily: "serif",
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "600",
    letterSpacing: -0.6,
  },
  onlineDot: {
    position: "absolute",
    right: 2,
    bottom: 8,
    width: 19,
    height: 19,
    borderRadius: 10,
    backgroundColor: colors.darkGreen,
    borderWidth: 3,
    borderColor: colors.offWhite,
  },
  name: {
    color: colors.textPrimary,
    fontFamily: "serif",
    fontSize: 29,
    lineHeight: 35,
    fontWeight: "600",
    letterSpacing: -0.4,
    marginTop: 15,
  },
  handle: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 2,
  },
  communityPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
  },
  pin: {
    color: colors.darkGreen,
    fontSize: 9,
  },
  community: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "500",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "stretch",
    marginTop: 24,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  stat: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  statDivider: {
    borderRightWidth: 1,
    borderRightColor: colors.divider,
  },
  statValue: {
    color: colors.textPrimary,
    fontFamily: "serif",
    fontSize: 19,
    fontWeight: "600",
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
    fontWeight: "500",
  },
  bio: {
    color: colors.textPrimary,
    fontFamily: "serif",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    paddingHorizontal: 10,
    marginTop: 20,
  },
  interests: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 7,
    marginTop: 15,
  },
  interestPill: {
    backgroundColor: colors.chipBg,
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  interestText: {
    color: colors.textPrimary,
    fontSize: 10,
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    gap: 9,
    marginTop: 22,
  },
  primaryAction: {
    flex: 1,
    height: 47,
    backgroundColor: colors.darkGreen,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryActionText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  secondaryAction: {
    width: 50,
    height: 47,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 999,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryActionText: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "600",
  },
  callout: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.acid,
    marginTop: 18,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  calloutIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  calloutIconText: {
    color: colors.acid,
    fontSize: 18,
    fontWeight: "900",
  },
  calloutCopy: {
    flex: 1,
    marginLeft: 11,
  },
  calloutEyebrow: {
    color: colors.ink,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.9,
  },
  calloutText: {
    color: colors.ink,
    fontSize: 12,
    marginTop: 2,
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
    color: colors.textPrimary,
    fontFamily: "serif",
    fontSize: 20,
    fontWeight: "600",
  },
  sectionCount: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "500",
  },
  currentReadList: {
    gap: 10,
  },
  emptyState: {
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 18,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
  emptyText: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
  tabs: {
    flexDirection: "row",
    marginTop: 30,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 999,
    backgroundColor: colors.chipBg,
  },
  activeTab: {
    backgroundColor: colors.darkGreen,
  },
  tabText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.4,
  },
  activeTabText: {
    color: colors.white,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingTop: 18,
  },
  reviewList: {
    paddingBottom: 18,
  },
});
