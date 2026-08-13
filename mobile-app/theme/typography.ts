export const typography = {
  body: "System",
  mono: "monospace",
  display: { fontSize: 28, lineHeight: 34, fontWeight: "800" as const, letterSpacing: -0.5 },
  title: { fontSize: 23, lineHeight: 29, fontWeight: "800" as const, letterSpacing: -0.25 },
  heading: { fontSize: 18, lineHeight: 24, fontWeight: "800" as const },
  bodyText: { fontSize: 16, lineHeight: 23, fontWeight: "500" as const },
  bodyStrong: { fontSize: 16, lineHeight: 22, fontWeight: "700" as const },
  small: { fontSize: 13, lineHeight: 18, fontWeight: "500" as const },
  label: { fontSize: 12, lineHeight: 16, fontWeight: "800" as const, letterSpacing: 0.7 },
} as const;
