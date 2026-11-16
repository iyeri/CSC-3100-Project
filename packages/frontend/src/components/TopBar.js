import { Text, TextInput, View } from "react-native";

import { colors } from "../theme";

export default function TopBar() {
  return (
    <View className="flex-row items-center px-20 pt-sm pb-md gap-md">
      <Text className="font-serif text-18 text-dark-green">OurLibrary</Text>

      <View className="flex-1 flex-row items-center bg-white rounded-pill px-md h-36 border border-divider">
        <Text className="text-text-muted mr-sm text-14">⌕</Text>
        <TextInput
          placeholder="Title, author, ISBN"
          placeholderTextColor={colors.textMuted}
          className="flex-1 text-13 text-text-primary p-0"
        />
      </View>

      <View className="w-32 h-32 rounded-full bg-dark-green items-center justify-center">
        <Text className="text-white text-12 font-semibold">11</Text>
      </View>
    </View>
  );
}
