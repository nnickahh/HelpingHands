import { Linking } from "react-native";

function digits(phone: string) {
  return phone.replace(/[^0-9]/g, "");
}

export async function openPhoneContact(phone: string, channel: "call" | "whatsapp") {
  const number = digits(phone);
  const urls = channel === "call"
    ? [`tel:${phone}`]
    : channel === "whatsapp"
      ? [`whatsapp://send?phone=${number}`, `https://wa.me/${number}`]
      : [];

  for (const url of urls) {
    if (await Linking.canOpenURL(url)) {
      await Linking.openURL(url);
      return true;
    }
  }

  return false;
}