# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v58.0.0/ before writing any code.

# Figma MCP Integration Rules

These rules define how to translate Figma inputs into code for this Expo/React Native project. Follow them for every Figma-driven change.

## Required Flow (do not skip)

1. Parse the Figma URL to extract `fileKey` (segment after `/design/`) and `nodeId` (value of `node-id`).
2. Run `get_design_context(fileKey, nodeId)` to fetch the structured representation.
3. If the response is truncated, run `get_metadata(fileKey, nodeId)` first, then re-fetch only the required child nodes with `get_design_context`.
4. Run `get_screenshot(fileKey, nodeId)` for a visual reference of the exact variant being implemented.
5. Only after you have both `get_design_context` and `get_screenshot`, download any required assets and start implementation.
6. Translate the Figma MCP output (React + Tailwind) into this project's conventions — React Native with `StyleSheet.create`.
7. Validate against the Figma screenshot for 1:1 look and behavior before marking complete.

## Stack and Conventions

- IMPORTANT: Target Expo SDK 58 + React Native 0.88 + React 19. Consult `https://docs.expo.dev/versions/v58.0.0/` before using any Expo API.
- IMPORTANT: This project is JavaScript, not TypeScript. Do not add `.ts`/`.tsx` files or type annotations. Use JSDoc if types must be documented.
- There is no navigation library. `App.js` switches screens via local `activeTab` state. Do not introduce `react-navigation` or `expo-router` unless explicitly asked.

## Component Organization

- IMPORTANT: Reusable UI primitives live in `packages/frontend/src/components/`. Full screens live in `packages/frontend/src/screens/`.
- Use the named-export pattern already used in `BookCard.js`, `BottomNav.js`, `TopBar.js`: `export function ComponentName(props) { ... }`.
- Keep `StyleSheet.create({ ... })` at the bottom of the file, under the component.
- Before creating a new component, scan `src/components/` for a reusable match. Known primitives: `BookCard`, `BottomNav`, `CategoryChips`, `CoverPattern`, `CurrentReadCard`, `ListingCard`, `ReviewCard`, `TopBar`.
- Import from `react-native` directly (`Pressable`, `View`, `Text`, `StyleSheet`, `Image`, `ScrollView`, `FlatList`). Prefer `Pressable` over `TouchableOpacity`.

## Design Tokens

- IMPORTANT: Never hardcode colors, spacing, radii, or font names in a component. Import from `../theme`.
- Tokens live in `packages/frontend/src/theme.js` and export `colors`, `spacing`, `fonts`, `radii`.
- IMPORTANT: `theme.js` carries two palettes. The **OurLibrary (sage) palette is the canonical one** — it matches the Figma mock and is what `LoginScreen.js` and `ListingsScreen.js` use. Reach for these keys first:
  - Backgrounds: `offWhite` (app canvas), `white` (cards, inputs), `cream` (warm surfaces)
  - Brand / CTA / primary accent: `darkGreen`. Supporting greens: `oliveGreen`, `sageGreen`
  - Text: `textPrimary` (body + headings), `textMuted` (secondary / placeholder)
  - Borders and dividers: `divider`
  - Chips and selection states: `chipBg`, `chipActive`
  - Destructive / error / warning accent: `coral`
- The "main" palette keys (`ink`, `muted`, `softMuted`, `canvas`, `paper`, `line`, `acid`, `lavender`, `sky`, `butter`, `forest`) are legacy from an earlier merge. Do not use them for new work — they're still referenced by some older components but should be migrated to the OurLibrary palette when those components are touched.
- When a Figma value has no matching token, add it to the OurLibrary palette in `theme.js` rather than inlining a hex, px value, or font family string.
- Spacing scale: `spacing.xs` (4), `spacing.sm` (8), `spacing.md` (12), `spacing.lg` (16), `spacing.xl` (24), `spacing.xxl` (32). Snap Figma spacing to the nearest value; add a new key only if the drift would be visible.

## Typography

- IMPORTANT: Fonts are loaded in `App.js` via `useFonts`. If a Figma design calls for a weight or face that isn't in `fonts`, load it there before using it.
- Available families: `fonts.serif` / `fonts.serifBold` (Source Serif 4), `fonts.sans` / `fonts.sansMedium` / `fonts.sansBold` (DM Sans).
- Use `fontFamily: fonts.sansMedium` (etc.) rather than `fontWeight` strings when a loaded variant exists — React Native will not synthesize weights from Google Fonts files.
- IMPORTANT: Never use the raw string `"serif"` or `"sans-serif"` as a `fontFamily` — always import from `fonts` in `../theme`. (`ListingsScreen.js`'s section title currently uses `"serif"`; that's a bug, not a pattern to copy.)
- Canonical role-to-family mapping, matching `LoginScreen.js` and `ListingsScreen.js`:
  - Brand wordmark and display headings → `fonts.serifBold`
  - Section titles (semi-bold serif at ~22px) → `fonts.serif`
  - Body copy, input text, placeholders → `fonts.sans`
  - Emphasized body / inline notices → `fonts.sansMedium`
  - Form labels, button text, CTAs, links-as-text → `fonts.sansBold`

## Figma → React Native Translation

- Treat the Figma MCP output (React + Tailwind) as a representation of layout and behavior, not final code.
- Replace Tailwind utility classes with `StyleSheet.create` entries. Do not install `tailwind`, `nativewind`, or any other CSS-in-JS library.
- Replace `<div>`/`<span>` with `<View>`/`<Text>`. Every string must live inside `<Text>` — bare strings inside `<View>` will crash.
- Replace `<button>` with `<Pressable>`, add `accessibilityRole="button"` and a meaningful `accessibilityLabel`.
- Replace `<img>` with `<Image>` from `react-native` and provide an explicit `width`/`height` via `style` (RN does not auto-size images).
- Flexbox: React Native defaults to `flexDirection: "row"` in a different way than web. Set `flexDirection` explicitly when the Figma layout is horizontal, and remember `flex: 1` is required for children to fill a parent.
- No CSS `gap` on web-only versions of RN; the version in this project (0.88) supports `gap`, `rowGap`, `columnGap` — prefer them over margin hacks.

## Asset Handling

- IMPORTANT: If the Figma MCP server returns a `localhost` source for an image or SVG, use that source directly in the `<Image source={{ uri: "http://localhost:.../..." }} />`.
- IMPORTANT: Do not install new icon libraries (`react-native-vector-icons`, `lucide-react-native`, `@expo/vector-icons`, etc.) to replace Figma assets.
- IMPORTANT: Do not substitute emoji, unicode glyphs, or placeholders when a Figma asset source is available. (Existing unicode icons in `BottomNav.js` are legacy; new work should use Figma-provided assets.)
- Store any downloaded static assets in `packages/frontend/assets/`.

## Accessibility

- Every `Pressable` needs `accessibilityRole` and either `accessibilityLabel` or visible text.
- Interactive toggles use `accessibilityRole="switch"` with `accessibilityState={{ checked: ... }}` (see `BookCard.js` for the pattern).
- Respect minimum 44×44 pt tap targets; use `hitSlop` for small icons.

## Validation Checklist

Before declaring a Figma task complete:

- [ ] Layout, spacing, and sizing match the screenshot from `get_screenshot`.
- [ ] Colors, font family, font size, line height, and letter spacing match the Figma context (routed through `theme.js`).
- [ ] Interactive states (pressed, disabled, toggle on/off) match the Figma variants.
- [ ] Assets render from the Figma localhost sources, not placeholders.
- [ ] No new hex values, raw px numbers, or font family strings were added outside `theme.js`.
- [ ] Component is placed in `src/components/` or `src/screens/` per the organization rules and exported with the project's named-export pattern.
