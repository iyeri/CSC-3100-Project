// Runtime access to the design tokens for the few places that can't use a
// className (e.g. TextInput's placeholderTextColor). Tokens live in
// ./tokens.js so tailwind.config.js can share them.
import tokens from "./tokens";

export const { colors, spacing, fonts, radii } = tokens;
