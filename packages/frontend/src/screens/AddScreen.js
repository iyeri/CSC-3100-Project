import { useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar as NativeStatusBar,
  Text,
  useWindowDimensions,
  View,
  TextInput,
} from "react-native";

import { BookCard } from "../components/BookCard";
import { colors } from "../theme";

const conditions = ["New", "Slightly Used", "Used"];
const status = ["Available", "Lent", "Current Read"];

const androidStatusBarPadding = {
  paddingTop: Platform.OS === "android" ? NativeStatusBar.currentHeight : 0,
};

const INPUT_ROW_CLASS = "min-h-48 flex-row items-center bg-canvas px-12 gap-10";
const INPUT_CLASS = "flex-1 min-w-0 text-ink text-13 py-12";

export function AddScreen({ onAddListing }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [condition, setCondition] = useState("");
  const [status, setStatus] = useState("");

  const handleAdd = () => {
    const newListing = {
      id: Date.now().toString(),
      title: title.trim(),
      author: author.trim(),
      genre: genre.trim(),
      status: status.trim(),
      condition,
    };

    if (onAddListing) {
      onAddListing(newListing);
    }
    setTitle("");
    setAuthor("");
    setGenre("");
    setStatus("");
    setCondition("");
  };
  return (
    <SafeAreaView className="flex-1 bg-paper" style={androidStatusBarPadding}>
      <View className="flex-1 bg-canvas">
        <ScrollView
          contentContainerClassName="pb-16"
          showsVerticalScrollIndicator={false}
        >
          <View className="w-full max-w-[560px] self-center bg-paper px-18">
            <View className="h-62 flex-row items-center justify-between border-b border-line">
              <Text className="text-ink text-16 font-black tracking-[-0.6px]">
                OUR/LIBRARY
              </Text>
              <Text>New Listings</Text>
            </View>
            <View className="pt-28 pb-22">
              <Text className="text-ink text-28 leading-34 font-black tracking-[-0.8px]">
                ADD A NEW BOOK TO OUR LIBRARY!
              </Text>
              <Text className="text-muted">
                Add a new book to share with our community
              </Text>
            </View>
            <View className="mt-26">
              <View className={INPUT_ROW_CLASS}>
                <Text>BOOK TITLE</Text>
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="ex. Beloved"
                  placeholderTextColor={colors.muted}
                  className={INPUT_CLASS}
                />
              </View>
              <View className={INPUT_ROW_CLASS}>
                <Text>AUTHOR</Text>
                <TextInput
                  value={author}
                  onChangeText={setAuthor}
                  placeholder="ex. Toni Morrison "
                  placeholderTextColor={colors.muted}
                  className={INPUT_CLASS}
                />
              </View>
              <View className={INPUT_ROW_CLASS}>
                <Text>GENRE</Text>
                <TextInput
                  value={genre}
                  onChangeText={setGenre}
                  placeholder="ex. Fiction, Mystery, Sci-Fi"
                  placeholderTextColor={colors.muted}
                  className={INPUT_CLASS}
                />
              </View>
              <View className={INPUT_ROW_CLASS}>
                <Text>STATUS</Text>
                <TextInput
                  value={status}
                  onChangeText={setStatus}
                  placeholder="ex. Available, Current Read, Lent"
                  placeholderTextColor={colors.muted}
                  className={INPUT_CLASS}
                />
              </View>

              <View>
                <Text>Your Listing</Text>
                <Text>
                  {title.trim()} <br />
                  {author.trim()}
                  <br />
                  {genre.trim()}
                  <br />
                  {status.trim()}
                </Text>
              </View>
              <Pressable
                className="bg-ink mt-20 flex-row items-center"
                onPress={handleAdd}
              >
                <Text className="text-soft-muted text-12 font-black">
                  Submit Book
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
