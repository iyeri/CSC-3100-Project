import { useState } from "react";
import { Pressable, Text, View, useWindowDimensions } from "react-native";

import CoverPattern, { PATTERN_COUNT } from "./CoverPattern";

// Mirrors the "Fresh finds" grid cell from the Figma mock:
// a tall color-blocked cover with a heart in the top-right, title + meta below.
// Renamed from BookCard to avoid colliding with the profile BookCard.
export default function ListingCard({ listing, onPress }) {
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
      accessibilityRole="button"
      accessibilityLabel={`${listing.title} by ${listing.author}`}
      className="mb-xl"
      style={{ width: cardWidth }}
      onPress={() => onPress?.(listing.id)}
    >
      <View
        className="aspect-[0.78] rounded-lg p-md overflow-hidden justify-start"
        style={{ backgroundColor: listing.cover ?? listing.coverBg }}
      >
        <CoverPattern index={patternIndex} color={listing.accent} />
        <Text
          className="font-serif-regular text-18 leading-22 text-text-primary"
          numberOfLines={3}
        >
          {listing.title}
        </Text>
        <Text
          className="absolute bottom-md left-md right-md text-10 tracking-[1.2px] text-text-primary font-semibold"
          numberOfLines={1}
        >
          {listing.author.toUpperCase()}
        </Text>

        <Pressable
          hitSlop={8}
          className="absolute top-sm right-sm w-28 h-28 rounded-full bg-white items-center justify-center"
          onPress={() => setLiked((v) => !v)}
        >
          <Text
            className={`text-16 -mt-2 ${
              liked ? "text-heart-active" : "text-heart-idle"
            }`}
          >
            {liked ? "♥" : "♡"}
          </Text>
        </Pressable>
      </View>

      <Text
        className="mt-sm text-15 font-semibold text-text-primary"
        numberOfLines={1}
      >
        {listing.title}
      </Text>
      <Text className="mt-2 text-12 text-text-muted" numberOfLines={1}>
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
