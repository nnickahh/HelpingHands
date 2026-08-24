import { router } from "expo-router";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { AppScreen } from "../../components/layout/AppScreen";
import { BackHeader } from "../../components/layout/BackHeader";
import { RequestCard } from "../../components/help/RequestCard";
import { WireButton } from "../../components/ui/WireButton";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { useApp } from "../../state/AppProvider";
import { acceptSharedRequest, listPendingRequests, rejectSharedRequest, type SharedRequest } from "../../services/requests";

function getCategoryIcon(cat: string): "shopping-basket" | "local-pharmacy" | "event" | "smartphone" | "inventory-2" | "accessible" {
  switch (cat?.toLowerCase()) {
    case "groceries": return "shopping-basket";
    case "medicine": return "local-pharmacy";
    case "appointment": return "event";
    case "digital help": return "smartphone";
    case "carrying": return "inventory-2";
    case "accompany": return "accessible";
    default: return "shopping-basket";
  }
}

export default function RequestsScreen() {
  const { account, acceptRequest, setRequestDraft, setCategory, setRequestStatus } = useApp();
  const [requests, setRequests] = useState<SharedRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const token = account.authAccessToken || "mock-access-token";

  const loadRequests = () => {
    void listPendingRequests(token)
      .then((loaded) => {
        setRequests(loaded);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadRequests();
    const timer = setInterval(loadRequests, 3000);
    return () => clearInterval(timer);
  }, [token]);

  const handleAccept = (req: SharedRequest) => {
    const volEmail = account.email || "volunteer@helpinghands.sg";
    const volName = account.name || "Volunteer";
    const volPhone = account.phone || "91234567";

    void acceptSharedRequest(token, req.id, { email: volEmail, name: volName, phone: volPhone })
      .then((accepted) => {
        if (!accepted) {
          Alert.alert("Request already taken", "Another volunteer accepted this request first.");
          loadRequests();
          return;
        }

        // Set all relevant details in AppProvider
        setRequestDraft({
          sharedRequestId: req.id,
          scheduledAt: req.scheduled_at,
          displayDate: req.display_date,
          displayTime: req.display_time,
          address: req.address,
          notes: req.notes,
        });
        setCategory(req.category);
        acceptRequest({ name: volName, phone: volPhone });
        setRequestStatus("accepted");

        router.push("/volunteer/task");
      })
      .catch(() => {
        Alert.alert("Unable to accept request", "Check your connection and try again.");
      });
  };

  const handleDecline = (req: SharedRequest) => {
    Alert.alert(
      "Decline request?",
      `Are you sure you want to decline this ${req.category.toLowerCase()} request from ${req.elder_name}?`,
      [
        { text: "Keep", style: "cancel" },
        {
          text: "Decline / Reject",
          style: "destructive",
          onPress: () => {
            void rejectSharedRequest(token, req.id);
            setRequests((prev) => prev.filter((item) => item.id !== req.id));
            Alert.alert("Task declined", "This request has been removed from your available tasks.");
          },
        },
      ]
    );
  };

  return (
    <AppScreen tone="oat">
      <BackHeader title="Available requests" eyebrow="Volunteer portal" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Community assistance requests</Text>
        <Text style={styles.intro}>
          Review open requests in your area. Accept a task to coordinate with the elder directly or decline to view others.
        </Text>

        {requests.length > 0 ? (
          requests.map((req) => {
            const formattedDetails = `${req.display_date || "Date TBC"} · ${req.display_time || "Time TBC"} · ${req.address?.area || "Singapore"}`;
            const badgeLabel = req.is_elder_created ? "⭐ Live Request from Elder" : "Community Request";

            return (
              <RequestCard
                key={req.id}
                icon={getCategoryIcon(req.category)}
                title={`${req.category} assistance`}
                elderName={req.elder_name}
                details={formattedDetails}
                notes={req.notes}
                badge={badgeLabel}
                isElderCreated={Boolean(req.is_elder_created)}
                onAccept={() => handleAccept(req)}
                onDecline={() => handleDecline(req)}
                declineLabel="Decline"
              />
            );
          })
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No open requests right now</Text>
            <Text style={styles.emptyCopy}>
              All current tasks have been accepted or completed. New assistance requests from elders will appear here automatically.
            </Text>
            <WireButton label="Check for new requests" outline onPress={loadRequests} style={styles.refreshBtn} />
          </View>
        )}
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: { backgroundColor: colors.oat, padding: 24, paddingBottom: 40 },
  heading: { ...typography.title, color: colors.ink, marginTop: 12 },
  intro: { ...typography.bodyText, color: colors.gray, marginTop: 6, marginBottom: 20, lineHeight: 20 },
  emptyContainer: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  emptyTitle: { ...typography.bodyStrong, color: colors.ink, fontSize: 16, marginBottom: 6 },
  emptyCopy: { ...typography.bodyText, color: colors.gray, textAlign: "center", marginBottom: 16, lineHeight: 20 },
  refreshBtn: { minWidth: 200 },
});
