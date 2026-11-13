import { StyleSheet, View } from "react-native";

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
      style={[styles.circle, { backgroundColor: color }]}
    />
  );
}

// 1 — three thick horizontal bars across the bottom.
function HorizontalStripes({ color }) {
  return (
    <View pointerEvents="none" style={styles.hStripes}>
      {[0, 1, 2].map((i) => (
        <View
          key={i}
          style={[
            styles.hStripe,
            { backgroundColor: color, opacity: 0.35 + i * 0.2 },
          ]}
        />
      ))}
    </View>
  );
}

// 2 — three vertical bars down the right side.
function VerticalStripes({ color }) {
  return (
    <View pointerEvents="none" style={styles.vStripes}>
      {[0, 1, 2].map((i) => (
        <View
          key={i}
          style={[
            styles.vStripe,
            { backgroundColor: color, opacity: 0.35 + i * 0.2 },
          ]}
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
      style={[styles.diagonal, { backgroundColor: color }]}
    />
  );
}

// 4 — 3x3 grid of small dots.
function DotGrid({ color }) {
  return (
    <View pointerEvents="none" style={styles.dotGrid}>
      {Array.from({ length: 9 }).map((_, i) => (
        <View key={i} style={[styles.dot, { backgroundColor: color }]} />
      ))}
    </View>
  );
}

// 5 — half circle peeking up from the bottom (an arch).
function HalfArch({ color }) {
  return (
    <View
      pointerEvents="none"
      style={[styles.arch, { backgroundColor: color }]}
    />
  );
}

// 6 — three nested squares in the bottom-left corner.
function NestedSquares({ color }) {
  return (
    <View pointerEvents="none" style={styles.squaresWrap}>
      <View style={[styles.sq, styles.sqOuter, { borderColor: color }]} />
      <View style={[styles.sq, styles.sqMid, { borderColor: color }]} />
      <View style={[styles.sq, styles.sqInner, { backgroundColor: color }]} />
    </View>
  );
}

// 7 — rotated square masked by the cover edge to feel like a triangle.
function Triangle({ color }) {
  return (
    <View pointerEvents="none" style={styles.triangleWrap}>
      <View style={[styles.triangle, { backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  // Shared: full-bleed layer sitting under the cover text.
  circle: {
    position: "absolute",
    width: "70%",
    aspectRatio: 1,
    borderRadius: 999,
    bottom: -20,
    left: "15%",
    opacity: 0.55,
  },

  hStripes: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "45%",
    justifyContent: "flex-end",
    gap: 6,
    paddingBottom: 10,
  },
  hStripe: {
    height: 10,
    marginHorizontal: 14,
    borderRadius: 2,
  },

  vStripes: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    width: "45%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "stretch",
    gap: 6,
    paddingRight: 14,
    paddingVertical: 14,
  },
  vStripe: {
    width: 10,
    borderRadius: 2,
  },

  diagonal: {
    position: "absolute",
    width: "160%",
    height: 28,
    bottom: "30%",
    left: "-30%",
    transform: [{ rotate: "-28deg" }],
    opacity: 0.6,
    borderRadius: 4,
  },

  dotGrid: {
    position: "absolute",
    bottom: 14,
    left: 14,
    right: 14,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    maxWidth: 72,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    opacity: 0.65,
  },

  arch: {
    position: "absolute",
    width: "140%",
    aspectRatio: 1,
    borderRadius: 999,
    bottom: "-85%",
    left: "-20%",
    opacity: 0.55,
  },

  squaresWrap: {
    position: "absolute",
    bottom: 14,
    left: 14,
    width: 56,
    height: 56,
  },
  sq: {
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  sqOuter: {
    width: 56,
    height: 56,
    borderWidth: 2,
    opacity: 0.5,
  },
  sqMid: {
    width: 36,
    height: 36,
    borderWidth: 2,
    opacity: 0.75,
  },
  sqInner: {
    width: 16,
    height: 16,
  },

  triangleWrap: {
    position: "absolute",
    right: -20,
    bottom: -20,
    width: 110,
    height: 110,
    overflow: "hidden",
  },
  triangle: {
    width: 110,
    height: 110,
    transform: [{ rotate: "45deg" }],
    opacity: 0.6,
  },
});
