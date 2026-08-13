import { useState } from "react";
import { StyleSheet, Text, TextInput, type TextInputProps } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

type Props = TextInputProps & { label?: string; helperText?: string; error?: string };

export function WireInput({ label, helperText, error, onFocus, onBlur, style, ...props }: Props) {
  const [focused, setFocused] = useState(false);
  return (
    <>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        accessibilityLabel={label ?? props.placeholder}
        placeholderTextColor={colors.muted}
        onFocus={(event) => { setFocused(true); onFocus?.(event); }}
        onBlur={(event) => { setFocused(false); onBlur?.(event); }}
        style={[styles.input, focused && styles.focused, error && styles.errorInput, style]}
        {...props}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : helperText ? <Text style={styles.helper}>{helperText}</Text> : null}
    </>
  );
}

const styles = StyleSheet.create({
  label: { ...typography.label, color: colors.ink, textTransform: "uppercase", marginBottom: 6 },
  input: { minHeight: 52, borderWidth: 1.5, borderColor: colors.border, borderRadius: 14, paddingHorizontal: 16, color: colors.ink, fontSize: 16, marginBottom: 14, backgroundColor: colors.white },
  focused: { borderColor: colors.forest, backgroundColor: colors.sageSoft },
  errorInput: { borderColor: colors.coral, backgroundColor: colors.coralSoft },
  helper: { color: colors.gray, ...typography.small, marginTop: -8, marginBottom: 12 },
  errorText: { color: colors.coral, ...typography.small, marginTop: -8, marginBottom: 12 },
});
