// Design tokens — merged palette from sanjana-front-end + main.
// Both naming conventions are preserved so existing component code on either
// side of the merge keeps resolving its color keys. Clean up to a single
// palette later once components have been consolidated.
export const colors = {
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

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

// Font family names loaded via expo-font in App.js. Fall back to platform
// serif / sans if fonts haven't finished loading yet.
export const fonts = {
  serif: "SourceSerif4_600SemiBold",
  serifBold: "SourceSerif4_700Bold",
  sans: "DMSans_400Regular",
  sansMedium: "DMSans_500Medium",
  sansBold: "DMSans_700Bold",
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
};
