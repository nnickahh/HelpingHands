import { router } from "expo-router";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { AppScreen } from "../../components/layout/AppScreen";
import { BackHeader } from "../../components/layout/BackHeader";
import { Surface } from "../../components/ui/Surface";
import { WireButton } from "../../components/ui/WireButton";
import { useApp } from "../../state/AppProvider";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

function statusLabel(status: "pending" | "approved" | "rejected") {
  return status === "pending" ? "Pending review" : status === "approved" ? "Approved" : "Rejected";
}

export default function AdminDashboardScreen() {
  const {
    isAdminLoggedIn,
    adminLogout,
    adminVolunteers,
    reviewVolunteer,
    adminUsers,
    toggleUserStatus,
    urgentReports,
    feedback,
    resolveUrgentReport,
    resolveFeedback,
    requestStatus,
  } = useApp();

  if (!isAdminLoggedIn) {
    router.replace("/admin/login");
    return null;
  }

  const visibleVolunteers = adminVolunteers.filter((volunteer) => volunteer.showInAdmin);
  const pendingVolunteers = visibleVolunteers.filter((volunteer) => volunteer.status === "pending");

  const approveVolunteer = (id: string, name: string) => {
    reviewVolunteer(id, "approved");
    Alert.alert("Volunteer approved", `${name} can now browse assistance requests.`);
  };

  const rejectVolunteer = (id: string, name: string) => {
    reviewVolunteer(id, "rejected");
    Alert.alert("Volunteer rejected", `${name} cannot accept assistance requests.`);
  };

  const logout = () => {
    adminLogout();
    router.replace("/admin/login");
  };

  return (
    <AppScreen tone="oat">
      <BackHeader title="Administrator dashboard" eyebrow="EAMS control panel" />
      <View style={styles.content}>
        <View style={styles.summaryRow}>
          <Surface style={styles.summary}><Text style={styles.summaryNumber}>{pendingVolunteers.length}</Text><Text style={styles.summaryLabel}>ID reviews</Text></Surface>
          <Surface style={styles.summary}><Text style={styles.summaryNumber}>{urgentReports.length}</Text><Text style={styles.summaryLabel}>Urgent reports</Text></Surface>
          <Surface style={styles.summary}><Text style={styles.summaryNumber}>{feedback.length}</Text><Text style={styles.summaryLabel}>Feedback</Text></Surface>
        </View>

        <Text style={styles.sectionTitle}>Volunteer identity verification</Text>
        {visibleVolunteers.map((volunteer) => (
          <Surface key={volunteer.id} style={styles.item}>
            <View style={styles.itemHeader}>
              <View style={styles.itemCopy}><Text style={styles.itemTitle}>{volunteer.name}</Text><Text style={styles.itemDetails}>{volunteer.email} · {volunteer.area}</Text></View>
              <Text style={[styles.status, volunteer.status === "pending" ? styles.pending : volunteer.status === "approved" ? styles.approved : styles.rejected]}>{statusLabel(volunteer.status)}</Text>
            </View>
            {volunteer.status === "pending" ? (
              <View style={styles.actions}>
                <WireButton label="Approve" onPress={() => approveVolunteer(volunteer.id, volunteer.name)} />
                <WireButton label="Reject" outline destructive onPress={() => rejectVolunteer(volunteer.id, volunteer.name)} />
              </View>
            ) : null}
          </Surface>
        ))}

        <Text style={styles.sectionTitle}>Active assistance request</Text>
        <Surface style={styles.item}>
          <View style={styles.itemHeader}><View style={styles.itemCopy}><Text style={styles.itemTitle}>Current request status</Text><Text style={styles.itemDetails}>Monitor the live request lifecycle.</Text></View><Text style={styles.status}>{requestStatus}</Text></View>
        </Surface>

        <Text style={styles.sectionTitle}>App users</Text>
        {adminUsers.filter((user) => user.showInAdmin).map((user) => (
          <Surface key={user.id} style={styles.item}>
            <View style={styles.itemHeader}>
              <View style={styles.itemCopy}><Text style={styles.itemTitle}>{user.name}</Text><Text style={styles.itemDetails}>{user.role === "elder" ? "Elderly user" : "Volunteer"}</Text></View>
              <Text style={[styles.status, user.status === "active" ? styles.approved : styles.rejected]}>{user.status}</Text>
            </View>
            <Pressable onPress={() => toggleUserStatus(user.id)}><Text style={styles.resolve}>{user.status === "active" ? "Suspend user" : "Restore user"}</Text></Pressable>
          </Surface>
        ))}

        <Text style={styles.sectionTitle}>Urgent safety reports</Text>
        {urgentReports.length === 0 ? <Text style={styles.empty}>No unresolved safety reports.</Text> : urgentReports.map((report, index) => (
          <Surface key={`${report}-${index}`} style={styles.item}><Text style={styles.itemTitle}>Safety report</Text><Text style={styles.itemDetails}>{report}</Text><Pressable onPress={() => resolveUrgentReport(index)}><Text style={styles.resolve}>Mark resolved</Text></Pressable></Surface>
        ))}

        <Text style={styles.sectionTitle}>App feedback and complaints</Text>
        {feedback.length === 0 ? <Text style={styles.empty}>No unresolved feedback.</Text> : feedback.map((message, index) => (
          <Surface key={`${message}-${index}`} style={styles.item}><Text style={styles.itemTitle}>User feedback</Text><Text style={styles.itemDetails}>{message}</Text><Pressable onPress={() => resolveFeedback(index)}><Text style={styles.resolve}>Mark reviewed</Text></Pressable></Surface>
        ))}

        <WireButton label="Log out administrator" outline onPress={logout} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 18 },
  summaryRow: { flexDirection: "row", gap: 8, marginBottom: 22 },
  summary: { flex: 1, padding: 10, alignItems: "center" },
  summaryNumber: { ...typography.title, color: colors.ink },
  summaryLabel: { ...typography.small, color: colors.gray, textAlign: "center", marginTop: 3 },
  sectionTitle: { ...typography.heading, color: colors.ink, borderTopWidth: 1, borderTopColor: colors.ink, paddingTop: 14, marginTop: 8, marginBottom: 10 },
  item: { padding: 14, marginBottom: 10 },
  itemHeader: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  itemCopy: { flex: 1 },
  itemTitle: { ...typography.bodyStrong, color: colors.ink },
  itemDetails: { ...typography.small, color: colors.gray, marginTop: 4 },
  status: { ...typography.label, color: colors.ink, textTransform: "uppercase", textAlign: "right" },
  pending: { color: colors.marigold },
  approved: { color: colors.success },
  rejected: { color: colors.coral },
  actions: { flexDirection: "row", gap: 8, marginTop: 14 },
  empty: { ...typography.small, color: colors.gray, marginBottom: 16 },
  resolve: { ...typography.small, color: colors.ink, textDecorationLine: "underline", marginTop: 12 },
});
