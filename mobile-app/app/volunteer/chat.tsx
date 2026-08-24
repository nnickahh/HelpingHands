import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { AppScreen } from "../../components/layout/AppScreen";
import { BackHeader } from "../../components/layout/BackHeader";
import { AvatarPlaceholder } from "../../components/ui/AvatarPlaceholder";
import { WireButton } from "../../components/ui/WireButton";
import { useApp } from "../../state/AppProvider";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

type ChatMessage = {
  id: string;
  text: string;
  from: "volunteer" | "elder";
  time: string;
};

function formatCurrentTime() {
  return new Intl.DateTimeFormat("en-SG", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Singapore",
  }).format(new Date());
}

/**
 * Conversational AI elder response engine
 * Simulates warm, natural responses from the elderly user to the volunteer.
 */
function generateElderReply(
  volunteerText: string,
  context: {
    elderName: string;
    volunteerName: string;
    category: string;
    locationLabel: string;
    scheduledTime: string;
    scheduledDate: string;
  }
): string {
  const query = volunteerText.trim().toLowerCase();
  const elder = context.elderName || "Mdm Maria Lim";
  const vol = context.volunteerName || "Volunteer";

  // 1. On the way / ETA
  if (
    query.includes("on the way") ||
    query.includes("coming") ||
    query.includes("reaching") ||
    query.includes("heading over") ||
    query.includes("eta") ||
    query.includes("10 min") ||
    query.includes("15 min") ||
    query.includes("20 min") ||
    query.includes("soon")
  ) {
    return `Thank you for letting me know, ${vol}! Take your time and travel safely. I'll be waiting at home.`;
  }

  // 2. Arrived / At the block / Door
  if (
    query.includes("arrived") ||
    query.includes("reached") ||
    query.includes("at your block") ||
    query.includes("lift lobby") ||
    query.includes("outside") ||
    query.includes("at the door") ||
    query.includes("gate")
  ) {
    return `Thank you so much! I am opening the wooden door now. Please ring the doorbell or knock!`;
  }

  // 3. Grocery / Items / Brand questions
  if (
    query.includes("brand") ||
    query.includes("grocery") ||
    query.includes("item") ||
    query.includes("substitute") ||
    query.includes("out of stock") ||
    query.includes("buy") ||
    query.includes("supermarket") ||
    query.includes("fairprice")
  ) {
    return `Any regular fresh brand is fine, thank you for checking! If the exact item is not available, any similar one is okay.`;
  }

  // 4. Medicine / Polyclinic
  if (
    query.includes("medicine") ||
    query.includes("medication") ||
    query.includes("polyclinic") ||
    query.includes("prescription") ||
    query.includes("collected") ||
    query.includes("pharmacy")
  ) {
    return `Thank you for picking it up! Please make sure to keep the receipt. I have the polyclinic card ready for you.`;
  }

  // 5. Greetings
  if (
    query === "hi" ||
    query === "hello" ||
    query === "hey" ||
    query.startsWith("hi ") ||
    query.startsWith("hello ") ||
    query.includes("good morning") ||
    query.includes("good afternoon") ||
    query.includes("good evening")
  ) {
    return `Hello ${vol}! Thank you for offering to help me today with my ${context.category.toLowerCase()}.`;
  }

  // 6. How are you / Well-being
  if (query.includes("how are you") || query.includes("how r u") || query.includes("feeling")) {
    return `I am doing well, thank you for asking! Resting comfortably at home.`;
  }

  // 7. Unit / Address details
  if (query.includes("unit") || query.includes("address") || query.includes("floor") || query.includes("level")) {
    return `My unit is ${context.locationLabel || "on the 6th floor"}. Just take Lift Lobby A.`;
  }

  // 8. Thank you / Nice words
  if (query.includes("thank") || query.includes("welcome") || query.includes("happy to help")) {
    return `Bless you for your kindness and heart to help seniors!`;
  }

  // 9. General default response
  return `Noted, thank you ${vol}! Looking forward to seeing you at ${context.scheduledTime || "our scheduled time"}.`;
}

const quickVolunteerPrompts = [
  "I am on the way!",
  "I have arrived at your block.",
  "Do you need any specific brand?",
  "I have collected your items.",
  "See you soon!",
];

export default function VolunteerChatScreen() {
  const { account, requestDraft, category, requestOwner } = useApp();
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const elderName = requestOwner?.name || "Mdm Maria Lim";
  const volunteerName = account.name || "Volunteer";

  const contextData = {
    elderName,
    volunteerName,
    category: category || "Groceries",
    locationLabel: requestDraft.address?.label || "Jurong East",
    scheduledTime: requestDraft.displayTime || "10:00 AM",
    scheduledDate: requestDraft.displayDate || "Today",
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      from: "elder",
      text: `Hello! Thank you for accepting my ${category.toLowerCase()} request. Please let me know when you are on the way!`,
      time: formatCurrentTime(),
    },
  ]);

  const sendTextMessage = (rawText: string) => {
    const text = rawText.trim();
    if (!text) return;

    const volMsg: ChatMessage = {
      id: `vol-${Date.now()}`,
      from: "volunteer",
      text,
      time: formatCurrentTime(),
    };

    setMessages((prev) => [...prev, volMsg]);
    setMessage("");
    setIsTyping(true);

    // Simulate realistic AI elder response delay (700ms)
    setTimeout(() => {
      const replyText = generateElderReply(text, contextData);
      const elderMsg: ChatMessage = {
        id: `elder-${Date.now()}`,
        from: "elder",
        text: replyText,
        time: formatCurrentTime(),
      };
      setMessages((prev) => [...prev, elderMsg]);
      setIsTyping(false);
    }, 700);
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, isTyping]);

  return (
    <AppScreen tone="oat">
      <BackHeader title="Message elder" eyebrow="Volunteer direct chat" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.screen}>
        {/* Elder Profile Header Card */}
        <View style={styles.person}>
          <AvatarPlaceholder size={52} />
          <View style={styles.personMeta}>
            <Text style={styles.name}>{elderName}</Text>
            <Text style={styles.status}>Requesting {category} assistance</Text>
            <Text style={styles.sessionMeta}>
              {requestDraft.displayDate || "Today"} · {requestDraft.displayTime || "Scheduled"} · {requestDraft.address?.area || "Singapore"}
            </Text>
          </View>
        </View>

        {/* Message Thread */}
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.messages}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((item) => (
            <View
              key={item.id}
              style={[
                styles.bubble,
                item.from === "volunteer" ? styles.volunteerBubble : styles.elderBubble,
              ]}
            >
              <Text
                style={[
                  styles.bubbleText,
                  item.from === "volunteer" ? styles.volunteerBubbleText : styles.elderBubbleText,
                ]}
              >
                {item.text}
              </Text>
              <Text
                style={[
                  styles.timestamp,
                  item.from === "volunteer" ? styles.volunteerTimestamp : styles.elderTimestamp,
                ]}
              >
                {item.time}
              </Text>
            </View>
          ))}

          {isTyping ? (
            <View style={[styles.bubble, styles.elderBubble, styles.typingBubble]}>
              <ActivityIndicator size="small" color={colors.forestDark} />
              <Text style={styles.typingText}>{elderName} is replying...</Text>
            </View>
          ) : null}
        </ScrollView>

        {/* Quick Suggestion Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickPromptsBar} contentContainerStyle={styles.quickPrompts}>
          {quickVolunteerPrompts.map((prompt) => (
            <Pressable
              key={prompt}
              onPress={() => sendTextMessage(prompt)}
              style={({ pressed }) => [styles.promptChip, pressed && styles.pressedChip]}
            >
              <Text style={styles.promptText}>{prompt}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Composer */}
        <View style={styles.composer}>
          <TextInput
            accessibilityLabel="Message elder"
            value={message}
            onChangeText={setMessage}
            onSubmitEditing={() => sendTextMessage(message)}
            placeholder="Type a message to the elder..."
            placeholderTextColor={colors.muted}
            style={styles.input}
            returnKeyType="send"
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Send message"
            onPress={() => sendTextMessage(message)}
            style={({ pressed }) => [styles.send, pressed && styles.sendPressed]}
          >
            <Text style={styles.sendText}>Send</Text>
          </Pressable>
        </View>

        <WireButton label="Back to active task" outline onPress={() => router.back()} />
      </KeyboardAvoidingView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 20 },
  person: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  personMeta: { flex: 1 },
  name: { ...typography.bodyStrong, color: colors.ink, fontSize: 16 },
  status: { ...typography.small, color: colors.forestDark, marginTop: 2, fontWeight: "600" },
  sessionMeta: { ...typography.small, color: colors.gray, marginTop: 2 },
  messages: { gap: 12, paddingVertical: 14 },
  bubble: {
    maxWidth: "84%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  volunteerBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#171717",
    borderColor: "#000000",
    borderBottomRightRadius: 2,
  },
  elderBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderColor: colors.borderStrong,
    borderBottomLeftRadius: 2,
  },
  bubbleText: {
    ...typography.bodyText,
    fontSize: 15,
    lineHeight: 22,
  },
  volunteerBubbleText: {
    color: "#FFFFFF",
  },
  elderBubbleText: {
    color: "#171717",
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  volunteerTimestamp: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  elderTimestamp: {
    color: colors.muted,
  },
  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
  },
  typingText: {
    ...typography.small,
    color: colors.gray,
    fontStyle: "italic",
  },
  quickPromptsBar: {
    maxHeight: 40,
    marginBottom: 10,
  },
  quickPrompts: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 2,
  },
  promptChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.sage,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  pressedChip: {
    backgroundColor: colors.sand,
  },
  promptText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.forestDark,
  },
  composer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    color: colors.ink,
    fontSize: 15,
    borderRadius: 4,
  },
  send: {
    minHeight: 48,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.ink,
    borderRadius: 4,
  },
  sendPressed: {
    opacity: 0.85,
  },
  sendText: {
    ...typography.bodyStrong,
    color: colors.white,
  },
});
