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
type Point = { x: number; y: number };

type DialOrigin = { x: number; y: number };

const DIAL_SIZE = 276;
const DIAL_CENTER: Point = { x: DIAL_SIZE / 2, y: DIAL_SIZE / 2 };
const MARK_RADIUS = 103;
const STEP_SIZE = 30;

function displayHour(hour: number) {
  return hour % 12 || 12;
}

function formatTime(hour: number, minute: number, meridiem = hour >= 12 ? "PM" : "AM") {
  return `${displayHour(hour)}:${String(minute).padStart(2, "0")} ${meridiem}`;
}

function angleFromWindowPoint(point: Point, center: Point) {
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  return ((Math.atan2(dy, dx) * 180) / Math.PI + 90 + 360) % 360;
}

function normalizeAngle(angle: number) {
  return ((angle % 360) + 360) % 360;
}

function valueFromAngle(angle: number, mode: Mode) {
  const normalized = normalizeAngle(angle);

  if (mode === "hour") {
    const step = Math.floor((normalized + 15) / STEP_SIZE) % 12;
    return step === 0 ? 12 : step;
  }

  const step = Math.floor((normalized + 15) / STEP_SIZE) % 12;
  return (step * 5) % 60;
}

function valueToAngle(mode: Mode, value: number) {
  if (mode === "hour") return (displayHour(value) % 12) * 30;
  return (Math.floor(value / 5) % 12) * 30;
}

export function ClockDial({ visible, initialDate, onClose, onDone }: Props) {
  const [mode, setMode] = useState<Mode>("hour");
  const [hour, setHour] = useState(initialDate.getHours() % 12 || 12);
  const [minute, setMinute] = useState(Math.round(initialDate.getMinutes() / 5) * 5 % 60);
  const [meridiem, setMeridiem] = useState(initialDate.getHours() >= 12 ? "PM" : "AM");
  const [dialOrigin, setDialOrigin] = useState<DialOrigin>({ x: 0, y: 0 });
  const [dialCenter, setDialCenter] = useState<Point>({ x: DIAL_SIZE / 2, y: DIAL_SIZE / 2 });
  const dialRef = useRef<View>(null);

  useEffect(() => {
    if (!visible) return;
    const nextHour = initialDate.getHours();
    setMode("hour");
    setHour(nextHour % 12 || 12);
    setMinute(Math.round(initialDate.getMinutes() / 5) * 5 % 60);
    setMeridiem(nextHour >= 12 ? "PM" : "AM");

    if (dialRef.current) {
      dialRef.current.measureInWindow((x, y, width, height) => {
        setDialOrigin({ x, y });
        setDialCenter({ x: x + width / 2, y: y + height / 2 });
      });
    }
  }, [visible, initialDate]);

  const updateFromTouch = (pageX: number, pageY: number) => {
    const nextAngle = angleFromWindowPoint({ x: pageX, y: pageY }, dialCenter);
    const nextValue = valueFromAngle(nextAngle, mode);

    if (mode === "hour") {
      setHour(nextValue);
      return;
    }

    setMinute(nextValue);
  };

  const responder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (event) => updateFromTouch(event.nativeEvent.pageX, event.nativeEvent.pageY),
        onPanResponderMove: (event) => updateFromTouch(event.nativeEvent.pageX, event.nativeEvent.pageY),
        onPanResponderRelease: () => {
          if (mode === "hour") {
            setMode("minute");
          }
        },
      }),
    [mode, dialCenter],
  );

  const values = mode === "hour" ? [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] : Array.from({ length: 12 }, (_, index) => index * 5);
  const selectedValue = mode === "hour" ? displayHour(hour) : minute;
  const handAngle = valueToAngle(mode, selectedValue);

  const finish = () => {
    const next = new Date(initialDate);
    const hourValue = hour === 12 ? 0 : hour;
    const selectedHour = meridiem === "PM" ? hourValue + 12 : hourValue;
    next.setHours(selectedHour, minute, 0, 0);
    onDone(next);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>Choose a time</Text>
              <Text style={styles.title}>{formatTime(hour + (meridiem === "PM" && hour !== 12 ? 12 : 0), minute, meridiem)}</Text>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel="Close clock" onPress={onClose} style={styles.close}>
              <Icon name="close" size={24} color={colors.ink} />
            </Pressable>
          </View>

          <View style={styles.modeRow}>
            <Pressable accessibilityRole="button" accessibilityState={{ selected: mode === "hour" }} onPress={() => setMode("hour")} style={[styles.mode, mode === "hour" && styles.activeMode]}>
              <Text style={[styles.modeText, mode === "hour" && styles.activeModeText]}>Hour</Text>
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityState={{ selected: mode === "minute" }} onPress={() => setMode("minute")} style={[styles.mode, mode === "minute" && styles.activeMode]}>
              <Text style={[styles.modeText, mode === "minute" && styles.activeModeText]}>Minutes</Text>
            </Pressable>
          </View>

          <View ref={dialRef} style={styles.dial} {...responder.panHandlers}>
            <View style={[styles.hand, { transform: [{ rotate: `${handAngle}deg` }] }]} />
            <View style={styles.centerDot} />
            {values.map((value, index) => {
              const angle = (index * 30 - 90) * Math.PI / 180;
              const left = DIAL_CENTER.x + Math.cos(angle) * MARK_RADIUS - 24;
              const top = DIAL_CENTER.y + Math.sin(angle) * MARK_RADIUS - 24;
              const selected = value === selectedValue;

              return (
                <Pressable
                  key={String(value)}
                  accessibilityRole="button"
                  accessibilityLabel={mode === "hour" ? `${value} o'clock` : `${value} minutes`}
                  accessibilityState={{ selected }}
                  onPress={() => (mode === "hour" ? setHour(value) : setMinute(value))}
                  style={[styles.clockValue, { left, top }, selected && styles.selectedClockValue]}
                >
                  <Text style={[styles.clockText, selected && styles.selectedClockText]}>{mode === "minute" ? String(value).padStart(2, "0") : value}</Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.meridiem}>
            <Pressable accessibilityRole="button" accessibilityState={{ selected: meridiem === "AM" }} onPress={() => setMeridiem("AM")} style={[styles.period, meridiem === "AM" && styles.activePeriod]}>
              <Text style={[styles.periodText, meridiem === "AM" && styles.activePeriodText]}>AM</Text>
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityState={{ selected: meridiem === "PM" }} onPress={() => setMeridiem("PM")} style={[styles.period, meridiem === "PM" && styles.activePeriod]}>
              <Text style={[styles.periodText, meridiem === "PM" && styles.activePeriodText]}>PM</Text>
            </Pressable>
          </View>

          <Text style={styles.hint}>{mode === "hour" ? "Drag the hand or tap an hour" : "Drag the hand or tap five-minute intervals"}</Text>
          <WireButton label="Use this time" onPress={finish} />
        </View>
      </View>
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
  dial: { width: DIAL_SIZE, height: DIAL_SIZE, borderRadius: DIAL_SIZE / 2, backgroundColor: colors.sage, position: "relative", alignItems: "center", justifyContent: "center" },
  hand: { position: "absolute", width: 4, height: 92, backgroundColor: colors.forest, left: "50%", top: "50%", marginLeft: -2, marginTop: -92, borderRadius: 999, transformOrigin: "center bottom" },
  centerDot: { width: 18, height: 18, borderRadius: 9, backgroundColor: colors.forest, position: "absolute", left: "50%", top: "50%", marginLeft: -9, marginTop: -9, zIndex: 2 },
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
