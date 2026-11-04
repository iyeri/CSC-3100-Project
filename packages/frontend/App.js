import { StatusBar } from "expo-status-bar";

import ListingsScreen from "./src/screens/ListingsScreen";

export default function App() {
  return (
    <>
      <ListingsScreen />
      <StatusBar style="dark" />
    </>
  );
}

