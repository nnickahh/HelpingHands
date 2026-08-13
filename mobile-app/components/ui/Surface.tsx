import { StyleSheet, View, type ViewProps } from "react-native";
import { colors } from "../../theme/colors";

type Props = ViewProps & { tone?: "white" | "sage" | "sand" };

export function Surface({ tone = "white", style, ...props }: Props) {
  return <View style={[styles.base, styles[tone], style]} {...props} />;
}

const styles = StyleSheet.create({
  base: { borderRadius: 18, borderWidth: 1, borderColor: colors.border, padding: 16 },
  white: { backgroundColor: colors.white },
  sage: { backgroundColor: colors.sageSoft },
  sand: { backgroundColor: colors.sand },
});
