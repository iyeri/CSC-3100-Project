import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../theme";

// Compact horizontal card used in the "Currently reading" section.
export function CurrentReadCard({ book, onRemove }) {
  return (
    <View style={styles.card}>
      <View style={[styles.cover, { backgroundColor: book.cover }]}>
        <View style={[styles.coverRule, { backgroundColor: book.accent }]} />
        <Text style={[styles.coverMark, { color: book.accent }]}>{book.mark}</Text>
      </View>

      <View style={styles.copy}>
        <Text style={styles.eyebrow}>NOW READING</Text>
        <Text style={styles.title} numberOfLines={2}>
          {book.title}
        </Text>
        <Text style={styles.author} numberOfLines={1}>
          {book.author}
        </Text>
      </View>

      <Pressable
        accessibilityLabel={`Remove ${book.title} from currently reading`}
        accessibilityRole="button"
        hitSlop={10}
        onPress={onRemove}
        style={({ pressed }) => [styles.remove, pressed && styles.pressed]}
      >
        <Text style={styles.removeText}>✕</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 248,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.ink,
    padding: 10,
    backgroundColor: colors.paper,
  },
  cover: {
    width: 52,
    aspectRatio: 0.78,
    borderRadius: 3,
    padding: 6,
    overflow: "hidden",
  },
  coverRule: {
    height: 3,
    width: 18,
  },
  coverMark: {
    position: "absolute",
    right: -4,
    bottom: -8,
    fontSize: 46,
    lineHeight: 52,
    fontWeight: "900",
    opacity: 0.25,
  },
  copy: {
    flex: 1,
    marginLeft: 12,
  },
  eyebrow: {
    color: colors.forest,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.8,
  },
  title: {
    color: colors.ink,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "800",
    marginTop: 3,
  },
  author: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 1,
  },
  remove: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
    alignSelf: "flex-start",
  },
  removeText: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "900",
  },
  pressed: {
    opacity: 0.58,
  },
});
