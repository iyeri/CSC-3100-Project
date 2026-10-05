import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../theme";

const items = [
  { label: "Home", icon: "⌂" },
  { label: "Browse", icon: "⌕" },
  { label: "Add", icon: "+", primary: true },
  { label: "Loans", icon: "⇄" },
  { label: "Profile", icon: "●", active: true },
];

export function BottomNav() {
  return (
    <View style={styles.shell}>
      <View style={styles.nav}>
        {items.map((item) => (
          <Pressable
            accessibilityLabel={item.label}
            accessibilityRole="button"
            key={item.label}
            style={({ pressed }) => [styles.item, pressed && styles.pressed]}
          >
            <View style={item.primary ? styles.primaryIcon : styles.iconBox}>
              <Text
                style={[
                  styles.icon,
                  item.active && styles.activeIcon,
                  item.primary && styles.primaryIconText,
                ]}
              >
                {item.icon}
              </Text>
            </View>
            {!item.primary && (
              <Text style={[styles.label, item.active && styles.activeLabel]}>{item.label}</Text>
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    backgroundColor: colors.paper,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingBottom: 18,
  },
  nav: {
    height: 62,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    maxWidth: 560,
    width: "100%",
    alignSelf: "center",
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  pressed: {
    opacity: 0.55,
  },
  iconBox: {
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    color: colors.softMuted,
    fontSize: 24,
    lineHeight: 27,
    fontWeight: "600",
  },
  activeIcon: {
    color: colors.ink,
    fontSize: 18,
  },
  label: {
    color: colors.softMuted,
    fontSize: 9,
    fontWeight: "700",
  },
  activeLabel: {
    color: colors.ink,
  },
  primaryIcon: {
    width: 48,
    height: 48,
    marginTop: -12,
    borderRadius: 24,
    backgroundColor: colors.ink,
    borderWidth: 4,
    borderColor: colors.paper,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryIconText: {
    color: colors.paper,
    fontSize: 30,
    lineHeight: 31,
    fontWeight: "300",
  },
});
