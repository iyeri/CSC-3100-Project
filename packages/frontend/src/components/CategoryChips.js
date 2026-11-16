import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

import { colors, radii, spacing } from "../theme";

// Horizontal chips row for filtering listings by genre.
//
// Works in two modes:
//   - Controlled: pass `activeId` and `onChange(id)`. The parent owns the
//     active state (used by ListingsScreen to filter the grid).
//   - Uncontrolled: omit both; the component tracks its own active chip
//     (legacy behavior for screens that just want the visual).
export default function CategoryChips({
  categories,
  activeId,
  onChange,
}) {
  const [internalActive, setInternalActive] = useState(categories[0]?.id);
  const isControlled = activeId !== undefined;
  const active = isControlled ? activeId : internalActive;

  const handlePress = (id) => {
    if (!isControlled) setInternalActive(id);
    onChange?.(id);
  };

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
            onPress={() => handlePress(cat.id)}
            accessibilityRole="button"
            accessibilityLabel={`Filter by ${cat.label}`}
            accessibilityState={{ selected: isActive }}
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
