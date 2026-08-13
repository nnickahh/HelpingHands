import { Stack } from "expo-router";
import { AppProvider } from "../state/AppProvider";

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }} />
    </AppProvider>
  );
}
