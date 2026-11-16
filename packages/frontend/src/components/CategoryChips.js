import { useState } from "react";
import { Pressable, ScrollView, Text } from "react-native";

export default function CategoryChips({ categories }) {
  const [active, setActive] = useState(categories[0]?.id);

  return (
    // Pin the row to its content height (grow-0 shrink-0) so the parent flex
    // column can't squish or stretch it — that was clipping the chips
    // vertically.
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="grow-0 shrink-0"
      contentContainerClassName="px-20 py-sm gap-sm items-center"
    >
      {categories.map((cat) => {
        const isActive = cat.id === active;
        return (
          <Pressable
            key={cat.id}
            onPress={() => setActive(cat.id)}
            className={`px-lg py-10 rounded-pill ${
              isActive ? "bg-chip-active" : "bg-chip-bg"
            }`}
          >
            <Text
              className={`text-13 font-medium ${
                isActive ? "text-white" : "text-text-primary"
              }`}
            >
              {cat.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
