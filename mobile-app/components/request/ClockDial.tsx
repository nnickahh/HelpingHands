import { useEffect, useMemo, useRef, useState } from "react";
import { Modal, PanResponder, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { Icon } from "../ui/Icon";
import { WireButton } from "../ui/WireButton";

type Props = {
  visible: boolean;
  initialDate: Date;
  onClose: () => void;
  onDone: (date: Date) => void;
};

type Mode = "hour" | "minute";

function displayHour(hour: number) {
  return hour % 12 || 12;
}

function formatTime(hour: number, minute: number, meridiem = hour >= 12 ? "PM" : "AM") {
  return `${displayHour(hour)}:${String(minute).padStart(2, "0")} ${meridiem}`;
}

function angleToValue(x: number, y: number, center: number, mode: Mode) {
  const angle = Math.atan2(y - center, x - center) + Math.PI / 2;
  const normalized = (angle + Math.PI * 2) % (Math.PI * 2);
  const divisions = mode === "hour" ? 12 : 60;
  const raw = Math.round((normalized / (Math.PI * 2)) * divisions) % divisions;
  return mode === "hour" ? raw || 12 : (Math.round(raw / 5) * 5) % 60;
}

export function ClockDial({ visible, initialDate, onClose, onDone }: Props) {
  const [mode, setMode] = useState<Mode>("hour");
  const [hour, setHour] = useState(initialDate.getHours());
  const [minute, setMinute] = useState(Math.round(initialDate.getMinutes() / 5) * 5 % 60);
  const [meridiem, setMeridiem] = useState(initialDate.getHours() >= 12 ? "PM" : "AM");
  const dialSize = 276;

  useEffect(() => {
    if (!visible) return;
    setMode("hour");
    setHour(initialDate.getHours());
    setMinute(Math.round(initialDate.getMinutes() / 5) * 5 % 60);
    setMeridiem(initialDate.getHours() >= 12 ? "PM" : "AM");
  }, [visible, initialDate]);
  const center = dialSize / 2;
  const dialRef = useRef<View>(null);

  const updateFromTouch = (x: number, y: number) => {
    const value = angleToValue(x, y, center, mode);
    if (mode === "hour") setHour((current) => (current >= 12 ? value % 12 + 12 : value % 12));
    else setMinute(value);
  };

  const responder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (event) => updateFromTouch(event.nativeEvent.locationX, event.nativeEvent.locationY),
    onPanResponderMove: (event) => updateFromTouch(event.nativeEvent.locationX, event.nativeEvent.locationY),
  }), [mode]);

  const values = mode === "hour" ? Array.from({ length: 12 }, (_, index) => index + 1) : Array.from({ length: 12 }, (_, index) => index * 5);
  const selectedValue = mode === "hour" ? displayHour(hour) : minute;
  const selectedIndex = mode === "hour" ? selectedValue - 1 : minute / 5;
  const handAngle = selectedIndex * 30;

  const setHourFromTap = (value: number) => setHour((current) => (current >= 12 ? value % 12 + 12 : value % 12));
  const finish = () => {
    const next = new Date(initialDate);
    const normalizedHour = (hour % 12) + (meridiem === "PM" ? 12 : 0);
    next.setHours(normalizedHour, minute, 0, 0);
    onDone(next);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}><View style={styles.sheet}>
        <View style={styles.header}><View><Text style={styles.eyebrow}>Choose a time</Text><Text style={styles.title}>{formatTime(hour, minute, meridiem)}</Text></View><Pressable accessibilityRole="button" accessibilityLabel="Close clock" onPress={onClose} style={styles.close}><Icon name="close" size={24} color={colors.ink} /></Pressable></View>
        <View style={styles.modeRow}><Pressable accessibilityRole="button" accessibilityState={{ selected: mode === "hour" }} onPress={() => setMode("hour")} style={[styles.mode, mode === "hour" && styles.activeMode]}><Text style={[styles.modeText, mode === "hour" && styles.activeModeText]}>Hour</Text></Pressable><Pressable accessibilityRole="button" accessibilityState={{ selected: mode === "minute" }} onPress={() => setMode("minute")} style={[styles.mode, mode === "minute" && styles.activeMode]}><Text style={[styles.modeText, mode === "minute" && styles.activeModeText]}>Minutes</Text></Pressable></View>
        <View ref={dialRef} style={styles.dial} {...responder.panHandlers}>
          <View style={[styles.hand, { transform: [{ rotate: `${handAngle}deg` }] }]} /><View style={styles.centerDot} />
          {values.map((value, index) => { const angle = (index * 30 - 90) * Math.PI / 180; const radius = 103; const left = center + Math.cos(angle) * radius - 24; const top = center + Math.sin(angle) * radius - 24; const selected = value === selectedValue; return <Pressable key={value} accessibilityRole="button" accessibilityLabel={mode === "hour" ? `${value} o'clock` : `${value} minutes`} accessibilityState={{ selected }} onPress={() => mode === "hour" ? setHourFromTap(value) : setMinute(value)} style={[styles.clockValue, { left, top }, selected && styles.selectedClockValue]}><Text style={[styles.clockText, selected && styles.selectedClockText]}>{mode === "minute" ? String(value).padStart(2, "0") : value}</Text></Pressable>; })}
        </View>
        <View style={styles.meridiem}><Pressable accessibilityRole="button" accessibilityState={{ selected: meridiem === "AM" }} onPress={() => setMeridiem("AM")} style={[styles.period, meridiem === "AM" && styles.activePeriod]}><Text style={[styles.periodText, meridiem === "AM" && styles.activePeriodText]}>AM</Text></Pressable><Pressable accessibilityRole="button" accessibilityState={{ selected: meridiem === "PM" }} onPress={() => setMeridiem("PM")} style={[styles.period, meridiem === "PM" && styles.activePeriod]}><Text style={[styles.periodText, meridiem === "PM" && styles.activePeriodText]}>PM</Text></Pressable></View>
        <Text style={styles.hint}>{mode === "hour" ? "Drag the hand or tap an hour" : "Drag the hand or tap five-minute intervals"}</Text>
        <WireButton label="Use this time" onPress={finish} />
      </View></View>
    </Modal>
  );
}

export { formatTime };

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(16,45,45,0.34)", justifyContent: "flex-end" },
  sheet: { backgroundColor: colors.oat, borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: 24, paddingBottom: 30, alignItems: "center" },
  header: { width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  eyebrow: { ...typography.label, color: colors.forest, textTransform: "uppercase", marginBottom: 5 },
  title: { ...typography.title, color: colors.ink },
  close: { width: 48, height: 48, borderRadius: 14, backgroundColor: colors.white, alignItems: "center", justifyContent: "center" },
  modeRow: { flexDirection: "row", backgroundColor: colors.sage, borderRadius: 14, padding: 4, marginBottom: 18 },
  mode: { minWidth: 92, minHeight: 42, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  activeMode: { backgroundColor: colors.forest },
  modeText: { ...typography.bodyStrong, color: colors.forestDark },
  activeModeText: { color: colors.white },
  dial: { width: 276, height: 276, borderRadius: 138, backgroundColor: colors.sage, position: "relative", alignItems: "center", justifyContent: "center" },
  hand: { position: "absolute", width: 3, height: 94, backgroundColor: colors.forest, bottom: 138, left: 136.5, transformOrigin: "bottom" },
  centerDot: { width: 16, height: 16, borderRadius: 8, backgroundColor: colors.forest, position: "absolute", left: 130, top: 130, zIndex: 2 },
  clockValue: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", position: "absolute" },
  selectedClockValue: { backgroundColor: colors.forest },
  clockText: { color: colors.ink, fontSize: 15, fontWeight: "800" },
  selectedClockText: { color: colors.white },
  meridiem: { flexDirection: "row", gap: 8, marginTop: 18 },
  period: { minWidth: 70, minHeight: 44, borderRadius: 12, borderWidth: 1.5, borderColor: colors.borderStrong, alignItems: "center", justifyContent: "center", backgroundColor: colors.white },
  activePeriod: { backgroundColor: colors.forest, borderColor: colors.forest },
  periodText: { ...typography.bodyStrong, color: colors.forestDark },
  activePeriodText: { color: colors.white },
  hint: { ...typography.small, color: colors.gray, marginVertical: 14 },
});
