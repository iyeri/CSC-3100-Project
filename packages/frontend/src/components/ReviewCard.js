import { Text, View } from "react-native";

export function ReviewCard({ review }) {
  return (
    <View className="border-b border-line py-20">
      <View className="flex-row items-center">
        <View className="w-42 h-42 rounded-21 bg-lavender items-center justify-center">
          <Text className="text-ink text-12 font-black">{review.initials}</Text>
        </View>
        <View className="flex-1 ml-12">
          <Text className="text-ink font-serif text-14">{review.borrower}</Text>
          <Text className="text-soft-muted text-11 mt-2">{review.date}</Text>
        </View>
        <View className="flex-row items-center gap-4">
          <Text className="text-coral text-14">★</Text>
          <Text className="text-ink text-13 font-black">{review.rating}</Text>
        </View>
      </View>
      <Text className="text-ink font-serif-regular text-14 leading-21 mt-14">
        {review.text}
      </Text>
    </View>
  );
}
