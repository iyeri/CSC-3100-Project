const { colors, fonts, radii, spacing } = require("./src/tokens");

// Tailwind's default scales are rem-based, and NativeWind resolves 1rem to
// 14px on native but 16px on web. The app's design is specified in exact
// pixels, so spacing, font size, line height and radius use pixel scales
// instead: `p-14` is 14px, `p-md` is spacing.md (12px), `text-13` is 13px, `leading-19` is 19px,
// `rounded-4` is 4px on every platform.
const px = (max) =>
  Object.fromEntries(
    Array.from({ length: max + 1 }, (_, n) => [String(n), `${n}px`]),
  );

const kebab = (s) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
const kebabKeys = (obj) =>
  Object.fromEntries(Object.entries(obj).map(([k, v]) => [kebab(k), v]));
const pxValues = (obj) =>
  Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, `${v}px`]));

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.js", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    // Numeric pixels plus the theme tokens: p-md is 12px, gap-sm is 8px.
    spacing: { ...px(160), ...pxValues(spacing), px: "1px" },
    fontSize: px(120),
    lineHeight: px(120),
    borderRadius: {
      ...px(60),
      none: "0px",
      ...pxValues(radii), // rounded-sm/md/lg/xl/pill
      full: "9999px",
    },
    fontFamily: {
      // Loaded Google fonts: font-serif-regular, font-serif (semibold),
      // font-serif-bold, font-sans, font-sans-medium, font-sans-bold. Each
      // name is one weight, so don't pair these with font-semibold/font-bold.
      ...Object.fromEntries(
        Object.entries(kebabKeys(fonts)).map(([k, v]) => [k, [v]]),
      ),
    },
    extend: {
      colors: kebabKeys(colors),
    },
  },
  plugins: [],
};
