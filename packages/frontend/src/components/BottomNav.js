import { Pressable, Text, View } from "react-native";

import { BrowseScreen } from "../screens/BrowseScreen";
import { ProfileScreen } from "../screens/ProfileScreen";

const items = [
  { label: "Home", icon: "⌂" },
  { label: "Browse", icon: "⌕" },
  { label: "Add", icon: "+", primary: true },
  { label: "Loans", icon: "⇄" },
  { label: "Profile", icon: "●", active: true },
];

// Tailwind resolves conflicting classes by stylesheet order, not className
// order, so each state gets its own complete set of text classes.
function iconTextClass(primary, active) {
  if (primary) return "text-paper text-30 leading-31 font-light";
  if (active) return "text-ink text-18 leading-27 font-semibold";
  return "text-soft-muted text-24 leading-27 font-semibold";
}

export function BottomNav({ activeTab, onNavigate }) {
  return (
    <View className="bg-paper border-t border-line pb-18">
      <View className="h-62 flex-row items-center justify-around max-w-[560px] w-full self-center">
        {items.map((item) => {
          const active = activeTab === item.label;
          return (
            <Pressable
              accessibilityLabel={item.label}
              accessibilityRole="button"
              key={item.label}
              onPress={() => onNavigate(item.label)}
              className="flex-1 items-center justify-center gap-2 active:opacity-[0.55]"
            >
              <View
                className={
                  item.primary
                    ? "w-48 h-48 -mt-12 rounded-24 bg-ink border-4 border-paper items-center justify-center"
                    : "h-28 items-center justify-center"
                }
              >
                <Text className={iconTextClass(item.primary, active)}>
                  {item.icon}
                </Text>
              </View>
              {!item.primary && (
                <Text
                  className={`text-9 font-bold ${
                    active ? "text-ink" : "text-soft-muted"
                  }`}
                >
                  {item.label}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
