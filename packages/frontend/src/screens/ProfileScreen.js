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
} from "react-native";

import { BookCard } from "../components/BookCard";
import { BottomNav } from "../components/BottomNav";
import { CurrentReadCard } from "../components/CurrentReadCard";
import { ReviewCard } from "../components/ReviewCard";
import { books as initialBooks, profile, reviews } from "../data/profile";

// Used to compute card widths. Keep in sync with px-18 / max-w-[560px] in the
// classNames below.
const PAGE_PADDING = 18;
const GRID_GAP = 12;
const MAX_CONTENT_WIDTH = 560;

const androidStatusBarPadding = {
  paddingTop: Platform.OS === "android" ? NativeStatusBar.currentHeight : 0,
};

function tabClass(active) {
  return `flex-1 py-12 items-center rounded-full ${
    active ? "bg-dark-green" : "bg-chip-bg"
  }`;
}

function tabTextClass(active) {
  return `text-11 font-semibold tracking-[0.4px] ${
    active ? "text-white" : "text-text-muted"
  }`;
}

function HeaderButton({ accessibilityLabel, children }) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      hitSlop={10}
      className="w-34 h-34 rounded-17 border border-divider bg-white items-center justify-center active:opacity-[0.58]"
    >
      <Text className="text-text-primary text-16 leading-19 font-semibold">
        {children}
      </Text>
    </Pressable>
  );
}

export function ProfileScreen() {
  const [activeTab, setActiveTab] = useState("library");
  const [books, setBooks] = useState(initialBooks);
  const currentReads = useMemo(
    () => books.filter((book) => book.isCurrentRead),
    [books],
  );

  // Local-only for now; swap for an API call once the backend supports it.
  const toggleCurrentRead = (bookId) => {
    setBooks((prev) =>
      prev.map((book) =>
        book.id === bookId
          ? { ...book, isCurrentRead: !book.isCurrentRead }
          : book,
      ),
    );
  };
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(width, MAX_CONTENT_WIDTH);
  const bookWidth = useMemo(
    () => (contentWidth - PAGE_PADDING * 2 - GRID_GAP) / 2,
    [contentWidth],
  );

  return (
    <SafeAreaView
      className="flex-1 bg-off-white"
      style={androidStatusBarPadding}
    >
      <View className="flex-1 bg-off-white">
        <ScrollView
          contentContainerClassName="pb-16"
          showsVerticalScrollIndicator={false}
        >
          <View className="w-full max-w-[560px] self-center bg-off-white px-18">
            <View className="h-62 flex-row items-center justify-between border-b border-divider">
              <Text className="text-dark-green font-serif text-19">
                OurLibrary
              </Text>
              <View className="flex-row items-center gap-8">
                <HeaderButton accessibilityLabel="Share profile">
                  ↗
                </HeaderButton>
                <HeaderButton accessibilityLabel="Profile settings">
                  •••
                </HeaderButton>
              </View>
            </View>

            <View className="items-center pt-30">
              <View className="relative">
                <View className="w-104 h-104 rounded-52 bg-sage-green items-center justify-center">
                  <Text className="text-text-primary font-serif text-30 leading-36 tracking-[-0.6px]">
                    {profile.initials}
                  </Text>
                </View>
                <View className="absolute right-2 bottom-8 w-19 h-19 rounded-10 bg-dark-green border-[3px] border-off-white" />
              </View>

              <Text className="text-text-primary font-serif text-29 leading-35 tracking-[-0.4px] mt-15">
                {profile.name}
              </Text>
              <Text className="text-text-muted text-14 mt-2">
                {profile.handle}
              </Text>
              <View className="flex-row items-center gap-6 mt-10">
                <Text className="text-dark-green text-9">◆</Text>
                <Text className="text-text-primary text-12 font-medium">
                  {profile.community}
                </Text>
              </View>
            </View>

            <View className="flex-row items-stretch mt-24 py-16 bg-white rounded-22 border border-divider">
              {profile.stats.map((stat, index) => (
                <View
                  key={stat.label}
                  className={`flex-1 items-center justify-center ${
                    index < profile.stats.length - 1
                      ? "border-r border-divider"
                      : ""
                  }`}
                >
                  <Text className="text-text-primary font-serif text-19">
                    {stat.value}
                  </Text>
                  <Text className="text-text-muted text-11 mt-2 font-medium">
                    {stat.label}
                  </Text>
                </View>
              ))}
            </View>

            <Text className="text-text-primary font-serif-regular text-14 leading-21 text-center px-10 mt-20">
              {profile.bio}
            </Text>

            <View className="flex-row flex-wrap justify-center gap-7 mt-15">
              {profile.interests.map((interest) => (
                <View
                  key={interest}
                  className="bg-chip-bg rounded-full px-11 py-6"
                >
                  <Text className="text-text-primary text-10 font-medium">
                    {interest}
                  </Text>
                </View>
              ))}
            </View>

            <View className="flex-row gap-9 mt-22">
              <Pressable
                accessibilityRole="button"
                className="flex-1 h-47 bg-dark-green rounded-full items-center justify-center active:opacity-[0.58]"
              >
                <Text className="text-white text-12 font-semibold tracking-[0.5px]">
                  EDIT PROFILE
                </Text>
              </Pressable>
              <Pressable
                accessibilityLabel="Share profile"
                accessibilityRole="button"
                className="w-50 h-47 border border-divider rounded-full bg-white items-center justify-center active:opacity-[0.58]"
              >
                <Text className="text-text-primary text-20 font-semibold">
                  ↗
                </Text>
              </Pressable>
            </View>

            {/* <View className="flex-row items-center bg-acid mt-18 px-14 py-13">
              <View className="w-34 h-34 rounded-17 bg-ink items-center justify-center">
                <Text className="text-acid text-18 font-black">↺</Text>
              </View>
              <View className="flex-1 ml-11">
                <Text className="text-ink text-10 font-black tracking-[0.9px]">COMMUNITY READER</Text>
                <Text className="text-ink text-12 mt-2">12 successful local handoffs</Text>
              </View>
              <Text className="text-ink text-26 font-normal">›</Text>
            </View> */}

            <View className="mt-26">
              <View className="flex-row items-center justify-between mb-12">
                <Text className="text-text-primary font-serif text-20">
                  CURRENTLY READING
                </Text>
                <Text className="text-text-muted text-13 font-medium">
                  {currentReads.length}
                </Text>
              </View>
              {currentReads.length > 0 ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerClassName="gap-10"
                >
                  {currentReads.map((book) => (
                    <CurrentReadCard
                      book={book}
                      key={book.id}
                      onRemove={() => toggleCurrentRead(book.id)}
                    />
                  ))}
                </ScrollView>
              ) : (
                <View className="border border-divider rounded-18 bg-white px-14 py-16">
                  <Text className="text-muted text-12 leading-18 text-center">
                    Nothing on the nightstand. Tap “+ READING” on a book in your
                    library to add it here.
                  </Text>
                </View>
              )}
            </View>

            <View className="flex-row mt-30 gap-8">
              <Pressable
                accessibilityRole="tab"
                accessibilityState={{ selected: activeTab === "library" }}
                onPress={() => setActiveTab("library")}
                className={tabClass(activeTab === "library")}
              >
                <Text className={tabTextClass(activeTab === "library")}>
                  LIBRARY · {books.length}
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="tab"
                accessibilityState={{ selected: activeTab === "reviews" }}
                onPress={() => setActiveTab("reviews")}
                className={tabClass(activeTab === "reviews")}
              >
                <Text className={tabTextClass(activeTab === "reviews")}>
                  REVIEWS · {reviews.length}
                </Text>
              </Pressable>
            </View>

            {activeTab === "library" ? (
              <View className="flex-row flex-wrap justify-between pt-18">
                {books.map((book) => (
                  <BookCard
                    book={book}
                    key={book.id}
                    onToggleCurrentRead={() => toggleCurrentRead(book.id)}
                    width={bookWidth}
                  />
                ))}
              </View>
            ) : (
              <View className="pb-18">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
