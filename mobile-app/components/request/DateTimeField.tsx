import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { Icon } from "../ui/Icon";
import { CalendarModal, selectedFormatter } from "./CalendarModal";
import { ClockDial, formatTime } from "./ClockDial";

type Props = {
  label: string;
  mode: "date" | "time";
  value: Date | null;
  onChange: (value: Date) => void;
  onTimeChange?: (value: Date) => void;
  error?: string;
};

const datePlaceholder = "Choose a date";
const timePlaceholder = "Choose a time";

export function DateTimeField({ label, mode, value, onChange, onTimeChange, error }: Props) {
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [clockVisible, setClockVisible] = useState(false);
  const [clockInitialDate, setClockInitialDate] = useState<Date | null>(null);

  const open = () => {
    if (mode === "date") setCalendarVisible(true);
    else {
      setClockInitialDate(value ?? new Date());
      setClockVisible(true);
    }
  };
  const showValue = value ? mode === "date" ? selectedFormatter.format(value) : formatTime(value.getHours(), value.getMinutes()) : mode === "date" ? datePlaceholder : timePlaceholder;

  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={`${label}: ${showValue}`} accessibilityState={{ selected: Boolean(value) }} onPress={open} style={({ pressed }) => [styles.field, value && styles.selectedField, pressed && styles.pressed]}>
        <View style={styles.icon}><Icon name={mode === "date" ? "calendar-month" : "schedule"} size={24} color={value ? colors.forest : colors.muted} label={label} /></View>
        <Text style={[styles.value, !value && styles.placeholder]}>{showValue}</Text>
        <Icon name="edit-calendar" size={20} color={colors.muted} />
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {mode === "date" ? <CalendarModal visible={calendarVisible} value={value} onClose={() => setCalendarVisible(false)} onContinue={(date) => { setCalendarVisible(false); setClockInitialDate(date); setClockVisible(true); onChange(date); }} /> : null}
      <ClockDial visible={clockVisible} initialDate={clockInitialDate ?? value ?? new Date()} onClose={() => setClockVisible(false)} onDone={(date) => { setClockVisible(false); if (mode === "date") onTimeChange?.(date); else onChange(date); }} />
    </>
  );
}

const styles = StyleSheet.create({
  label: { ...typography.label, color: colors.ink, textTransform: "uppercase", marginBottom: 6 },
  field: { minHeight: 54, borderWidth: 1, borderColor: colors.borderStrong, borderRadius: 0, paddingHorizontal: 12, backgroundColor: colors.oat, flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14 },
  selectedField: { borderColor: colors.forest, backgroundColor: colors.sageSoft },
  pressed: { opacity: 0.82 },
  icon: { width: 34, height: 34, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.sand, alignItems: "center", justifyContent: "center" },
  value: { flex: 1, color: colors.ink, ...typography.bodyText },
  placeholder: { color: colors.muted },
  error: { color: colors.coral, ...typography.small, marginTop: -8, marginBottom: 12 },
});
