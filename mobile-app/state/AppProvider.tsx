import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";

import { clearAccountSession, loadAccountSession, saveAccountSession } from "./sessionStorage";

export type SelectedAddress = {
  id: string;
  label: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  area: string;
};

export type RequestDraft = {
  sharedRequestId?: string | null;
  scheduledAt: string | null;
  timezone: "Asia/Singapore";
  displayDate: string;
  displayTime: string;
  address: SelectedAddress | null;
  notes: string;
};

export type AccountProfile = {
  name: string;
  email: string;
  phone: string;
  password: string;
  isLoggedIn: boolean;
  isEmailVerified: boolean;
  isIdVerified: boolean;
  rememberMe?: boolean;
  preferredLanguage?: string;
  avatarUri?: string | null;
  lastIdentifier?: string;
  role?: "elder" | "volunteer";
  isIdSubmitted?: boolean;
  showInAdmin?: boolean;
  authAccessToken?: string;
  authRefreshToken?: string;
};

export type AdminVolunteer = {
  id: string;
  name: string;
  email: string;
  area: string;
  status: "pending" | "approved" | "rejected";
  showInAdmin: boolean;
};

export type AdminUser = {
  id: string;
  name: string;
  role: "elder" | "volunteer";
  status: "active" | "suspended";
  showInAdmin: boolean;
};

type AppState = {
  role: "volunteer" | "elder";
  category: string;
  requestStatus: "pending" | "accepted" | "inProgress" | "done" | "cancelled" | "rejected";
  rating: number;
  requestDraft: RequestDraft;
  account: AccountProfile;
  setRole: (role: AppState["role"]) => void;
  setCategory: (category: string) => void;
  setRequestStatus: (status: AppState["requestStatus"]) => void;
  setRating: (rating: number) => void;
  setRequestDraft: (draft: Partial<RequestDraft>) => void;
  resetRequestDraft: () => void;
  setAccount: (profile: Partial<AccountProfile>) => void;
  login: (profile: Partial<AccountProfile>) => void;
  logout: () => void;
  verifyEmail: () => void;
  verifyId: () => void;
  submitRequest: (draft: Partial<RequestDraft>) => void;
  acceptRequest: (volunteer: { name: string; phone: string }) => void;
  requestOwner: { name: string; phone: string } | null;
  matchedVolunteer: { name: string; phone: string } | null;
  preferredLanguage: string;
  setPreferredLanguage: (lang: string) => void;
  avatarUri: string | null;
  setAvatarUri: (uri: string | null) => void;
  lastIdentifier: string;
  setLastIdentifier: (id: string) => void;
  submitIdForReview: () => void;
  urgentReports: string[];
  reportUrgentIssue: (details: string) => void;
  feedback: string[];
  submitFeedback: (message: string) => void;
  isAdminLoggedIn: boolean;
  adminLogin: () => void;
  adminLogout: () => void;
  adminVolunteers: AdminVolunteer[];
  reviewVolunteer: (id: string, decision: "approved" | "rejected") => void;
  adminUsers: AdminUser[];
  toggleUserStatus: (id: string) => void;
  resolveUrgentReport: (index: number) => void;
  resolveFeedback: (index: number) => void;
};

const emptyRequestDraft: RequestDraft = {
  sharedRequestId: null,
  scheduledAt: null,
  timezone: "Asia/Singapore",
  displayDate: "",
  displayTime: "",
  address: null,
  notes: "",
};

const defaultAccount: AccountProfile = {
  name: "",
  email: "",
  phone: "",
  password: "",
  isLoggedIn: false,
  isEmailVerified: false,
  isIdVerified: false,
  rememberMe: false,
  preferredLanguage: "English",
  avatarUri: null,
  lastIdentifier: "",
  role: "elder",
  isIdSubmitted: false,
  showInAdmin: false,
  authAccessToken: "",
  authRefreshToken: "",
};

const initialAdminVolunteers: AdminVolunteer[] = [
  { id: "ben-lim", name: "Ben Lim Wei Jie", email: "ben.lim@example.com", area: "Jurong East", status: "approved", showInAdmin: true },
  { id: "siti-rahman", name: "Siti Rahman", email: "siti.rahman@example.com", area: "Clementi", status: "pending", showInAdmin: true },
  { id: "david-tan", name: "David Tan", email: "david.tan@example.com", area: "Buona Vista", status: "pending", showInAdmin: true },
];

const initialAdminUsers: AdminUser[] = [
  { id: "maria-lim", name: "Mdm Maria Lim", role: "elder", status: "active", showInAdmin: true },
  { id: "ben-lim", name: "Ben Lim Wei Jie", role: "volunteer", status: "active", showInAdmin: true },
  { id: "siti-rahman", name: "Siti Rahman", role: "volunteer", status: "active", showInAdmin: true },
];

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: PropsWithChildren) {
  const [role, setRoleState] = useState<AppState["role"]>("elder");
  const [category, setCategory] = useState("Groceries");
  const [requestStatus, setRequestStatus] = useState<AppState["requestStatus"]>("pending");
  const [rating, setRating] = useState(4);
  const [requestDraft, setRequestDraftState] = useState<RequestDraft>(emptyRequestDraft);
  const [requestOwner, setRequestOwner] = useState<{ name: string; phone: string } | null>(null);
  const [matchedVolunteer, setMatchedVolunteer] = useState<{ name: string; phone: string } | null>(null);
  const [account, setAccountState] = useState<AccountProfile>(defaultAccount);
  const [preferredLanguage, setPreferredLanguageState] = useState<string>(defaultAccount.preferredLanguage ?? "English");
  const [avatarUri, setAvatarUriState] = useState<string | null>(defaultAccount.avatarUri ?? null);
  const [lastIdentifier, setLastIdentifierState] = useState<string>(defaultAccount.lastIdentifier ?? "");
  const [urgentReports, setUrgentReports] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminVolunteers, setAdminVolunteers] = useState<AdminVolunteer[]>(initialAdminVolunteers);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(initialAdminUsers);

  useEffect(() => {
    let active = true;

    const hydrateAccount = async () => {
      const savedAccount = await loadAccountSession();
      if (!active || !savedAccount) return;

      setAccountState((current) => ({
        ...defaultAccount,
        ...current,
        ...savedAccount,
        isLoggedIn: Boolean(savedAccount.isLoggedIn),
      }));
      if (savedAccount.preferredLanguage) setPreferredLanguageState(savedAccount.preferredLanguage);
      if (savedAccount.avatarUri) setAvatarUriState(savedAccount.avatarUri);
      if (savedAccount.lastIdentifier) setLastIdentifierState(savedAccount.lastIdentifier);
      if (savedAccount.role) setRoleState(savedAccount.role);
    };

    void hydrateAccount();

    return () => {
      active = false;
    };
  }, []);

  const persistAccount = (nextAccount: AccountProfile) => {
    if (nextAccount.isLoggedIn || nextAccount.rememberMe) {
      void saveAccountSession(nextAccount);
      return;
    }

    void clearAccountSession();
  };

  const setRequestDraft = (draft: Partial<RequestDraft>) => {
    setRequestDraftState((current) => ({ ...current, ...draft }));
  };

  const setAvatarUri = (uri: string | null) => {
    setAvatarUriState(uri);
    setAccountState((current) => {
      const next = { ...current, avatarUri: uri };
      persistAccount(next);
      return next;
    });
  };

  const setLastIdentifier = (id: string) => {
    setLastIdentifierState(id);
    setAccountState((current) => {
      const next = { ...current, lastIdentifier: id };
      if (current.isLoggedIn || current.rememberMe) persistAccount(next);
      return next;
    });
  };

  const submitRequest = (draft: Partial<RequestDraft>) => {
    setRequestDraftState((current) => ({ ...current, ...draft }));
    // Save who created the request so volunteers can call them
    setRequestOwner({ name: account.name || "Requesting elder", phone: account.phone });
    setRequestStatus("pending");
  };

  const acceptRequest = (volunteer: { name: string; phone: string }) => {
    setMatchedVolunteer(volunteer);
    setRequestStatus("accepted");
  };

  const resetRequestDraft = () => setRequestDraftState(emptyRequestDraft);

  const setAccount = (profile: Partial<AccountProfile>) => {
    setAccountState((current) => {
      const nextAccount = { ...current, ...profile };
      if (profile.email) nextAccount.lastIdentifier = profile.email;
      if (profile.phone) nextAccount.lastIdentifier = profile.phone;
      persistAccount(nextAccount);
      if (nextAccount.role === "volunteer" && nextAccount.email && nextAccount.showInAdmin) {
        setAdminUsers((currentUsers) => currentUsers.some((user) => user.id === nextAccount.email)
          ? currentUsers.map((user) => user.id === nextAccount.email ? { ...user, name: nextAccount.name || user.name, showInAdmin: true } : user)
          : [...currentUsers, { id: nextAccount.email, name: nextAccount.name || "Volunteer", role: "volunteer", status: "active", showInAdmin: true }]);
        setAdminVolunteers((currentVolunteers) => currentVolunteers.some((volunteer) => volunteer.id === nextAccount.email)
          ? currentVolunteers.map((volunteer) => volunteer.id === nextAccount.email ? { ...volunteer, name: nextAccount.name || volunteer.name, showInAdmin: true } : volunteer)
          : [...currentVolunteers, { id: nextAccount.email, name: nextAccount.name || "Volunteer", email: nextAccount.email, area: "Not provided", status: "pending", showInAdmin: true }]);
      }
      return nextAccount;
    });
  };

  const setRole = (nextRole: AppState["role"]) => {
    setRoleState(nextRole);
    setAccountState((current) => {
      const nextAccount = { ...current, role: nextRole };
      persistAccount(nextAccount);
      return nextAccount;
    });
  };

  const login = (profile: Partial<AccountProfile>) => {
    setAccountState((current) => {
      const nextAccount = { ...current, ...profile, isLoggedIn: true };
      if (profile.email) nextAccount.lastIdentifier = profile.email;
      if (profile.phone) nextAccount.lastIdentifier = profile.phone;
      persistAccount(nextAccount);
      return nextAccount;
    });
  };

  const logout = () => {
    const clearedAccount = defaultAccount;
    setAccountState(clearedAccount);
    void clearAccountSession();
    resetRequestDraft();
    setRequestStatus("pending");
  };

  const verifyEmail = () => setAccountState((current) => {
    const nextAccount = { ...current, isEmailVerified: true };
    persistAccount(nextAccount);
    return nextAccount;
  });

  const verifyId = () => setAccountState((current) => {
    const nextAccount = { ...current, isIdVerified: true, isIdSubmitted: true };
    persistAccount(nextAccount);
    return nextAccount;
  });

  const submitIdForReview = () => setAccountState((current) => {
    const nextAccount = { ...current, isIdSubmitted: true };
    persistAccount(nextAccount);
    return nextAccount;
  });

  const reportUrgentIssue = (details: string) => setUrgentReports((current) => [...current, details]);
  const submitFeedback = (message: string) => setFeedback((current) => [...current, message]);

  const reviewVolunteer = (id: string, decision: "approved" | "rejected") => {
    setAdminVolunteers((current) => current.map((volunteer) => volunteer.id === id ? { ...volunteer, status: decision } : volunteer));
    if (account.email === adminVolunteers.find((volunteer) => volunteer.id === id)?.email) {
      setAccountState((current) => ({ ...current, isIdVerified: decision === "approved" }));
    }
  };

  const resolveUrgentReport = (index: number) => setUrgentReports((current) => current.filter((_, reportIndex) => reportIndex !== index));
  const resolveFeedback = (index: number) => setFeedback((current) => current.filter((_, feedbackIndex) => feedbackIndex !== index));
  const toggleUserStatus = (id: string) => setAdminUsers((current) => current.map((user) => user.id === id ? { ...user, status: user.status === "active" ? "suspended" : "active" } : user));

  const setPreferredLanguage = (lang: string) => {
    setPreferredLanguageState(lang);
    setAccountState((current) => {
      const nextAccount = { ...current, preferredLanguage: lang };
      persistAccount(nextAccount);
      return nextAccount;
    });
  };

  const value = useMemo(
    () => ({ role, category, requestStatus, rating, requestDraft, account, setRole, setCategory, setRequestStatus, setRating, setRequestDraft, resetRequestDraft, setAccount, login, logout, verifyEmail, verifyId, submitIdForReview, submitRequest, acceptRequest, requestOwner, matchedVolunteer, preferredLanguage, setPreferredLanguage, avatarUri, setAvatarUri, lastIdentifier, setLastIdentifier, urgentReports, reportUrgentIssue, feedback, submitFeedback, isAdminLoggedIn, adminLogin: () => setIsAdminLoggedIn(true), adminLogout: () => setIsAdminLoggedIn(false), adminVolunteers, reviewVolunteer, adminUsers, toggleUserStatus, resolveUrgentReport, resolveFeedback }),
    [role, category, requestStatus, rating, requestDraft, account, requestOwner, matchedVolunteer, preferredLanguage, avatarUri, lastIdentifier, urgentReports, feedback, isAdminLoggedIn, adminVolunteers, adminUsers],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error("useApp must be used inside AppProvider");
  return value;
}
