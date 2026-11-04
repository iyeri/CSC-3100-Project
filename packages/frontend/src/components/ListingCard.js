import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { colors, radii, spacing } from "../theme";
import CoverPattern, { PATTERN_COUNT } from "./CoverPattern";

// Mirrors the "Fresh finds" grid cell from the Figma mock:
// a tall color-blocked cover with a heart in the top-right, title + meta below.
// Renamed from BookCard to avoid colliding with the profile BookCard.
export default function ListingCard({ listing }) {
  const [liked, setLiked] = useState(false);
  const { width } = useWindowDimensions();
  // 2-up grid: 20px horizontal screen padding + 16px gutter between cards.
  const cardWidth = (width - 20 * 2 - 16) / 2;

  // Pick one of 8 cover patterns. If the listing specifies one explicitly
  // use that; otherwise derive it from the id so it's stable across renders.
  const patternIndex =
    typeof listing.pattern === "number"
      ? listing.pattern
      : hashId(listing.id) % PATTERN_COUNT;

  return (
    <Pressable
      style={[styles.card, { width: cardWidth }]}
      onPress={() => {
        /* no-op — detail screen not wired up yet */
      }}
    >
      <View style={[styles.cover, { backgroundColor: listing.coverBg }]}>
        <CoverPattern index={patternIndex} color={listing.accent} />
        <Text style={styles.coverTitle} numberOfLines={3}>
          {listing.title}
        </Text>
        <Text style={styles.coverAuthor} numberOfLines={1}>
          {listing.author.toUpperCase()}
        </Text>

        <Pressable
          hitSlop={8}
          style={styles.heartBtn}
          onPress={() => setLiked((v) => !v)}
        >
          <Text style={[styles.heart, liked && styles.heartActive]}>
            {liked ? "♥" : "♡"}
          </Text>
        </Pressable>
      </View>

      <Text style={styles.title} numberOfLines={1}>
        {listing.title}
      </Text>
      <Text style={styles.meta} numberOfLines={1}>
        {listing.condition} · {listing.format}
      </Text>
    </Pressable>
  );
}

// Tiny deterministic hash so string ids map to a stable pattern index.
function hashId(id) {
  const str = String(id);
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.xl,
  },
  cover: {
    aspectRatio: 0.78,
    borderRadius: radii.lg,
    padding: spacing.md,
    overflow: "hidden",
    justifyContent: "flex-start",
  },
  coverTitle: {
    fontFamily: "serif",
    fontSize: 18,
    lineHeight: 22,
    color: colors.textPrimary,
    fontWeight: "500",
  },
  coverAuthor: {
    position: "absolute",
    bottom: spacing.md,
    left: spacing.md,
    right: spacing.md,
    fontSize: 10,
    letterSpacing: 1.2,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  heartBtn: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  heart: {
    fontSize: 16,
    color: colors.heartIdle,
    marginTop: -2,
  },
  heartActive: {
    color: "#B5533B",
  },
  title: {
    marginTop: spacing.sm,
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  meta: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textMuted,
  },
});
