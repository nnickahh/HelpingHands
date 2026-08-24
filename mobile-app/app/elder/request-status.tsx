import { router } from "expo-router";
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { AppScreen } from "../../components/layout/AppScreen";
import { BackHeader } from "../../components/layout/BackHeader";
import { VolunteerCard } from "../../components/help/VolunteerCard";
import { Divider } from "../../components/ui/Divider";
import { Steps } from "../../components/ui/Steps";
import { WireButton } from "../../components/ui/WireButton";
import { WireInput } from "../../components/ui/WireInput";
import { Surface } from "../../components/ui/Surface";
import { Icon } from "../../components/ui/Icon";
import { DateTimeField } from "../../components/request/DateTimeField";
import { useApp } from "../../state/AppProvider";
import { getSharedRequest, updateSharedRequest } from "../../services/requests";
import { useEffect, useState } from "react";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { openPhoneContact } from "../../services/contact";
import { mockVolunteer } from "../../data/mockData";

const statuses = ["pending", "accepted", "inProgress", "done"] as const;

const singaporeFormatter = new Intl.DateTimeFormat("en-SG", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Singapore",
});

const timeFormatter = new Intl.DateTimeFormat("en-SG", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: "Asia/Singapore",
});

function singaporeDateTime(date: Date, time: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Singapore",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  return `${year}-${month}-${day}T${String(time.getHours()).padStart(2, "0")}:${String(time.getMinutes()).padStart(2, "0")}:00+08:00`;
}

export default function RequestStatusScreen() {
  const { account, requestStatus, setRequestStatus, requestDraft, setRequestDraft, matchedVolunteer } = useApp();
  const [syncedVolunteer, setSyncedVolunteer] = useState(matchedVolunteer);

  // Reschedule modal state
  const [rescheduleVisible, setRescheduleVisible] = useState(false);
  const [newDate, setNewDate] = useState<Date | null>(requestDraft.scheduledAt ? new Date(requestDraft.scheduledAt) : new Date());
  const [newTime, setNewTime] = useState<Date | null>(requestDraft.scheduledAt ? new Date(requestDraft.scheduledAt) : new Date());
  const [rescheduleNotes, setRescheduleNotes] = useState(requestDraft.notes ?? "");
  const [rescheduleError, setRescheduleError] = useState("");

  useEffect(() => {
    if (!account.authAccessToken || !requestDraft.sharedRequestId) return;
    const load = () => void getSharedRequest(account.authAccessToken!, requestDraft.sharedRequestId!).then((request) => {
      if (!request) return;
      setRequestStatus(request.status);
      if (request.volunteer_name) setSyncedVolunteer({ name: request.volunteer_name, phone: request.volunteer_phone ?? "" });
    }).catch(() => undefined);
    load();
    const timer = setInterval(load, 4000);
    return () => clearInterval(timer);
  }, [account.authAccessToken, requestDraft.sharedRequestId, setRequestStatus]);

  const visibleVolunteer = syncedVolunteer ?? matchedVolunteer ?? { name: mockVolunteer.name, phone: mockVolunteer.phone };
  const active = requestStatus === "cancelled" || requestStatus === "rejected" ? 0 : Math.max(0, statuses.indexOf(requestStatus));

  const reportUrgentIssue = () => Alert.alert("Urgent safety issue", "If anyone is in immediate danger, call 999. HelpingHands support will be notified about this request.");
  const openHelp = () => Alert.alert("General help and support", "For account or request support, contact the HelpingHands administrator.");

  const handleCallVolunteer = async () => {
    const phone = visibleVolunteer?.phone ?? null;
    if (!phone) {
      Alert.alert("No volunteer yet", "No volunteer contact is available.");
      return;
    }
    if (!(await openPhoneContact(phone, "call"))) Alert.alert("Unable to call", "Your device cannot open the phone dialer right now.");
  };

  const handleMessageVolunteer = async () => {
    router.push("/elder/volunteer-chat");
  };

  const openRescheduleModal = () => {
    setNewDate(requestDraft.scheduledAt ? new Date(requestDraft.scheduledAt) : new Date());
    setNewTime(requestDraft.scheduledAt ? new Date(requestDraft.scheduledAt) : new Date());
    setRescheduleNotes(requestDraft.notes ?? "");
    setRescheduleError("");
    setRescheduleVisible(true);
  };

  const handleConfirmReschedule = () => {
    if (!newDate || !newTime) {
      setRescheduleError("Please select both a date and a time to reschedule.");
      return;
    }

    const scheduledAt = singaporeDateTime(newDate, newTime);
    const displayDate = singaporeFormatter.format(newDate);
    const displayTime = timeFormatter.format(newTime);
    const updatedNotes = rescheduleNotes.trim();

    // Update in local state and set status back to pending
    setRequestDraft({
      scheduledAt,
      displayDate,
      displayTime,
      notes: updatedNotes,
    });
    setRequestStatus("pending");

    // Update in shared requests / backend
    if (requestDraft.sharedRequestId) {
      const token = account.authAccessToken || "mock-access-token";
      void updateSharedRequest(token, requestDraft.sharedRequestId, {
        scheduled_at: scheduledAt,
        display_date: displayDate,
        display_time: displayTime,
        notes: updatedNotes,
        status: "pending",
      });
    }

    setRescheduleVisible(false);
    Alert.alert(
      "Request rescheduled",
      `Your help request has been updated to ${displayDate} at ${displayTime}. Your volunteer will see the updated schedule.`
    );
  };

  return (
    <AppScreen tone="oat">
      <BackHeader title="Request status" eyebrow="Your help request" />
      <View style={styles.canvas}>
        <Steps items={["Pending", "Accepted", "In progress", "Done"]} active={active} />
        <View style={styles.content}>
          {requestStatus === "cancelled" || requestStatus === "rejected" ? (
            <Surface tone="sand" style={styles.match}>
              <Text style={styles.check}>!</Text>
              <View style={styles.matchCopy}>
                <Text style={styles.matchTitle}>{requestStatus === "rejected" ? "Request declined" : "Request cancelled"}</Text>
                <Text style={styles.details}>
                  {requestStatus === "rejected"
                    ? "The volunteer was unable to take this request. Tap Reschedule to choose a new time."
                    : "This request is no longer active."}
                </Text>
              </View>
            </Surface>
          ) : (
            <Surface tone="sage" style={styles.match}>
              <Text style={styles.check}>✓</Text>
              <View style={styles.matchCopy}>
                <Text style={styles.matchTitle}>{requestStatus === "pending" ? "Request submitted" : "Volunteer matched"}</Text>
                <Text style={styles.details}>{requestDraft.displayDate || "Date to be confirmed"} {requestDraft.displayTime ? `· ${requestDraft.displayTime}` : ""}</Text>
              </View>
            </Surface>
          )}
          <Surface style={styles.schedule}>
            <View style={styles.scheduleRow}>
              <Icon name="event" size={23} color={colors.forest} label="Scheduled date" />
              <View>
                <Text style={styles.scheduleLabel}>Scheduled for</Text>
                <Text style={styles.scheduleValue}>{requestDraft.displayDate || "Date to be confirmed"}</Text>
              </View>
            </View>
            <View style={styles.scheduleRow}>
              <Icon name="schedule" size={23} color={colors.forest} label="Scheduled time" />
              <View>
                <Text style={styles.scheduleLabel}>Time</Text>
                <Text style={styles.scheduleValue}>{requestDraft.displayTime || "Time to be confirmed"} · Singapore time</Text>
              </View>
            </View>
            <View style={styles.scheduleRow}>
              <Icon name="location-on" size={23} color={colors.forest} label="General location" />
              <View>
                <Text style={styles.scheduleLabel}>General location</Text>
                <Text style={styles.scheduleValue}>{requestDraft.address?.label || "Location to be confirmed"}</Text>
              </View>
            </View>
            {requestDraft.notes ? (
              <View style={styles.scheduleRow}>
                <Icon name="notes" size={23} color={colors.forest} label="Notes" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.scheduleLabel}>Notes</Text>
                  <Text style={styles.scheduleValue}>{requestDraft.notes}</Text>
                </View>
              </View>
            ) : null}
          </Surface>
          <Divider label="Your volunteer" />
          <VolunteerCard name={visibleVolunteer.name} rating={mockVolunteer.rating} onCall={handleCallVolunteer} onMessage={handleMessageVolunteer} />
          {requestStatus !== "cancelled" && requestStatus !== "done" ? (
            <View style={styles.actions}>
              <WireButton
                label="Cancel request"
                outline
                destructive
                style={styles.actionBtn}
                onPress={() =>
                  Alert.alert("Cancel request?", "This request can be cancelled before it begins.", [
                    { text: "Keep request", style: "cancel" },
                    { text: "Cancel request", style: "destructive", onPress: () => setRequestStatus("cancelled") },
                  ])
                }
              />
              <WireButton
                label="Reschedule"
                outline
                style={styles.actionBtn}
                onPress={openRescheduleModal}
              />
            </View>
          ) : requestStatus === "cancelled" ? (
            <View style={styles.actions}>
              <WireButton
                label="Reschedule / Re-open"
                style={styles.actionBtn}
                onPress={openRescheduleModal}
              />
            </View>
          ) : null}
          {requestStatus === "done" ? (
            <View style={styles.actions}>
              <WireButton
                label="Confirm task"
                style={styles.actionBtn}
                onPress={() => router.push("/elder/rating")}
              />
              <WireButton
                label="Report issue"
                outline
                destructive
                style={styles.actionBtn}
                onPress={reportUrgentIssue}
              />
            </View>
          ) : null}
          <WireButton label="Help and support" outline onPress={openHelp} />
          <Text style={styles.tip}>Your exact address is shared with the volunteer only after they accept your request.</Text>
        </View>
      </View>

      {/* Interactive Reschedule Modal */}
      <Modal visible={rescheduleVisible} animationType="slide" transparent onRequestClose={() => setRescheduleVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Reschedule request</Text>
                <Pressable onPress={() => setRescheduleVisible(false)} hitSlop={10} accessibilityLabel="Close reschedule">
                  <Text style={styles.modalCloseText}>✕</Text>
                </Pressable>
              </View>
              <Text style={styles.modalSubtitle}>
                Select a new date and time for your assistance session. Your volunteer will be notified immediately.
              </Text>

              <View style={styles.modalPickerRow}>
                <View style={styles.half}>
                  <DateTimeField
                    label="New date"
                    mode="date"
                    value={newDate}
                    onChange={(date) => {
                      setNewDate(date);
                      setNewTime((current) => current ? new Date(date.getFullYear(), date.getMonth(), date.getDate(), current.getHours(), current.getMinutes()) : null);
                      setRescheduleError("");
                    }}
                    onTimeChange={(time) => setNewTime(time)}
                  />
                </View>
                <View style={styles.half}>
                  <DateTimeField
                    label="New time"
                    mode="time"
                    value={newTime}
                    onChange={(time) => {
                      setNewTime(time);
                      setRescheduleError("");
                    }}
                  />
                </View>
              </View>

              <WireInput
                label="Update notes or details (optional)"
                placeholder="Add any additional notes for the volunteer"
                multiline
                numberOfLines={3}
                value={rescheduleNotes}
                onChangeText={setRescheduleNotes}
                style={styles.modalNotes}
              />

              {rescheduleError ? <Text style={styles.modalError}>{rescheduleError}</Text> : null}

              <View style={styles.modalActions}>
                <WireButton label="Confirm reschedule" onPress={handleConfirmReschedule} />
                <WireButton label="Cancel" outline onPress={() => setRescheduleVisible(false)} />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  canvas: { backgroundColor: colors.oat, flex: 1 },
  content: { padding: 24 },
  match: { flexDirection: "row", gap: 12, alignItems: "center" },
  check: { color: colors.forest, fontSize: 30, fontWeight: "800" },
  matchCopy: { flex: 1 },
  matchTitle: { color: colors.forestDark, ...typography.bodyStrong, marginBottom: 4 },
  details: { color: colors.gray, ...typography.small },
  schedule: { gap: 14, marginTop: 14 },
  scheduleRow: { flexDirection: "row", gap: 12, alignItems: "center" },
  scheduleLabel: { ...typography.label, color: colors.muted, textTransform: "uppercase", marginBottom: 2 },
  scheduleValue: { ...typography.bodyText, color: colors.ink },
  actions: { flexDirection: "row", gap: 10, width: "100%", marginBottom: 0 },
  actionBtn: { flex: 1, minHeight: 48 },
  tip: { color: colors.gray, ...typography.small, textAlign: "center", marginTop: 6 },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: colors.oat,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    maxHeight: "85%",
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  modalTitle: {
    ...typography.title,
    color: colors.ink,
    fontSize: 20,
  },
  modalCloseText: {
    fontSize: 22,
    color: colors.gray,
    paddingHorizontal: 8,
  },
  modalSubtitle: {
    ...typography.bodyText,
    color: colors.gray,
    fontSize: 14,
    marginBottom: 18,
    lineHeight: 20,
  },
  modalPickerRow: {
    flexDirection: "row",
    gap: 10,
  },
  half: {
    flex: 1,
  },
  modalNotes: {
    minHeight: 80,
    borderRadius: 8,
    paddingTop: 10,
    textAlignVertical: "top",
    marginBottom: 14,
  },
  modalError: {
    color: colors.coral,
    ...typography.small,
    marginBottom: 12,
  },
  modalActions: {
    gap: 8,
    marginTop: 4,
    marginBottom: 16,
  },
});
