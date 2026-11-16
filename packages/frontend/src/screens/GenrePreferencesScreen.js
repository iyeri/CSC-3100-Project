import { useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors, fonts, radii, spacing } from "../theme";

// Shown once after signup so new users can seed their recommendations.
// For now onComplete just forwards the picks to App.js; wire this to
// Supabase (e.g. upsert into a user_preferences table) when auth lands.

const GENRES = [
  "Drama",
  "Romance",
  "Fantasy",
  "Mystery",
  "Thriller",
  "Horror",
  "Science fiction",
  "Historical fiction",
  "Western",
  "Comedy",
];

const MAX_SELECTIONS = 3;
// Minimum genres a user must pick before Continue enables. Flip to
// MAX_SELECTIONS if the real rule turns out to be "exactly 3".
const MIN_SELECTIONS = 1;

export default function GenrePreferencesScreen({ onComplete }) {
  const [selected, setSelected] = useState([]);

  const toggle = (genre) => {
    setSelected((prev) => {
      if (prev.includes(genre)) {
        return prev.filter((g) => g !== genre);
      }
      if (prev.length >= MAX_SELECTIONS) {
        return prev;
      }
      return [...prev, genre];
    });
  };

  const canContinue = selected.length >= MIN_SELECTIONS;

  const rows = useMemo(() => {
    const paired = [];
    for (let i = 0; i < GENRES.length; i += 2) {
      paired.push([GENRES[i], GENRES[i + 1]]);
    }
    return paired;
  }, []);

  const helperText = canContinue
    ? null
    : MIN_SELECTIONS === MAX_SELECTIONS
      ? `Select ${MAX_SELECTIONS} genres to continue.`
      : `Select at least ${MIN_SELECTIONS} genre${
          MIN_SELECTIONS === 1 ? "" : "s"
        } to continue.`;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.brand}>OurLibrary</Text>

        <Text style={styles.heading}>
          Pick up to three of your favorite genres
        </Text>

        <View style={styles.grid}>
          {rows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((genre) => {
                if (!genre) return <View key="spacer" style={styles.chip} />;
                const isSelected = selected.includes(genre);
                const atCap =
                  !isSelected && selected.length >= MAX_SELECTIONS;
                return (
                  <Pressable
                    key={genre}
                    onPress={() => toggle(genre)}
                    disabled={atCap}
                    style={({ pressed }) => [
                      styles.chip,
                      isSelected && styles.chipSelected,
                      atCap && styles.chipDisabled,
                      pressed && !atCap && styles.chipPressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        isSelected && styles.chipTextSelected,
                      ]}
                    >
                      {genre}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>

        <Text style={styles.counter}>
          {selected.length} of {MAX_SELECTIONS} selected
        </Text>

        <Pressable
          disabled={!canContinue}
          onPress={() => onComplete?.(selected)}
          style={({ pressed }) => [
            styles.cta,
            !canContinue && styles.ctaDisabled,
            pressed && canContinue && styles.ctaPressed,
          ]}
        >
          <Text
            style={[styles.ctaText, !canContinue && styles.ctaTextDisabled]}
          >
            Continue
          </Text>
        </Pressable>

        {helperText ? <Text style={styles.helper}>{helperText}</Text> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.offWhite },
  scroll: {
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: spacing.xxl,
  },
  brand: {
    fontFamily: fonts.serifBold,
    fontSize: 26,
    color: colors.darkGreen,
    marginBottom: spacing.xl,
  },
  heading: {
    fontFamily: fonts.serifBold,
    fontSize: 24,
    lineHeight: 30,
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  grid: {
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  chip: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: radii.pill,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  chipSelected: {
    backgroundColor: colors.darkGreen,
    borderColor: colors.darkGreen,
  },
  chipPressed: {
    opacity: 0.85,
  },
  chipDisabled: {
    opacity: 0.5,
  },
  chipText: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.darkGreen,
  },
  chipTextSelected: {
    color: colors.white,
  },
  counter: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  cta: {
    backgroundColor: colors.darkGreen,
    borderRadius: radii.lg,
    paddingVertical: 16,
    alignItems: "center",
  },
  ctaDisabled: {
    backgroundColor: colors.divider,
  },
  ctaPressed: {
    opacity: 0.85,
  },
  ctaText: {
    fontFamily: fonts.sansBold,
    fontSize: 16,
    color: colors.white,
  },
  ctaTextDisabled: {
    color: colors.textMuted,
  },
  helper: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.md,
  },
});
