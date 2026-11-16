import { Pressable, Text, View } from "react-native";

export function BookCard({ book, width, onToggleCurrentRead }) {
  const isAvailable = book.status === "AVAILABLE";
  const isReading = Boolean(book.isCurrentRead);

  return (
    <Pressable
      accessibilityHint={`View ${book.title} by ${book.author}`}
      accessibilityRole="button"
      className="mb-24 active:opacity-[0.72] active:scale-[0.985]"
      style={{ width }}
    >
      <View
        className="aspect-[0.78] rounded-4 p-14 overflow-hidden justify-between"
        style={{ backgroundColor: book.cover }}
      >
        {/* z-[1] keeps the toggle above the decorative cover letter. */}
        <View className="flex-row items-start justify-between z-[1]">
          <View className="h-5 w-42" style={{ backgroundColor: book.accent }} />
          {onToggleCurrentRead ? (
            <Pressable
              accessibilityLabel={`Currently reading ${book.title}`}
              accessibilityRole="switch"
              accessibilityState={{ checked: isReading }}
              hitSlop={8}
              onPress={onToggleCurrentRead}
              className={`rounded-12 border border-ink px-7 py-4 -mt-6 -mr-6 active:opacity-60 ${
                isReading ? "bg-acid" : "bg-paper"
              }`}
            >
              <Text className="text-ink text-8 font-black tracking-[0.6px]">
                {isReading ? "✓ READING" : "+ READING"}
              </Text>
            </Pressable>
          ) : null}
        </View>
        <Text
          className="absolute -right-10 top-18 text-96 leading-104 font-black opacity-[0.16]"
          style={{ color: book.accent }}
        >
          {book.mark}
        </Text>
        <View className="gap-5">
          <Text
            className="max-w-[90%] font-serif text-18 leading-19 tracking-[-0.7px]"
            style={{ color: book.accent }}
            numberOfLines={3}
          >
            {book.title}
          </Text>
          <Text
            className="text-9 leading-12 font-bold tracking-[0.5px] uppercase"
            style={{ color: book.accent }}
            numberOfLines={1}
          >
            {book.author}
          </Text>
        </View>
      </View>

      <View className="pt-10">
        <Text
          className="text-ink font-serif text-14 leading-18"
          numberOfLines={1}
        >
          {book.title}
        </Text>
        <Text className="text-muted text-12 leading-17" numberOfLines={1}>
          {book.author}
        </Text>
        <View className="flex-row items-center gap-6 mt-6">
          <View
            className={`w-7 h-7 rounded-4 ${
              isAvailable ? "bg-forest" : "bg-soft-muted"
            }`}
          />
          <Text
            className={`text-10 font-black tracking-[0.8px] ${
              isAvailable ? "text-forest" : "text-soft-muted"
            }`}
          >
            {book.status}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
