import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { AppScreen } from "../../components/layout/AppScreen";
import { BrandHeader } from "../../components/layout/BrandHeader";
import { WireButton } from "../../components/ui/WireButton";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

export default function AuthCallbackScreen() {
  const params = useLocalSearchParams<{ error?: string; error_description?: string }>();
  const error = params.error_description ?? params.error;

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => router.replace("/"), 1600);
    return () => clearTimeout(timer);
  }, [error]);

  return (
    <AppScreen tone="oat">
      <BrandHeader />
      <View style={styles.content}>
        {error ? (
          <>
            <Text style={styles.heading}>Verification link failed</Text>
            <Text style={styles.body}>{error}. Return to the app and request a new code.</Text>
            <WireButton label="Return to log in" onPress={() => router.replace("/")} />
          </>
        ) : (
          <>
            <ActivityIndicator color={colors.ink} />
            <Text style={styles.heading}>Email confirmed</Text>
            <Text style={styles.body}>Your email link was opened successfully. Return to the app to continue.</Text>
            <WireButton label="Continue to log in" onPress={() => router.replace("/")} />
          </>
        )}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 24, alignItems: "center", justifyContent: "center", flex: 1 },
  heading: { ...typography.title, color: colors.ink, textAlign: "center", marginTop: 18 },
  body: { ...typography.bodyText, color: colors.gray, textAlign: "center", marginTop: 8, marginBottom: 20 },
});