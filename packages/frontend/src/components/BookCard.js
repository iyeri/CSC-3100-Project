import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../theme";

export function BookCard({ book, width, onToggleCurrentRead }) {
  const isAvailable = book.status === "AVAILABLE";
  const isReading = Boolean(book.isCurrentRead);

  return (
    <Pressable
      accessibilityHint={`View ${book.title} by ${book.author}`}
      accessibilityRole="button"
      style={({ pressed }) => [styles.card, { width }, pressed && styles.pressed]}
    >
      <View style={[styles.cover, { backgroundColor: book.cover }]}>
        <View style={styles.coverTop}>
          <View style={[styles.coverRule, { backgroundColor: book.accent }]} />
          {onToggleCurrentRead ? (
            <Pressable
              accessibilityLabel={`Currently reading ${book.title}`}
              accessibilityRole="switch"
              accessibilityState={{ checked: isReading }}
              hitSlop={8}
              onPress={onToggleCurrentRead}
              style={({ pressed }) => [
                styles.readingToggle,
                isReading && styles.readingToggleOn,
                pressed && styles.togglePressed,
              ]}
            >
              <Text style={[styles.readingToggleText]}>
                {isReading ? "✓ READING" : "+ READING"}
              </Text>
            </Pressable>
          ) : null}
        </View>
        <Text style={[styles.coverMark, { color: book.accent }]}>{book.mark}</Text>
        <View style={styles.coverType}>
          <Text style={[styles.coverTitle, { color: book.accent }]} numberOfLines={3}>
            {book.title}
          </Text>
          <Text style={[styles.coverAuthor, { color: book.accent }]} numberOfLines={1}>
            {book.author}
          </Text>
        </View>
      </View>

      <View style={styles.cardCopy}>
        <Text style={styles.title} numberOfLines={1}>
          {book.title}
        </Text>
        <Text style={styles.author} numberOfLines={1}>
          {book.author}
        </Text>
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, !isAvailable && styles.statusDotMuted]} />
          <Text style={[styles.status, !isAvailable && styles.statusMuted]}>{book.status}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 24,
  },
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.985 }],
  },
  cover: {
    aspectRatio: 0.78,
    borderRadius: 4,
    padding: 14,
    overflow: "hidden",
    justifyContent: "space-between",
  },
  coverTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    // Keep the toggle above the decorative cover letter.
    zIndex: 1,
  },
  coverRule: {
    height: 5,
    width: 42,
  },
  readingToggle: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.ink,
    backgroundColor: colors.paper,
    paddingHorizontal: 7,
    paddingVertical: 4,
    marginTop: -6,
    marginRight: -6,
  },
  readingToggleOn: {
    backgroundColor: colors.acid,
  },
  togglePressed: {
    opacity: 0.6,
  },
  readingToggleText: {
    color: colors.ink,
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.6,
  },
  coverMark: {
    position: "absolute",
    right: -10,
    top: 18,
    fontSize: 96,
    lineHeight: 104,
    fontWeight: "900",
    opacity: 0.16,
  },
  coverType: {
    gap: 5,
  },
  coverTitle: {
    maxWidth: "90%",
    fontSize: 18,
    lineHeight: 19,
    fontWeight: "900",
    letterSpacing: -0.7,
    textTransform: "uppercase",
  },
  coverAuthor: {
    fontSize: 9,
    lineHeight: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  cardCopy: {
    paddingTop: 10,
  },
  title: {
    color: colors.ink,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "800",
  },
  author: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.forest,
  },
  statusDotMuted: {
    backgroundColor: colors.softMuted,
  },
  status: {
    color: colors.forest,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.8,
  },
  statusMuted: {
    color: colors.softMuted,
  },
});
