import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { AppScreen } from "../../components/layout/AppScreen";
import { BackHeader } from "../../components/layout/BackHeader";
import { AvatarPlaceholder } from "../../components/ui/AvatarPlaceholder";
import { WireButton } from "../../components/ui/WireButton";
import { mockVolunteer } from "../../data/mockData";
import { useApp } from "../../state/AppProvider";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

type ChatMessage = {
  id: string;
  text: string;
  from: "user" | "volunteer";
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
 * Conversational AI volunteer response engine
 * Capable of responding naturally to any user message, question, or story without unsolicited instructions.
 */
function generateVolunteerReply(
  userText: string,
  context: {
    volunteerName: string;
    elderName: string;
    category: string;
    locationLabel: string;
    area: string;
    postalCode: string;
    scheduledTime: string;
    scheduledDate: string;
    notes: string;
  }
): string {
  const query = userText.trim().toLowerCase();
  const rawText = userText.trim();
  const vName = context.volunteerName || "Ben";
  const eName = context.elderName ? context.elderName : "there";
  const loc = context.locationLabel || context.area || "your destination";
  const schedTime = context.scheduledTime || "our scheduled time";
  const schedDate = context.scheduledDate || "our appointment date";
  const cat = context.category || "assistance";

  // 1. Time / Arrival / Reaching / ETA estimation
  if (
    query.includes("what time") ||
    query.includes("when are you reaching") ||
    query.includes("when are u reaching") ||
    query.includes("what time are u reaching") ||
    query.includes("when will you arrive") ||
    query.includes("when arriving") ||
    query.includes("reaching soon") ||
    query.includes("eta") ||
    query.includes("how long") ||
    query.includes("on the way") ||
    query.includes("where are you now")
  ) {
    if (context.scheduledTime) {
      return `I will be reaching at ${schedTime}. I am currently on the way and will arrive in about 15 to 20 minutes.`;
    }
    return `I am reaching in about 10 to 15 minutes. Currently nearby in ${context.area || "the area"}.`;
  }

  // 2. Greetings / Saying hi
  if (
    query === "hi" ||
    query === "hello" ||
    query === "hey" ||
    query === "halo" ||
    query === "yo" ||
    query.startsWith("hi ") ||
    query.startsWith("hello ") ||
    query.startsWith("hey ") ||
    query.startsWith("halo ") ||
    query.includes("good morning") ||
    query.includes("good afternoon") ||
    query.includes("good evening") ||
    query.includes("morning") ||
    query.includes("afternoon") ||
    query.includes("evening")
  ) {
    return `Hi! How are you doing? Let me know if you need anything before I arrive for our session at ${schedTime}.`;
  }

  // 3. How are you / Well-being inquiry
  if (
    query.includes("how are you") ||
    query.includes("how r u") ||
    query.includes("how are u") ||
    query.includes("how do you do") ||
    query.includes("how are things")
  ) {
    return `I am doing well, thank you for asking! Getting ready for our session at ${schedTime}. How are you feeling today?`;
  }

  // 4. Who are you / About the volunteer
  if (
    query.includes("who are you") ||
    query.includes("tell me about yourself") ||
    query.includes("what is your name") ||
    query.includes("what's your name") ||
    query.includes("how old") ||
    query.includes("age") ||
    query.includes("student") ||
    query.includes("school") ||
    query.includes("ite") ||
    query.includes("study")
  ) {
    return `I am ${vName}, an ITE student and your volunteer with HelpingHands today.`;
  }

  // 5. Food / Eating / Meals / Drinks
  if (
    query.includes("eat") ||
    query.includes("food") ||
    query.includes("lunch") ||
    query.includes("dinner") ||
    query.includes("breakfast") ||
    query.includes("kopi") ||
    query.includes("coffee") ||
    query.includes("tea") ||
    query.includes("rice") ||
    query.includes("noodle") ||
    query.includes("chicken") ||
    query.includes("hungry") ||
    query.includes("cook")
  ) {
    if (query.includes("have you eaten") || query.includes("eat already") || query.includes("had lunch") || query.includes("had dinner")) {
      return `Yes, I have eaten already, thank you! Hope you had a good meal too.`;
    }
    return `That sounds nice! Good food always makes the day better.`;
  }

  // 6. Weather / Rain / Heat
  if (
    query.includes("rain") ||
    query.includes("hot") ||
    query.includes("sunny") ||
    query.includes("cold") ||
    query.includes("weather") ||
    query.includes("thunder") ||
    query.includes("warm")
  ) {
    if (query.includes("rain")) {
      return `Yes, it looks wet outside. I will bring an umbrella when heading over to ${loc}.`;
    }
    return `The weather is quite warm today! Remember to drink plenty of water and stay cool indoors.`;
  }

  // 7. Feelings / Health / Emotions / Tiredness
  if (
    query.includes("tired") ||
    query.includes("sleepy") ||
    query.includes("exhausted") ||
    query.includes("pain") ||
    query.includes("ache") ||
    query.includes("sick") ||
    query.includes("dizzy") ||
    query.includes("unwell") ||
    query.includes("hurt")
  ) {
    return `Please take a good rest and sit comfortably. We will take things at your own pace when we meet.`;
  }

  if (
    query.includes("happy") ||
    query.includes("good mood") ||
    query.includes("excited") ||
    query.includes("grateful") ||
    query.includes("blessed")
  ) {
    return `Glad to hear that! Looking forward to meeting you at ${schedTime}.`;
  }

  if (
    query.includes("bored") ||
    query.includes("lonely") ||
    query.includes("sad") ||
    query.includes("alone")
  ) {
    return `I am right here with you. Always happy to chat with you anytime.`;
  }

  // 8. Activities / TV / Hobbies / News / Family
  if (
    query.includes("tv") ||
    query.includes("television") ||
    query.includes("show") ||
    query.includes("movie") ||
    query.includes("drama") ||
    query.includes("channel 8") ||
    query.includes("news") ||
    query.includes("radio") ||
    query.includes("music") ||
    query.includes("song") ||
    query.includes("garden") ||
    query.includes("plant") ||
    query.includes("grandchild") ||
    query.includes("family") ||
    query.includes("son") ||
    query.includes("daughter")
  ) {
    return `That sounds nice! We can talk more about it when we meet at ${schedTime}.`;
  }

  // 9. Jokes / Humor / Fun
  if (
    query.includes("joke") ||
    query.includes("funny") ||
    query.includes("laugh") ||
    query.includes("haha") ||
    query.includes("hehe") ||
    query.includes("lol")
  ) {
    return `Why did the scarecrow win an award? Because he was outstanding in his field!`;
  }

  // 10. Grocery order questions / Supermarket discussions
  if (
    query.includes("grocery") ||
    query.includes("groceries") ||
    query.includes("buy") ||
    query.includes("shopping") ||
    query.includes("fairprice") ||
    query.includes("ntuc") ||
    query.includes("sheng siong") ||
    query.includes("market")
  ) {
    return `For groceries, we can either meet at the store to shop together, or I can deliver them straight to your house doorstep.`;
  }

  // 11. Unit number / House details received
  if (
    query.includes("unit") ||
    /#\d{1,3}-\d{1,4}/.test(query) ||
    query.includes("house") ||
    query.includes("doorstep") ||
    query.includes("deliver")
  ) {
    const unitMatch = userText.match(/#\d{1,3}[-\s]?\d{1,4}/i) || userText.match(/unit\s*#?\d{1,3}[-\s]?\d{1,4}/i);
    const unitStr = unitMatch ? unitMatch[0] : "";
    return `Got it! I will deliver straight to ${loc}${unitStr ? `, ${unitStr}` : ""} at ${schedTime}.`;
  }

  // 12. Meeting location details received
  if (
    query.includes("meet there") ||
    query.includes("meet at") ||
    query.includes("meeting at")
  ) {
    return `Sounds good! I will meet you at ${loc} at ${schedTime}.`;
  }

  // 13. Questions (Why, How, What, Where, Can you, Do you, Is it)
  if (
    query.startsWith("can you") ||
    query.startsWith("could you") ||
    query.startsWith("will you") ||
    query.startsWith("can we")
  ) {
    return `Yes, certainly! I will help with that at ${schedTime}.`;
  }

  if (
    query.startsWith("why") ||
    query.startsWith("how") ||
    query.startsWith("what") ||
    query.startsWith("where") ||
    query.includes("?")
  ) {
    return `Everything is set for our ${cat} session at ${schedTime}. We can go through any other details when I arrive!`;
  }

  // 14. Thank you / Gratitude / Kind words
  if (
    query.includes("thank") ||
    query.includes("tysm") ||
    query.includes("thanks") ||
    query.includes("kind") ||
    query.includes("good job") ||
    query.includes("nice of you") ||
    query.includes("bless you")
  ) {
    return `You're welcome! Glad to help. See you at ${schedTime}!`;
  }

  // 15. Acknowledgments / Ok / Alright / See you
  if (
    query === "ok" ||
    query === "okay" ||
    query === "k" ||
    query === "alright" ||
    query === "sure" ||
    query === "noted" ||
    query === "see you" ||
    query === "bye" ||
    query.includes("see you") ||
    query.includes("bye")
  ) {
    return `See you at ${schedTime}! Take care.`;
  }

  // 16. General natural conversational response
  return `Noted on that! I will see you at ${schedTime} for ${cat}. Let me know if anything else comes up!`;
}

const quickPrompts = [
  "Help me order groceries",
  "Deliver to my house (send unit #)",
  "Meet at supermarket",
  "What time are you reaching?",
  "Hi Ben!",
];

export default function VolunteerChatScreen() {
  const { account, requestDraft, category, matchedVolunteer } = useApp();
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const volunteerName = matchedVolunteer?.name || mockVolunteer.name;
  const elderName = account.name || "Mdm Tan";

  const contextData = {
    volunteerName,
    elderName,
    category: category || "Groceries",
    locationLabel: requestDraft.address?.label || "Your location",
    area: requestDraft.address?.area || "Singapore",
    postalCode: requestDraft.address?.postalCode || "",
    scheduledTime: requestDraft.displayTime || "3:00 PM",
    scheduledDate: requestDraft.displayDate || "Today",
    notes: requestDraft.notes || "",
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      from: "volunteer",
      text: `Hi ${elderName}! I'm ${volunteerName}, your HelpingHands volunteer. I have accepted your ${category.toLowerCase()} request. How can I help you today?`,
      time: formatCurrentTime(),
    },
  ]);

  const sendTextMessage = (rawText: string) => {
    const text = rawText.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      from: "user",
      text,
      time: formatCurrentTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setMessage("");
    setIsTyping(true);

    // Simulate realistic AI volunteer response delay (600ms)
    setTimeout(() => {
      const replyText = generateVolunteerReply(text, contextData);
      const volunteerMsg: ChatMessage = {
        id: `vol-${Date.now()}`,
        from: "volunteer",
        text: replyText,
        time: formatCurrentTime(),
      };
      setMessages((prev) => [...prev, volunteerMsg]);
      setIsTyping(false);
    }, 600);
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, isTyping]);

  return (
    <AppScreen tone="oat">
      <BackHeader title="Message volunteer" eyebrow="HelpingHands chat" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.screen}>
        {/* Volunteer Profile Header Card */}
        <View style={styles.person}>
          <AvatarPlaceholder size={52} />
          <View style={styles.personMeta}>
            <Text style={styles.name}>{volunteerName}</Text>
            <Text style={styles.status}>Active · Verified Volunteer</Text>
            {requestDraft.displayTime ? (
              <Text style={styles.sessionMeta}>
                Session: {requestDraft.displayDate || "Today"} at {requestDraft.displayTime}
              </Text>
            ) : null}
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
                item.from === "user" ? styles.userBubble : styles.volunteerBubble,
              ]}
            >
              <Text
                style={[
                  styles.bubbleText,
                  item.from === "user" ? styles.userBubbleText : styles.volunteerBubbleText,
                ]}
              >
                {item.text}
              </Text>
              <Text
                style={[
                  styles.timestamp,
                  item.from === "user" ? styles.userTimestamp : styles.volunteerTimestamp,
                ]}
              >
                {item.time}
              </Text>
            </View>
          ))}

          {isTyping ? (
            <View style={[styles.bubble, styles.volunteerBubble, styles.typingBubble]}>
              <ActivityIndicator size="small" color={colors.forestDark} />
              <Text style={styles.typingText}>{volunteerName} is replying...</Text>
            </View>
          ) : null}
        </ScrollView>

        {/* Quick Suggestion Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickPromptsBar} contentContainerStyle={styles.quickPrompts}>
          {quickPrompts.map((prompt) => (
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
            accessibilityLabel="Message volunteer"
            value={message}
            onChangeText={setMessage}
            onSubmitEditing={() => sendTextMessage(message)}
            placeholder="Type your message here..."
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

        <WireButton label="Back to request status" outline onPress={() => router.back()} />
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
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#171717",
    borderColor: "#000000",
    borderBottomRightRadius: 2,
  },
  volunteerBubble: {
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
  userBubbleText: {
    color: "#FFFFFF", // High contrast white text for user bubble (fixes black box bug)
  },
  volunteerBubbleText: {
    color: "#171717", // Crisp dark text for volunteer bubble
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  userTimestamp: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  volunteerTimestamp: {
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