import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import CoverPattern, { PATTERN_COUNT } from "../components/CoverPattern";
import { colors, fonts, radii, spacing } from "../theme";

// Listing detail screen — mirrors screen "02 · LISTING DETAIL" in the
// OurLibrary Figma mock. Reached by tapping a card on ListingsScreen.
//
// Props:
//   - listing: a row from mockListings (title, author, genre, condition,
//     format, tokens, postedAt, postedBy, cover, accent).
//   - onBack: called when the user taps the back chevron.
//
// All actions are stubbed: the mail button pops an Alert with the poster's
// email and the "Request to Borrow" CTA pops a confirmation. Wire these to
// Supabase (loans insert, mailto: deep link) once the backend lands.
export default function ListingDetailScreen({ listing, onBack }) {
  if (!listing) return null;

  const patternIndex =
    typeof listing.pattern === "number"
      ? listing.pattern
      : hashId(listing.id) % PATTERN_COUNT;

  const tokensLabel = `${listing.tokens} ${listing.tokens === 1 ? "Token" : "Tokens"}`;

  const handleMail = () => {
    Alert.alert(listing.postedBy.name, listing.postedBy.email);
  };

  const handleRequest = () => {
    // TODO(loans): replace with a Supabase insert into the loans table and
    // a confirmation toast / navigation to the loans tab.
    Alert.alert(
      "Borrow request sent",
      `Asked ${listing.postedBy.name} to borrow "${listing.title}" for ${tokensLabel}.`,
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero: back + avatar + large cover on a muted sage field. */}
        <View style={styles.hero}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={onBack}
            style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
            hitSlop={8}
          >
            <Text style={styles.iconBtnGlyph}>‹</Text>
          </Pressable>

          <View style={styles.avatarTopRight}>
            <Text style={styles.avatarTopRightText}>11</Text>
          </View>

          <View
            style={[
              styles.cover,
              { backgroundColor: listing.cover ?? listing.coverBg },
            ]}
          >
            <CoverPattern index={patternIndex} color={listing.accent} />
            <Text
              style={[styles.coverTitle, { color: listing.accent }]}
              numberOfLines={3}
            >
              {listing.title}
            </Text>
            <Text
              style={[styles.coverAuthor, { color: listing.accent }]}
              numberOfLines={1}
            >
              {listing.author.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Body: meta + tags + poster row. */}
        <View style={styles.body}>
          <Text style={styles.genre}>{listing.genre.toUpperCase()}</Text>

          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={2}>
              {listing.title}
            </Text>
            <Text style={styles.tokens}>{tokensLabel}</Text>
          </View>

          <Text style={styles.author}>{listing.author}</Text>

          <View style={styles.tagRow}>
            <Tag label={listing.condition} />
            <Tag label={listing.format} />
          </View>

          <Text style={styles.postedAt}>
            Posted {formatDate(listing.postedAt)}
          </Text>

          <View style={styles.divider} />

          <View style={styles.posterRow}>
            <View
              style={[
                styles.posterAvatar,
                { backgroundColor: listing.postedBy.avatarBg },
              ]}
            >
              <Text style={styles.posterInitial}>
                {listing.postedBy.initial}
              </Text>
            </View>
            <Text style={styles.posterName}>{listing.postedBy.name}</Text>
            <Text style={styles.posterChevron}>›</Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky bottom bar: mail + Request to Borrow. */}
      <View style={styles.bottomBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Email ${listing.postedBy.name}`}
          onPress={handleMail}
          style={({ pressed }) => [styles.mailBtn, pressed && styles.pressed]}
        >
          <Text style={styles.mailGlyph}>✉</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Request to borrow for ${tokensLabel}`}
          onPress={handleRequest}
          style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
        >
          <Text style={styles.ctaText}>Request to Borrow ({tokensLabel})</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function Tag({ label }) {
  return (
    <View style={styles.tag}>
      <Text style={styles.tagLabel}>{label}</Text>
    </View>
  );
}

// Deterministic hash to pick a stable cover pattern for a listing.
function hashId(id) {
  const str = String(id);
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

// "2026-10-28" -> "Oct 28, 2026"
function formatDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

const HERO_HEIGHT = 420;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scroll: {
    paddingBottom: spacing.xxl,
  },

  // --- Hero ---
  hero: {
    height: HERO_HEIGHT,
    backgroundColor: colors.oliveGreen,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  iconBtn: {
    position: "absolute",
    top: spacing.lg,
    left: 20,
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  iconBtnGlyph: {
    fontFamily: fonts.sansBold,
    fontSize: 20,
    color: colors.textPrimary,
    lineHeight: 22,
    marginTop: -2,
  },
  avatarTopRight: {
    position: "absolute",
    top: spacing.lg,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: colors.darkGreen,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  avatarTopRightText: {
    fontFamily: fonts.sansBold,
    fontSize: 12,
    color: colors.white,
  },
  cover: {
    width: 220,
    aspectRatio: 0.72,
    borderRadius: radii.md,
    padding: spacing.lg,
    overflow: "hidden",
    justifyContent: "flex-start",
    // Soft drop shadow to match the mock.
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  coverTitle: {
    fontFamily: fonts.serifBold,
    fontSize: 26,
    lineHeight: 30,
    color: colors.textPrimary,
  },
  coverAuthor: {
    position: "absolute",
    bottom: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
    fontFamily: fonts.sansBold,
    fontSize: 10,
    letterSpacing: 1.6,
    color: colors.textPrimary,
    textAlign: "center",
  },

  // --- Body ---
  body: {
    paddingHorizontal: 24,
    paddingTop: spacing.xl,
  },
  genre: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    letterSpacing: 1.6,
    color: colors.darkGreen,
    marginBottom: spacing.md,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  title: {
    flex: 1,
    fontFamily: fonts.serifBold,
    fontSize: 28,
    lineHeight: 32,
    color: colors.textPrimary,
  },
  tokens: {
    fontFamily: fonts.serifBold,
    fontSize: 20,
    color: colors.darkGreen,
    marginTop: 4,
  },
  author: {
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  tagRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  tag: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    backgroundColor: colors.chipBg,
  },
  tagLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.textPrimary,
  },
  postedAt: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.lg,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.xl,
  },
  posterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  posterAvatar: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  posterInitial: {
    fontFamily: fonts.serifBold,
    fontSize: 16,
    color: colors.white,
  },
  posterName: {
    flex: 1,
    fontFamily: fonts.sansBold,
    fontSize: 15,
    color: colors.textPrimary,
  },
  posterChevron: {
    fontFamily: fonts.sans,
    fontSize: 22,
    color: colors.textMuted,
  },

  // --- Bottom bar ---
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: 20,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    backgroundColor: colors.white,
  },
  mailBtn: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  mailGlyph: {
    fontSize: 20,
    color: colors.textPrimary,
  },
  cta: {
    flex: 1,
    height: 48,
    borderRadius: radii.pill,
    backgroundColor: colors.darkGreen,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaPressed: {
    opacity: 0.85,
  },
  ctaText: {
    fontFamily: fonts.sansBold,
    fontSize: 15,
    color: colors.white,
  },
  pressed: {
    opacity: 0.6,
  },
});
