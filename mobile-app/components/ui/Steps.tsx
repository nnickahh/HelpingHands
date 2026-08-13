import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { Icon } from "./Icon";

type Props = { items: string[]; active: number; onStepPress?: (index: number) => void };

export function Steps({ items, active, onStepPress }: Props) {
  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View key={item} style={styles.stepWrap}>
          <Pressable accessibilityRole={onStepPress ? "button" : undefined} accessibilityLabel={`${item}, step ${index + 1} of ${items.length}`} accessibilityState={onStepPress ? { selected: index === active } : undefined} disabled={!onStepPress} onPress={() => onStepPress?.(index)} style={styles.stepBody}>
            <View style={[styles.circle, index <= active ? styles.activeCircle : styles.inactiveCircle]}>
              {index < active ? <Icon name="check" size={18} color={colors.white} /> : <Text style={[styles.number, index === active ? styles.activeText : styles.inactiveText]}>{index + 1}</Text>}
            </View>
            <Text style={[styles.label, index <= active && styles.activeLabel]}>{item}</Text>
          </Pressable>
          {index < items.length - 1 ? <View style={[styles.connector, index < active && styles.activeConnector]} /> : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "flex-start", paddingHorizontal: 16, paddingTop: 18, paddingBottom: 10 },
  stepWrap: { flex: 1, flexDirection: "row", alignItems: "center" },
  stepBody: { alignItems: "center", minWidth: 58 },
  circle: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center", borderWidth: 1.5 },
  activeCircle: { backgroundColor: colors.forest, borderColor: colors.forest },
  inactiveCircle: { backgroundColor: colors.white, borderColor: colors.borderStrong },
  number: { ...typography.small, fontWeight: "800" },
  activeText: { color: colors.white },
  inactiveText: { color: colors.muted },
  label: { ...typography.small, color: colors.muted, textAlign: "center", marginTop: 5 },
  activeLabel: { color: colors.forestDark, fontWeight: "800" },
  connector: { height: 2, backgroundColor: colors.border, flex: 1, marginHorizontal: 4, marginBottom: 20 },
  activeConnector: { backgroundColor: colors.forest },
});
