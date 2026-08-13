import { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { Icon } from "../ui/Icon";
import { WireButton } from "../ui/WireButton";

type Props = {
  visible: boolean;
  value: Date | null;
  onClose: () => void;
  onContinue: (date: Date) => void;
};

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const monthFormatter = new Intl.DateTimeFormat("en-SG", { month: "long", year: "numeric", timeZone: "Asia/Singapore" });
const selectedFormatter = new Intl.DateTimeFormat("en-SG", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Singapore" });

function startOfSingaporeDay(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function dateKey(date: Date) {
  return `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}`;
}

export function CalendarModal({ visible, value, onClose, onContinue }: Props) {
  const today = startOfSingaporeDay(new Date());
  const [month, setMonth] = useState(() => value ?? today);
  const [selected, setSelected] = useState<Date | null>(value);

  useEffect(() => {
    if (!visible) return;
    const next = value ?? today;
    setSelected(next);
    setMonth(new Date(Date.UTC(next.getUTCFullYear(), next.getUTCMonth(), 1)));
  }, [visible, value]);

  const days = useMemo(() => {
    const first = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth(), 1));
    const offset = (first.getUTCDay() + 6) % 7;
    const count = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + 1, 0)).getUTCDate();
    return Array.from({ length: offset + count }, (_, index) => index < offset ? null : new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth(), index - offset + 1)));
  }, [month]);

  const previousMonth = () => {
    const next = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() - 1, 1));
    if (next.getTime() >= new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1)).getTime()) setMonth(next);
  };
  const nextMonth = () => setMonth(new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + 1, 1)));

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}><View style={styles.sheet}>
        <View style={styles.header}><View><Text style={styles.eyebrow}>Choose a date</Text><Text style={styles.title}>When do you need help?</Text></View><Pressable accessibilityRole="button" accessibilityLabel="Close calendar" onPress={onClose} style={styles.close}><Icon name="close" size={24} color={colors.ink} /></Pressable></View>
        <View style={styles.monthHeader}><Pressable accessibilityRole="button" accessibilityLabel="Previous month" onPress={previousMonth} style={styles.arrow}><Icon name="chevron-left" size={26} color={colors.forest} /></Pressable><Text style={styles.month}>{monthFormatter.format(month)}</Text><Pressable accessibilityRole="button" accessibilityLabel="Next month" onPress={nextMonth} style={styles.arrow}><Icon name="chevron-right" size={26} color={colors.forest} /></Pressable></View>
        <View style={styles.weekRow}>{weekDays.map((day) => <Text key={day} style={styles.weekDay}>{day}</Text>)}</View>
        <View style={styles.grid}>{days.map((day, index) => {
          const disabled = !day || day.getTime() < today.getTime();
          const isSelected = day && selected && dateKey(day) === dateKey(selected);
          const isToday = day && dateKey(day) === dateKey(today);
          return <Pressable key={`${index}-${day?.toISOString() ?? "empty"}`} accessibilityRole="button" accessibilityLabel={day ? selectedFormatter.format(day) : undefined} accessibilityState={{ disabled, selected: Boolean(isSelected) }} disabled={disabled} onPress={() => day && setSelected(day)} style={[styles.day, isToday && styles.today, isSelected && styles.selected]}><Text style={[styles.dayText, disabled && styles.disabledText, isToday && styles.todayText, isSelected && styles.selectedText]}>{day?.getUTCDate() ?? ""}</Text></Pressable>;
        })}</View>
        <Text style={styles.selection}>{selected ? selectedFormatter.format(selected) : "Select a day to continue"}</Text>
        <WireButton label="Continue to choose a time" disabled={!selected} onPress={() => selected && onContinue(selected)} />
      </View></View>
    </Modal>
  );
}

export { selectedFormatter };

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(16,45,45,0.34)", justifyContent: "flex-end" },
  sheet: { backgroundColor: colors.oat, borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: 24, paddingBottom: 30 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  eyebrow: { ...typography.label, color: colors.forest, textTransform: "uppercase", marginBottom: 5 },
  title: { ...typography.title, color: colors.ink },
  close: { width: 48, height: 48, borderRadius: 14, backgroundColor: colors.white, alignItems: "center", justifyContent: "center" },
  monthHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  arrow: { width: 48, height: 48, borderRadius: 14, backgroundColor: colors.sage, alignItems: "center", justifyContent: "center" },
  month: { ...typography.heading, color: colors.ink },
  weekRow: { flexDirection: "row", marginBottom: 6 },
  weekDay: { flex: 1, textAlign: "center", ...typography.label, color: colors.muted, textTransform: "uppercase" },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  day: { width: "14.285%", aspectRatio: 1, alignItems: "center", justifyContent: "center", borderRadius: 16, marginVertical: 2 },
  dayText: { color: colors.ink, fontSize: 16, fontWeight: "700" },
  today: { borderWidth: 1.5, borderColor: colors.forest },
  todayText: { color: colors.forestDark },
  selected: { backgroundColor: colors.forest },
  selectedText: { color: colors.white },
  disabledText: { color: colors.borderStrong },
  selection: { color: colors.forestDark, ...typography.bodyStrong, textAlign: "center", marginVertical: 18 },
});
