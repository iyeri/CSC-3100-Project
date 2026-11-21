import { useMemo, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";

import { GENRES } from "../data/genres";

// Shown once after signup so new users can seed their recommendations.
// For now onComplete just forwards the picks to App.js; wire this to
// Supabase (e.g. upsert into a user_preferences table) when auth lands.
// The genre list is shared with the home page filter chips via ../data/genres.

const MAX_SELECTIONS = 3;
// Minimum genres a user must pick before Continue enables. Flip to
// MAX_SELECTIONS if the real rule turns out to be "exactly 3".
const MIN_SELECTIONS = 1;

const CHIP_CLASS =
  "flex-1 border rounded-pill py-14 items-center justify-center";

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
    <SafeAreaView className="flex-1 bg-off-white">
      <ScrollView contentContainerClassName="px-28 pt-32 pb-xxl">
        <Text className="font-serif-bold text-26 text-dark-green mb-xl">
          OurLibrary
        </Text>

        <Text className="font-serif-bold text-24 leading-30 text-text-primary text-center mb-xl px-md">
          Pick up to three of your favorite genres
        </Text>

        <View className="mb-lg">
          {rows.map((row, rowIndex) => (
            <View
              key={rowIndex}
              className="flex-row justify-between mb-md gap-md"
            >
              {row.map((genre) => {
                if (!genre)
                  return (
                    <View
                      key="spacer"
                      className={`${CHIP_CLASS} bg-white border-divider`}
                    />
                  );
                const isSelected = selected.includes(genre);
                const atCap = !isSelected && selected.length >= MAX_SELECTIONS;
                return (
                  <Pressable
                    key={genre}
                    onPress={() => toggle(genre)}
                    disabled={atCap}
                    className={`${CHIP_CLASS} ${
                      isSelected
                        ? "bg-dark-green border-dark-green"
                        : "bg-white border-divider"
                    } ${atCap ? "opacity-50" : "active:opacity-85"}`}
                  >
                    <Text
                      className={`font-sans-medium text-14 ${
                        isSelected ? "text-white" : "text-dark-green"
                      }`}
                    >
                      {genre}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>

        <Text className="font-sans text-13 text-text-muted text-center mt-md mb-md">
          {selected.length} of {MAX_SELECTIONS} selected
        </Text>

        <Pressable
          disabled={!canContinue}
          onPress={() => onComplete?.(selected)}
          className={`rounded-lg py-16 items-center ${
            canContinue ? "bg-dark-green active:opacity-85" : "bg-divider"
          }`}
        >
          <Text
            className={`font-sans-bold text-16 ${
              canContinue ? "text-white" : "text-text-muted"
            }`}
          >
            Continue
          </Text>
        </Pressable>

        {helperText ? (
          <Text className="font-sans text-12 text-text-muted text-center mt-md">
            {helperText}
          </Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
