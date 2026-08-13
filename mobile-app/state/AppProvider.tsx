import { createContext, useContext, useMemo, useState, type PropsWithChildren } from "react";

export type SelectedAddress = {
  id: string;
  label: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  area: string;
};

export type RequestDraft = {
  scheduledAt: string | null;
  timezone: "Asia/Singapore";
  displayDate: string;
  displayTime: string;
  address: SelectedAddress | null;
};

type AppState = {
  role: "volunteer" | "elder" | "caregiver";
  category: string;
  requestStatus: "pending" | "accepted" | "inProgress" | "done";
  rating: number;
  requestDraft: RequestDraft;
  setRole: (role: AppState["role"]) => void;
  setCategory: (category: string) => void;
  setRequestStatus: (status: AppState["requestStatus"]) => void;
  setRating: (rating: number) => void;
  setRequestDraft: (draft: Partial<RequestDraft>) => void;
  resetRequestDraft: () => void;
};

const emptyRequestDraft: RequestDraft = {
  scheduledAt: null,
  timezone: "Asia/Singapore",
  displayDate: "",
  displayTime: "",
  address: null,
};

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: PropsWithChildren) {
  const [role, setRole] = useState<AppState["role"]>("volunteer");
  const [category, setCategory] = useState("Groceries");
  const [requestStatus, setRequestStatus] = useState<AppState["requestStatus"]>("accepted");
  const [rating, setRating] = useState(4);
  const [requestDraft, setRequestDraftState] = useState<RequestDraft>(emptyRequestDraft);

  const setRequestDraft = (draft: Partial<RequestDraft>) => {
    setRequestDraftState((current) => ({ ...current, ...draft }));
  };

  const resetRequestDraft = () => setRequestDraftState(emptyRequestDraft);

  const value = useMemo(
    () => ({ role, category, requestStatus, rating, requestDraft, setRole, setCategory, setRequestStatus, setRating, setRequestDraft, resetRequestDraft }),
    [role, category, requestStatus, rating, requestDraft],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error("useApp must be used inside AppProvider");
  return value;
}
