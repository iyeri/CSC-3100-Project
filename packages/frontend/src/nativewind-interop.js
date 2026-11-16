// NativeWind only wires `className` into the components it knows about.
// React Native's built-in SafeAreaView isn't one of them, so without this its
// className (e.g. `flex-1`) is silently dropped and screens stop scrolling.
import { SafeAreaView } from "react-native";
import { cssInterop } from "nativewind";

cssInterop(SafeAreaView, { className: "style" });
