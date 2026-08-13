import { router } from "expo-router";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { AppScreen } from "../../components/layout/AppScreen";
import { BackHeader } from "../../components/layout/BackHeader";
import { AvatarPlaceholder } from "../../components/ui/AvatarPlaceholder";
import { Divider } from "../../components/ui/Divider";
import { WireButton } from "../../components/ui/WireButton";
import { WireInput } from "../../components/ui/WireInput";
import { useApp } from "../../state/AppProvider";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

export default function RatingScreen() {
  const { rating, setRating, setRequestStatus } = useApp();
  return (
    <AppScreen tone="oat">
      <BackHeader title="Rate your volunteer" eyebrow="One last step" />
      <View style={styles.content}>
        <AvatarPlaceholder size={100} />
        <Text style={styles.name}>Ben Lim Wei Jie</Text>
        <Text style={styles.details}>Grocery assistance · Wed, 10:00 AM</Text>
        <Divider label="How did it go?" />
        <View style={styles.stars}>{[1, 2, 3, 4, 5].map((value) => <Pressable key={value} accessibilityRole="button" accessibilityLabel={`${value} star${value === 1 ? "" : "s"}`} accessibilityState={{ selected: value === rating }} onPress={() => setRating(value)} hitSlop={8}><Text style={[styles.star, value <= rating ? styles.selectedStar : styles.unselectedStar]}>{value <= rating ? "★" : "☆"}</Text></Pressable>)}</View>
        <Text style={styles.ratingHint}>{rating} out of 5 stars</Text>
        <View style={styles.comment}><WireInput label="Leave a comment (optional)" placeholder="Tell us what went well" multiline numberOfLines={4} style={styles.commentInput} /></View>
        <WireButton label="Submit rating" onPress={() => { setRequestStatus("done"); Alert.alert("Thank you", "Your rating has been submitted.", [{ text: "Done", onPress: () => router.replace("/elder/account-setup") }]); }} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: { alignItems: "center", padding: 24 },
  name: { color: colors.ink, ...typography.heading, marginTop: 12 },
  details: { color: colors.gray, ...typography.small, marginTop: 5 },
  stars: { flexDirection: "row", gap: 9, marginTop: 10 },
  star: { fontSize: 42, lineHeight: 48 },
  selectedStar: { color: colors.marigold },
  unselectedStar: { color: colors.borderStrong },
  ratingHint: { color: colors.marigold, ...typography.bodyStrong, marginBottom: 22 },
  comment: { width: "100%" },
  commentInput: { minHeight: 112, borderRadius: 14, paddingTop: 14, textAlignVertical: "top" },
});
