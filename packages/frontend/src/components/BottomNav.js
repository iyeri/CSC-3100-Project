import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "../theme";

const TABS = [
  { id: "home", label: "Home", icon: "⌂" },
  { id: "discover", label: "Discover", icon: "⌕" },
  { id: "list", label: "List", icon: "+", primary: true },
  { id: "inbox", label: "Inbox", icon: "✉" },
  { id: "profile", label: "Profile", icon: "○" },
];

export default function BottomNav({ active = "home" }) {
  return (
    <View style={styles.bar}>
      {TABS.map((tab) => {
        const isActive = tab.id === active;
        if (tab.primary) {
          return (
            <Pressable key={tab.id} style={styles.item}>
              <View style={styles.fab}>
                <Text style={styles.fabIcon}>{tab.icon}</Text>
              </View>
              <Text style={styles.label}>{tab.label}</Text>
            </Pressable>
          );
        }
        return (
          <Pressable key={tab.id} style={styles.item}>
            <Text style={[styles.icon, isActive && styles.iconActive]}>
              {tab.icon}
            </Text>
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    backgroundColor: colors.offWhite,
  },
  item: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  icon: {
    fontSize: 18,
    color: colors.textMuted,
  },
  iconActive: {
    color: colors.textPrimary,
  },
  label: {
    fontSize: 10,
    color: colors.textMuted,
  },
  labelActive: {
    color: colors.textPrimary,
    fontWeight: "600",
  },
  fab: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: colors.darkGreen,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  fabIcon: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "600",
    marginTop: -2,
  },
});
