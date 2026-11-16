// Design tokens — single source of truth for both tailwind.config.js (Node,
// CommonJS) and runtime JS via src/theme.js. Keep this file CommonJS with no
// imports so Tailwind can require() it.
//
// Merged palette from sanjana-front-end + main. Both naming conventions are
// preserved so existing code keeps resolving its color keys. Clean up to a
// single palette later once components have been consolidated.
//
// In className, camelCase keys become kebab-case: colors.darkGreen ->
// `bg-dark-green`, colors.textPrimary -> `text-text-primary`.
const colors = {
  // --- sanjana-front-end palette (OurLibrary Figma mock) ---
  darkGreen: "#748469",
  oliveGreen: "#ABB290",
  sageGreen: "#AAC1B1",
  cream: "#F9EAD7",
  offWhite: "#F6F6EE",
  textPrimary: "#1F2A24",
  textMuted: "#6B736C",
  chipBg: "#F0EFE7",
  chipActive: "#1F2A24",
  heartIdle: "#1F2A24",
  heartActive: "#B5533B",
  divider: "#E5E3D8",
  white: "#FFFFFF",

  // --- main palette ---
  ink: "#171717",
  muted: "#6F6F6F",
  softMuted: "#9A9A9A",
  canvas: "#F5F3EE",
  paper: "#FFFFFF",
  line: "#E8E5DF",
  acid: "#DFFF00",
  coral: "#FF6B55",
  lavender: "#C8BCFF",
  sky: "#A7D8F2",
  butter: "#F5D96B",
  forest: "#174C3C",
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

// Font family names loaded via expo-font in App.js. Fall back to platform
// serif / sans if fonts haven't finished loading yet.
const fonts = {
  serifRegular: "SourceSerif4_400Regular",
  serif: "SourceSerif4_600SemiBold",
  serifBold: "SourceSerif4_700Bold",
  sans: "DMSans_400Regular",
  sansMedium: "DMSans_500Medium",
  sansBold: "DMSans_700Bold",
};

const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
};

module.exports = { colors, spacing, fonts, radii };
