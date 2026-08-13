export const assistanceCategories = [
  { icon: "shopping-basket" as const, label: "Groceries" },
  { icon: "local-pharmacy" as const, label: "Medicine" },
  { icon: "event" as const, label: "Appointment" },
  { icon: "smartphone" as const, label: "Digital help" },
  { icon: "inventory-2" as const, label: "Carrying" },
  { icon: "accessible" as const, label: "Accompany" },
] as const;

export const availableRequests = [
  { title: "Grocery assistance", details: "Wed, 10:00 AM · Jurong East · 1.2 km", icon: "shopping-basket" as const },
  { title: "Medicine collection", details: "Thu, 2:30 PM · Clementi · 2.4 km", icon: "local-pharmacy" as const },
  { title: "Appointment escort", details: "Fri, 9:00 AM · Buona Vista · 3.8 km", icon: "event" as const },
] as const;

export const mockVolunteer = {
  name: "Ben Lim Wei Jie",
  rating: "4.9 · 47 tasks completed",
  task: "Grocery assistance · Wed, 10:00 AM",
};

export const mockElder = {
  name: "Mdm Maria Lim",
  details: "72 years · Jurong East",
  mobilityNotes: "Uses walking frame. Please use bags.",
};
