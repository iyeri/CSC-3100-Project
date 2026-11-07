import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

import { colors, radii, spacing } from "../theme";

export default function CategoryChips({ categories }) {
  const [active, setActive] = useState(categories[0]?.id);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.row}
    >
      {categories.map((cat) => {
        const isActive = cat.id === active;
        return (
          <Pressable
            key={cat.id}
            onPress={() => setActive(cat.id)}
            style={[styles.chip, isActive && styles.chipActive]}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {cat.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Pin the row to its content height so the parent flex column can't squish
  // or stretch it — that was clipping the chips vertically.
  scroll: {
    flexGrow: 0,
    flexShrink: 0,
  },
  row: {
    paddingHorizontal: 20,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    alignItems: "center",
  },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: radii.pill,
    backgroundColor: colors.chipBg,
  },
  chipActive: {
    backgroundColor: colors.chipActive,
  },
  label: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: "500",
  },
  labelActive: {
    color: colors.white,
  },
});
