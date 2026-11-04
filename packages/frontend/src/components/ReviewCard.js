import { StyleSheet, Text, View } from "react-native";

import { colors } from "../theme";

export function ReviewCard({ review }) {
  return (
    <View style={styles.card}>
      <View style={styles.heading}>
        <View style={styles.avatar}>
          <Text style={styles.initials}>{review.initials}</Text>
        </View>
        <View style={styles.identity}>
          <Text style={styles.name}>{review.borrower}</Text>
          <Text style={styles.date}>{review.date}</Text>
        </View>
        <View style={styles.rating}>
          <Text style={styles.star}>★</Text>
          <Text style={styles.ratingText}>{review.rating}</Text>
        </View>
      </View>
      <Text style={styles.body}>{review.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    paddingVertical: 20,
  },
  heading: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.lavender,
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: "900",
  },
  identity: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: "800",
  },
  date: {
    color: colors.softMuted,
    fontSize: 11,
    marginTop: 2,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  star: {
    color: colors.coral,
    fontSize: 14,
  },
  ratingText: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: "900",
  },
  body: {
    color: colors.ink,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 14,
  },
});
