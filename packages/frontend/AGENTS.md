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
6. Translate the Figma MCP output (React + Tailwind) into this project's conventions — React Native primitives styled with NativeWind `className`s.
7. Validate against the Figma screenshot for 1:1 look and behavior before marking complete.

## Stack and Conventions

- IMPORTANT: Target Expo SDK 58 + React Native 0.88 + React 19. Consult `https://docs.expo.dev/versions/v58.0.0/` before using any Expo API.
- IMPORTANT: This project is JavaScript, not TypeScript. Do not add `.ts`/`.tsx` files or type annotations. Use JSDoc if types must be documented.
- There is no navigation library. `App.js` switches screens via local `activeTab` state. Do not introduce `react-navigation` or `expo-router` unless explicitly asked.

## Component Organization

- IMPORTANT: Reusable UI primitives live in `packages/frontend/src/components/`. Full screens live in `packages/frontend/src/screens/`.
- Use the named-export pattern already used in `BookCard.js`, `BottomNav.js`, `TopBar.js`: `export function ComponentName(props) { ... }`.
- Before creating a new component, scan `src/components/` for a reusable match. Known primitives: `BookCard`, `BottomNav`, `CategoryChips`, `CoverPattern`, `CurrentReadCard`, `ListingCard`, `ReviewCard`, `TopBar`.
- Import from `react-native` directly (`Pressable`, `View`, `Text`, `Image`, `ScrollView`, `FlatList`). Prefer `Pressable` over `TouchableOpacity`.
- Backend calls live in `src/api/` and read the server address from `API_BASE` in `src/config.js`. Shared static lists (e.g. genres in `src/data/genres.js`) live in `src/data/`.

## Styling: NativeWind

- IMPORTANT: Style new code with NativeWind (`className` with Tailwind classes). Do not write new `StyleSheet.create` styles.
- IMPORTANT: Do not convert existing `StyleSheet` code to NativeWind unless asked. `src/screens/ListingDetailScreen.js` is the remaining `StyleSheet` file; small edits there stay in `StyleSheet`. Don't mix both systems in one file.
- Setup already in the repo: `tailwind.config.js`, `global.css`, `babel.config.js`, `metro.config.js`. Don't reinstall or reconfigure NativeWind.
- React Native's `SafeAreaView` only accepts `className` because of `src/nativewind-interop.js`. Any other component that ignores `className` needs a `cssInterop` entry there.
- Use inline `style={{}}` only for values a class can't express: computed sizes (e.g. a card width from `useWindowDimensions`) and per-item colors from data.
- Props like `ActivityIndicator`'s `color` or `TextInput`'s `placeholderTextColor` can't take classes. Read those values from `colors` in `../theme`.

## Design Tokens

- IMPORTANT: Never hardcode hex colors or font names in a component. Use the token classes, or `../theme` where a class can't be used.
- Tokens are defined once in `packages/frontend/src/tokens.js`. `tailwind.config.js` turns them into classes, and `src/theme.js` re-exports them as `colors`, `spacing`, `fonts`, `radii` for runtime use.
- Class names are the kebab-case token keys: `colors.darkGreen` → `bg-dark-green`, `colors.textPrimary` → `text-text-primary`, `radii.pill` → `rounded-pill`, `spacing.md` → `p-md`.
- Numeric spacing, font size, line height, and radius classes are exact pixels on every platform: `p-14` is 14px, `text-13` is 13px, `leading-22` is 22px, `rounded-4` is 4px.
- IMPORTANT: `tokens.js` carries two palettes. The **OurLibrary (sage) palette is the canonical one** — it matches the Figma mock and is what `LoginScreen.js` and `ListingsScreen.js` use. Reach for these keys first:
  - Backgrounds: `offWhite` (app canvas), `white` (cards, inputs), `cream` (warm surfaces)
  - Brand / CTA / primary accent: `darkGreen`. Supporting greens: `oliveGreen`, `sageGreen`
  - Text: `textPrimary` (body + headings), `textMuted` (secondary / placeholder)
  - Borders and dividers: `divider`
  - Chips and selection states: `chipBg`, `chipActive`
  - Destructive / error / warning accent: `coral`
- The "main" palette keys (`ink`, `muted`, `softMuted`, `canvas`, `paper`, `line`, `acid`, `lavender`, `sky`, `butter`, `forest`) are legacy from an earlier merge. Do not use them for new work — they're still referenced by some older components but should be migrated to the OurLibrary palette when those components are touched.
- When a Figma color has no matching token, add it to the OurLibrary palette in `tokens.js` rather than inlining a hex value.
- Spacing scale: `spacing.xs` (4), `spacing.sm` (8), `spacing.md` (12), `spacing.lg` (16), `spacing.xl` (24), `spacing.xxl` (32). Snap Figma spacing to the nearest value; add a new key only if the drift would be visible.

## Typography

- IMPORTANT: Fonts are loaded in `App.js` via `useFonts`. If a Figma design calls for a weight or face that isn't in `fonts` (in `tokens.js`), load it in `App.js` and add it to `fonts` before using it.
- Font classes: `font-serif-regular`, `font-serif` (semibold), `font-serif-bold` (Source Serif 4); `font-sans`, `font-sans-medium`, `font-sans-bold` (DM Sans).
- IMPORTANT: Each font class is a single loaded weight. Don't pair it with `font-semibold` / `font-bold`; React Native won't synthesize weights from Google Fonts files. Pick the font class with the weight you need.
- Canonical role-to-font mapping, matching `LoginScreen.js` and `ListingsScreen.js`:
  - Brand wordmark and display headings → `font-serif-bold`
  - Section titles (semi-bold serif at ~22px) → `font-serif`
  - Body copy, input text, placeholders → `font-sans`
  - Emphasized body / inline notices → `font-sans-medium`
  - Form labels, button text, CTAs, links-as-text → `font-sans-bold`

## Figma → React Native Translation

- Treat the Figma MCP output (React + Tailwind) as a representation of layout and behavior. Keep its Tailwind classes where they work in NativeWind, but swap raw values for this project's token classes (`bg-[#748469]` → `bg-dark-green`, `font-['DM_Sans']` → `font-sans`).
- Some web Tailwind classes have no React Native equivalent (e.g. `grid`, `hover:`, most `shadow-*` on Android). Use flexbox, `active:` for pressed states, and inline `style` shadow props instead.
- Replace `<div>`/`<span>` with `<View>`/`<Text>`. Every string must live inside `<Text>` — bare strings inside `<View>` will crash.
- Replace `<button>` with `<Pressable>`, add `accessibilityRole="button"` and a meaningful `accessibilityLabel`.
- Replace `<img>` with `<Image>` from `react-native` and give it an explicit size (`w-*`/`h-*` classes or `style`); RN does not auto-size images.
- Flexbox: React Native's default `flexDirection` is `column`, unlike web's `row`. Add `flex-row` when the Figma layout is horizontal, and remember `flex-1` is required for children to fill a parent.
- React Native 0.88 supports `gap`, `gap-x-*`, `gap-y-*` — prefer them over margin hacks.

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
- [ ] Colors, font family, font size, line height, and letter spacing match the Figma context (using token classes).
- [ ] Interactive states (pressed, disabled, toggle on/off) match the Figma variants.
- [ ] Assets render from the Figma localhost sources, not placeholders.
- [ ] No new hex values or font family strings were added outside `tokens.js`, and no new `StyleSheet.create` styles were written.
- [ ] Component is placed in `src/components/` or `src/screens/` per the organization rules and exported with the project's named-export pattern.
