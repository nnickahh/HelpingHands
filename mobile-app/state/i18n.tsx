import { useMemo } from "react";
import { useApp } from "./AppProvider";

type Locale = "English" | "中文 Mandarin" | "Melayu" | "Tamil";

const translations: Record<Locale, Record<string, string>> = {
  English: {
  accountLabel: "Your HelpingHands account",
    eyebrow: "A little help goes a long way",
    headingWelcome: "Welcome back",
    intro: "Sign in to see your requests, tasks, and neighbours.",
    rememberMe: "Remember me on this device",
    forgotPassword: "Forgot your password?",
    createAccount: "Create an elder or caregiver account",
    step1: "Step 1 of 2",
    tellUs: "Tell us who you are",
    helpIntro: "This helps us show the right kind of support.",
    needHelp: "I need help",
    caregiver: "I’m a caregiver",
    fullName: "Full name",
    phoneNumber: "Phone number",
    preferredLanguage: "Preferred language",
    continue: "Continue to request help",
  },
  "中文 Mandarin": {
  accountLabel: "您的 HelpingHands 帐户",
    eyebrow: "一点小帮助，意义深远",
    headingWelcome: "欢迎回来",
    intro: "登录以查看您的请求、任务和邻居。",
    rememberMe: "在此设备上记住我",
    forgotPassword: "忘记密码？",
    createAccount: "创建长者或照顾者帐户",
    step1: "第 1 步（共 2 步）",
    tellUs: "告诉我们您是谁",
    helpIntro: "这有助于我们为您显示合适的支持。",
    needHelp: "我需要帮助",
    caregiver: "我是照顾者",
    fullName: "全名",
    phoneNumber: "电话号码",
    preferredLanguage: "首选语言",
    continue: "继续发送请求",
  },
  Melayu: {
  accountLabel: "Akaun HelpingHands anda",
    eyebrow: "Sedikit bantuan, banyak makna",
    headingWelcome: "Selamat datang kembali",
    intro: "Log masuk untuk melihat permintaan, tugas, dan jiran anda.",
    rememberMe: "Ingat saya di peranti ini",
    forgotPassword: "Lupa kata laluan?",
    createAccount: "Buat akaun warga tua atau penjaga",
    step1: "Langkah 1 daripada 2",
    tellUs: "Beritahu kami siapa anda",
    helpIntro: "Ini membantu kami menunjukkan sokongan yang sesuai.",
    needHelp: "Saya perlukan bantuan",
    caregiver: "Saya penjaga",
    fullName: "Nama penuh",
    phoneNumber: "Nombor telefon",
    preferredLanguage: "Bahasa pilihan",
    continue: "Teruskan untuk meminta bantuan",
  },
  Tamil: {
  accountLabel: "உங்கள் HelpingHands கணக்கு",
    eyebrow: "கணினி சிறிது உதவி பெரிது மாற்றம்",
    headingWelcome: "மீண்டும் வரவேற்கிறோம்",
    intro: "உங்கள் கோரிக்கைகள், பணிகள் மற்றும் שכן-மக்களை பார்க்க உள்நுழையுங்கள்.",
    rememberMe: "இந்த சாதனத்தில் என்னை நினைவில் வைக்கவும்",
    forgotPassword: "கடவுச்சொல்லை மறந்துவிட்டீர்களா?",
    createAccount: "மூதாட்டி அல்லது பராமரிப்பாளருக்கான கணக்கை உருவாக்கவும்",
    step1: "படி 1 உடன் 2",
    tellUs: "நீங்கள் யார் என்பதை எங்களுக்குத் தெரிவியுங்கள்",
    helpIntro: "இது எங்களுக்கு பொருத்தமான ஆதரவை காட்ட உதவும்.",
    needHelp: "எனக்கு உதவி வேண்டும்",
    caregiver: "நான் பராமரிப்பாளர்",
    fullName: "முழுப் பெயர்",
    phoneNumber: "தொலைபேசி எண்",
    preferredLanguage: "முன்னுரிமை மொழி",
    continue: "உதவியை தொடருங்கள்",
  },
};

export function useTranslation() {
  const { preferredLanguage, setPreferredLanguage } = useApp();

  const lang = (preferredLanguage || "English") as Locale;

  const t = useMemo(() => {
    return (key: string) => translations[lang][key] ?? translations.English[key] ?? key;
  }, [lang]);

  return { t, language: lang, setLanguage: setPreferredLanguage } as const;
}
