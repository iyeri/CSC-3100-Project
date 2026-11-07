import { StyleSheet, Text, TextInput, View } from "react-native";

import { colors, radii, spacing } from "../theme";

export default function TopBar() {
  return (
    <View style={styles.row}>
      <Text style={styles.logo}>OurLibrary</Text>

      <View style={styles.search}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          placeholder="Title, author, ISBN"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />
      </View>

      <View style={styles.avatar}>
        <Text style={styles.avatarText}>11</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  logo: {
    fontFamily: "serif",
    fontSize: 18,
    color: colors.darkGreen,
    fontWeight: "600",
  },
  search: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    height: 36,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  searchIcon: {
    color: colors.textMuted,
    marginRight: spacing.sm,
    fontSize: 14,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
    padding: 0,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: colors.darkGreen,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "600",
  },
});
