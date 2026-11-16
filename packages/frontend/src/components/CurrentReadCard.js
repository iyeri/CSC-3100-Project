import { Pressable, Text, View } from "react-native";

// Compact horizontal card used in the "Currently reading" section.
export function CurrentReadCard({ book, onRemove }) {
  return (
    <View className="w-[248px] flex-row items-center border border-ink p-10 bg-paper">
      <View
        className="w-52 aspect-[0.78] rounded-3 p-6 overflow-hidden"
        style={{ backgroundColor: book.cover }}
      >
        <View className="h-3 w-18" style={{ backgroundColor: book.accent }} />
        <Text
          className="absolute -right-4 -bottom-8 text-46 leading-52 font-black opacity-25"
          style={{ color: book.accent }}
        >
          {book.mark}
        </Text>
      </View>

      <View className="flex-1 ml-12">
        <Text className="text-forest text-9 font-black tracking-[0.8px]">
          NOW READING
        </Text>
        <Text
          className="text-ink font-serif text-14 leading-18 mt-3"
          numberOfLines={2}
        >
          {book.title}
        </Text>
        <Text className="text-muted text-12 leading-16 mt-1" numberOfLines={1}>
          {book.author}
        </Text>
      </View>

      <Pressable
        accessibilityLabel={`Remove ${book.title} from currently reading`}
        accessibilityRole="button"
        hitSlop={10}
        onPress={onRemove}
        className="w-26 h-26 rounded-13 border border-line items-center justify-center ml-8 self-start active:opacity-[0.58]"
      >
        <Text className="text-muted text-11 font-black">✕</Text>
      </Pressable>
    </View>
  );
}
