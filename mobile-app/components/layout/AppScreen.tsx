import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, View } from "react-native";
import type { ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../theme/colors";

type Props = { children: ReactNode; scroll?: boolean; fill?: boolean; tone?: "white" | "oat" };

export function AppScreen({ children, scroll = true, fill = false, tone = "white" }: Props) {
  const content = scroll ? (
    <ScrollView contentContainerStyle={[styles.content, fill && styles.fill, tone === "oat" && styles.oat]} keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, fill && styles.fill, tone === "oat" && styles.oat]}>{children}</View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right", "bottom"]}>
      <StatusBar style="dark" />
      {content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.oat },
  content: { flexGrow: 1, backgroundColor: colors.white },
  oat: { backgroundColor: colors.oat },
  fill: { flex: 1 },
});
