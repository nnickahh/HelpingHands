import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { ImagePlaceholder } from "../ui/ImagePlaceholder";
import { WireButton } from "../ui/WireButton";

type Props = {
  icon: "shopping-basket" | "local-pharmacy" | "event" | "smartphone" | "inventory-2" | "accessible";
  title: string;
  details: string;
  elderName?: string;
  notes?: string;
  badge?: string;
  isElderCreated?: boolean;
  onAccept: () => void;
  onDecline?: () => void;
  declineLabel?: string;
};

export function RequestCard({
  icon,
  title,
  details,
  elderName,
  notes,
  badge,
  isElderCreated,
  onAccept,
  onDecline,
  declineLabel = "Decline",
}: Props) {
  return (
    <View style={[styles.card, isElderCreated && styles.elderCard]}>
      {badge ? (
        <View style={[styles.badgeContainer, isElderCreated ? styles.elderBadgeContainer : styles.mockBadgeContainer]}>
          <Text style={[styles.badgeText, isElderCreated ? styles.elderBadgeText : styles.mockBadgeText]}>
            {badge}
          </Text>
        </View>
      ) : null}

      <View style={styles.top}>
        <ImagePlaceholder width={58} height={58} icon={icon} />
        <View style={styles.copy}>
          <Text style={styles.title}>{title}</Text>
          {elderName ? <Text style={styles.elderName}>Elder: {elderName}</Text> : null}
          <Text style={styles.details}>{details}</Text>
        </View>
      </View>

      {notes ? (
        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>Notes / Instructions:</Text>
          <Text style={styles.notesText}>{notes}</Text>
        </View>
      ) : null}

      <View style={styles.action}>
        <WireButton label="Accept task" onPress={onAccept} style={styles.btn} />
        <WireButton label={declineLabel} outline destructive onPress={onDecline ?? (() => undefined)} style={styles.btn} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.oat,
    borderWidth: 1,
    borderColor: colors.ink,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  elderCard: {
    borderColor: colors.forest,
    borderWidth: 2,
    backgroundColor: colors.sageSoft,
  },
  badgeContainer: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 10,
  },
  elderBadgeContainer: {
    backgroundColor: colors.forestDark,
  },
  mockBadgeContainer: {
    backgroundColor: colors.sand,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  elderBadgeText: {
    color: colors.white,
  },
  mockBadgeText: {
    color: colors.forestDark,
  },
  top: {
    flexDirection: "row",
    gap: 13,
    alignItems: "center",
  },
  copy: {
    flex: 1,
  },
  title: {
    ...typography.bodyStrong,
    color: colors.ink,
    fontSize: 16,
    marginBottom: 3,
  },
  elderName: {
    ...typography.small,
    color: colors.forestDark,
    fontWeight: "700",
    marginBottom: 2,
  },
  details: {
    ...typography.small,
    color: colors.gray,
    lineHeight: 18,
  },
  notesContainer: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  notesLabel: {
    ...typography.label,
    color: colors.muted,
    textTransform: "uppercase",
    fontSize: 11,
    marginBottom: 2,
  },
  notesText: {
    ...typography.small,
    color: colors.ink,
    lineHeight: 18,
  },
  action: {
    flexDirection: "row",
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 14,
    paddingTop: 14,
    alignItems: "stretch",
  },
  btn: {
    flex: 1,
  },
});
