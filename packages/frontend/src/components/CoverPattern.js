import { View } from "react-native";

// Eight interchangeable cover decorations used by BookCard. The idea is to
// keep the "color-blocked abstract" vibe of the Figma mock but avoid every
// cover looking identical. Pick a pattern by index — anything past 7 wraps.
//
// Each pattern is drawn with plain <View>s (no SVG) so we don't pull in a new
// dependency, and every pattern renders inside the cover's padding box.
export const PATTERN_COUNT = 8;

export default function CoverPattern({ index = 0, color }) {
  const pattern = ((index % PATTERN_COUNT) + PATTERN_COUNT) % PATTERN_COUNT;

  switch (pattern) {
    case 0:
      return <Circle color={color} />;
    case 1:
      return <HorizontalStripes color={color} />;
    case 2:
      return <VerticalStripes color={color} />;
    case 3:
      return <DiagonalStripe color={color} />;
    case 4:
      return <DotGrid color={color} />;
    case 5:
      return <HalfArch color={color} />;
    case 6:
      return <NestedSquares color={color} />;
    case 7:
      return <Triangle color={color} />;
    default:
      return null;
  }
}

// 0 — big soft circle anchored bottom-left (the original look).
function Circle({ color }) {
  return (
    <View
      pointerEvents="none"
      className="absolute w-[70%] aspect-square rounded-full -bottom-20 left-[15%] opacity-[0.55]"
      style={{ backgroundColor: color }}
    />
  );
}

// 1 — three thick horizontal bars across the bottom.
function HorizontalStripes({ color }) {
  return (
    <View
      pointerEvents="none"
      className="absolute left-0 right-0 bottom-0 h-[45%] justify-end gap-6 pb-10"
    >
      {[0, 1, 2].map((i) => (
        <View
          key={i}
          className="h-10 mx-14 rounded-2"
          style={{ backgroundColor: color, opacity: 0.35 + i * 0.2 }}
        />
      ))}
    </View>
  );
}

// 2 — three vertical bars down the right side.
function VerticalStripes({ color }) {
  return (
    <View
      pointerEvents="none"
      className="absolute top-0 bottom-0 right-0 w-[45%] flex-row justify-end items-stretch gap-6 pr-14 py-14"
    >
      {[0, 1, 2].map((i) => (
        <View
          key={i}
          className="w-10 rounded-2"
          style={{ backgroundColor: color, opacity: 0.35 + i * 0.2 }}
        />
      ))}
    </View>
  );
}

// 3 — single wide bar rotated into a diagonal slash.
function DiagonalStripe({ color }) {
  return (
    <View
      pointerEvents="none"
      className="absolute w-[160%] h-28 bottom-[30%] -left-[30%] -rotate-[28deg] opacity-60 rounded-4"
      style={{ backgroundColor: color }}
    />
  );
}

// 4 — 3x3 grid of small dots.
function DotGrid({ color }) {
  return (
    <View
      pointerEvents="none"
      className="absolute bottom-14 left-14 right-14 flex-row flex-wrap gap-8 max-w-[72px]"
    >
      {Array.from({ length: 9 }).map((_, i) => (
        <View
          key={i}
          className="w-10 h-10 rounded-full opacity-[0.65]"
          style={{ backgroundColor: color }}
        />
      ))}
    </View>
  );
}

// 5 — half circle peeking up from the bottom (an arch).
function HalfArch({ color }) {
  return (
    <View
      pointerEvents="none"
      className="absolute w-[140%] aspect-square rounded-full -bottom-[85%] -left-[20%] opacity-[0.55]"
      style={{ backgroundColor: color }}
    />
  );
}

// 6 — three nested squares in the bottom-left corner.
function NestedSquares({ color }) {
  return (
    <View pointerEvents="none" className="absolute bottom-14 left-14 w-56 h-56">
      <View
        className="absolute bottom-0 left-0 w-56 h-56 border-2 opacity-50"
        style={{ borderColor: color }}
      />
      <View
        className="absolute bottom-0 left-0 w-36 h-36 border-2 opacity-75"
        style={{ borderColor: color }}
      />
      <View
        className="absolute bottom-0 left-0 w-16 h-16"
        style={{ backgroundColor: color }}
      />
    </View>
  );
}

// 7 — rotated square masked by the cover edge to feel like a triangle.
function Triangle({ color }) {
  return (
    <View
      pointerEvents="none"
      className="absolute -right-20 -bottom-20 w-110 h-110 overflow-hidden"
    >
      <View
        className="w-110 h-110 rotate-45 opacity-60"
        style={{ backgroundColor: color }}
      />
    </View>
  );
}
