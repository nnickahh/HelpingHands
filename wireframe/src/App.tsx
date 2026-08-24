// HelpingHands · Low-Fidelity Navigation Wireframe
// Exact mirror of the HelpingHands mobile app with hand-drawn sketchy styling, circular home buttons, red navigation connectors, and direct image download.
import React, { useState } from "react";

const RED = "#E53E3E";
const INK = "#1A1A1A";
const GRAY = "#71717A";
const LITE = "#D4D4D8";
const BRDR = "#D1D5DB";
const FILL = "#F4F4F5";
const BG   = "#F6F5F1";

const PW = 220;   // phone frame width
const PH = 480;   // phone frame height
const LH = 34;    // label height above phone
const TH = LH + PH; // total cell height
const GAP = 42;   // horizontal gap between phones
const PAD = 32;   // canvas padding

// ─── Atoms ───────────────────────────────────────────────────────────────────

function SBar({ isSketch }: { isSketch?: boolean }) {
  return (
    <div style={{ height: 30, paddingTop: 12, paddingLeft: 12, paddingRight: 10, display: "flex", alignItems: "center", justifyContent: "space-between", userSelect: "none" }}>
      <span style={{ fontSize: 9.5, fontWeight: 700, color: INK, fontFamily: isSketch ? "'Patrick Hand', monospace" : "monospace" }}>9:41</span>
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        <svg width="14" height="8" viewBox="0 0 14 8">
          <rect x="0" y="5" width="2.5" height="3" rx="0.5" fill={LITE}/>
          <rect x="3.5" y="3.5" width="2.5" height="4.5" rx="0.5" fill={GRAY}/>
          <rect x="7" y="1.5" width="2.5" height="6.5" rx="0.5" fill={INK}/>
          <rect x="10.5" y="0" width="2.5" height="8" rx="0.5" fill={INK}/>
        </svg>
        <svg width="13" height="9" viewBox="0 0 14 9" fill="none" stroke={INK} strokeWidth="1.2">
          <path d="M0.5 6.5C0.5 6.5 3 2 7 2C11 2 13.5 6.5 13.5 6.5" opacity="0.4" strokeLinecap="round"/>
          <path d="M2.5 6.5C2.5 6.5 4.5 4 7 4C9.5 4 11.5 6.5 11.5 6.5" opacity="0.75" strokeLinecap="round"/>
          <circle cx="7" cy="7.5" r="1" fill={INK} stroke="none"/>
        </svg>
        <svg width="20" height="9" viewBox="0 0 22 10" fill="none">
          <rect x="0.5" y="0.5" width="18" height="9" rx="2" stroke={INK} strokeWidth="1.2"/>
          <rect x="18.5" y="3" width="2" height="4" rx="1" fill={INK} opacity="0.5"/>
          <rect x="2" y="2" width="12" height="6" rx="1" fill={INK}/>
        </svg>
      </div>
    </div>
  );
}

function BkHdr({ title, subtitle, isSketch }: { title: string; subtitle?: string; isSketch?: boolean }) {
  return (
    <div style={{ height: 38, display: "flex", alignItems: "center", padding: "0 10px", borderBottom: `1px solid ${BRDR}`, gap: 6, background: "#fff" }}>
      <span style={{ fontSize: 18, color: GRAY, lineHeight: 1 }}>‹</span>
      <div style={{ flex: 1, overflow: "hidden" }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: INK, letterSpacing: "-0.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: isSketch ? "'Patrick Hand', sans-serif" : "inherit" }}>
          {title}
        </div>
        {subtitle && <div style={{ fontSize: 7, color: GRAY, lineHeight: 1 }}>{subtitle}</div>}
      </div>
      <span style={{ fontSize: 9, color: GRAY }}>⋯</span>
    </div>
  );
}

function WInput({ label, ph, dots, isSketch }: { label?: string; ph: string; dots?: boolean; isSketch?: boolean }) {
  return (
    <div style={{ marginBottom: 6 }}>
      {label && <div style={{ fontSize: 8, fontWeight: 700, textTransform: "uppercase", color: GRAY, marginBottom: 2, fontFamily: isSketch ? "'Patrick Hand', sans-serif" : "inherit" }}>{label}</div>}
      <div style={{ height: 30, border: `1.5px ${isSketch ? "dashed" : "solid"} ${BRDR}`, borderRadius: 15, padding: "0 10px", display: "flex", alignItems: "center", background: "#fff" }}>
        <span style={{ fontSize: 9.5, color: dots ? INK : LITE, fontFamily: isSketch ? "'Patrick Hand', sans-serif" : "inherit", letterSpacing: dots ? "2px" : "normal" }}>
          {dots ? "••••••••" : ph}
        </span>
      </div>
    </div>
  );
}

function WBtn({ label, outline, isSketch, circled }: { label: string; outline?: boolean; isSketch?: boolean; circled?: boolean }) {
  return (
    <div style={{ position: "relative", marginBottom: 6 }}>
      <div style={{ height: 32, background: outline ? "#fff" : INK, border: `1.5px solid ${INK}`, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: outline ? INK : "#fff", fontFamily: isSketch ? "'Patrick Hand', sans-serif" : "inherit" }}>{label}</span>
      </div>
      {circled && (
        <div style={{ position: "absolute", inset: -4, border: `2px solid ${RED}`, borderRadius: 20, pointerEvents: "none" }}/>
      )}
    </div>
  );
}

function XBox({ w, h, label, isSketch }: { w?: number | string; h: number; label?: string; isSketch?: boolean }) {
  return (
    <div style={{ width: w ?? "100%", height: h, border: `1.5px ${isSketch ? "dashed" : "solid"} ${BRDR}`, borderRadius: 6, position: "relative", background: "#fff", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} preserveAspectRatio="none">
        <line x1="0" y1="0" x2="100%" y2="100%" stroke={LITE} strokeWidth="1.2"/>
        <line x1="100%" y1="0" x2="0" y2="100%" stroke={LITE} strokeWidth="1.2"/>
      </svg>
      {label && (
        <div style={{ position: "relative", zIndex: 2, fontSize: 8, color: GRAY, textAlign: "center", padding: "4px", lineHeight: 1.25, pointerEvents: "none", fontFamily: isSketch ? "'Patrick Hand', sans-serif" : "inherit" }}>{label}</div>
      )}
    </div>
  );
}

function Avatar({ size, label, isSketch }: { size: number; label?: string; isSketch?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, marginBottom: 2 }}>
      <div style={{ width: size, height: size, borderRadius: "50%", border: `2px solid ${INK}`, display: "flex", alignItems: "center", justifyContent: "center", background: "#fff" }}>
        <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 28 28" fill="none" stroke={GRAY} strokeWidth="1.8" strokeLinecap="round">
          <circle cx="14" cy="10" r="5"/>
          <path d="M4 25c0-5 4.5-8.5 10-8.5s10 3.5 10 8.5"/>
        </svg>
      </div>
      {label && <div style={{ fontSize: 10, fontWeight: 700, color: INK, fontFamily: isSketch ? "'Patrick Hand', sans-serif" : "inherit" }}>{label}</div>}
    </div>
  );
}

function Steps({ items, active, isSketch }: { items: string[]; active: number; isSketch?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "6px 8px", background: FILL }}>
      {items.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", flex: i < items.length - 1 ? 1 : 0 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <div style={{ width: 16, height: 16, borderRadius: "50%", background: i < active ? INK : i === active ? INK : "#fff", border: `1.5px solid ${i < active ? INK : i === active ? INK : BRDR}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {i < active
                ? <span style={{ fontSize: 7.5, color: "#fff", fontWeight: 700 }}>✓</span>
                : <span style={{ fontSize: 7.5, color: i === active ? "#fff" : GRAY, fontWeight: 600 }}>{i + 1}</span>}
            </div>
            <span style={{ fontSize: 6.5, color: i <= active ? INK : GRAY, textAlign: "center", width: 36, lineHeight: 1.1, fontWeight: i === active ? 700 : 400, fontFamily: isSketch ? "'Patrick Hand', sans-serif" : "inherit" }}>{s}</span>
          </div>
          {i < items.length - 1 && (
            <div style={{ flex: 1, height: 1.5, background: i < active ? INK : BRDR, margin: "0 2px", marginBottom: 8 }}/>
          )}
        </div>
      ))}
    </div>
  );
}

function Divider({ label, isSketch }: { label?: string; isSketch?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, margin: "5px 8px" }}>
      <div style={{ flex: 1, height: 1, background: BRDR }}/>
      {label && <span style={{ fontSize: 7, color: GRAY, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: isSketch ? "'Patrick Hand', sans-serif" : "inherit" }}>{label}</span>}
      {label && <div style={{ flex: 1, height: 1, background: BRDR }}/>}
    </div>
  );
}

// ─── Screen Components (Exact Mobile App Mirror) ──────────────────────────────

// ─── 👵 ELDERLY FLOW SCREENS (E1 to E6) ───

function ElderScreen1({ isSketch }: { isSketch?: boolean }) {
  return (
    <div style={{ background: "#fff", height: "100%", display: "flex", flexDirection: "column" }}>
      <SBar isSketch={isSketch}/>
      <div style={{ padding: "6px 12px", borderBottom: `1px solid ${BRDR}`, textAlign: "center" }}>
        <div style={{ fontSize: 7.5, fontWeight: 800, color: GRAY, letterSpacing: "0.08em", textTransform: "uppercase" }}>WELCOME TO HELPINGHANDS</div>
        <div style={{ fontSize: 11.5, fontWeight: 800, color: INK, fontFamily: isSketch ? "'Patrick Hand', sans-serif" : "inherit" }}>Login to your account</div>
      </div>
      <div style={{ flex: 1, padding: "8px 12px" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>
          <Avatar size={46} label="ACCOUNT LOGIN" isSketch={isSketch}/>
        </div>
        <div style={{ fontSize: 7.5, color: GRAY, marginBottom: 4, textAlign: "center" }}>
          Use last: <span style={{ textDecoration: "underline", color: INK }}>nnickahh@gmail.com</span>
        </div>
        <WInput label="Gmail or email address" ph="you@gmail.com" isSketch={isSketch}/>
        <WInput label="Password" ph="123456" dots isSketch={isSketch}/>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, fontSize: 8, color: GRAY }}>
          <span>☑ Remember me</span>
          <span style={{ textDecoration: "underline" }}>Forgot password?</span>
        </div>
        <WBtn label="Log in" isSketch={isSketch} circled/>
        <Divider label="New to HelpingHands?" isSketch={isSketch}/>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
          <WBtn label="Create Account" outline isSketch={isSketch} circled/>
          <WBtn label="Admin Portal" outline isSketch={isSketch} circled/>
        </div>
      </div>
    </div>
  );
}

function ElderScreen2({ isSketch }: { isSketch?: boolean }) {
  return (
    <div style={{ background: "#fff", height: "100%" }}>
      <SBar isSketch={isSketch}/>
      <BkHdr title="Step 1 of 3: Account Setup" subtitle="Tell us about yourself" isSketch={isSketch}/>
      <div style={{ padding: "8px 12px" }}>
        <div style={{ fontSize: 7.5, color: GRAY, marginBottom: 6, lineHeight: 1.2 }}>Choose the role matching how you will use HelpingHands:</div>
        <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
          <div style={{ flex: 1, height: 28, background: INK, color: "#fff", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8.5, fontWeight: 700, fontFamily: isSketch ? "'Patrick Hand', sans-serif" : "inherit" }}>
            👵 Elderly
          </div>
          <div style={{ flex: 1, height: 28, border: `1.2px solid ${BRDR}`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8.5, color: GRAY, fontFamily: isSketch ? "'Patrick Hand', sans-serif" : "inherit" }}>
            🤝 Volunteer
          </div>
        </div>
        <WInput label="Full Name" ph="Mdm Maria Lim" isSketch={isSketch}/>
        <WInput label="Phone Number" ph="+65 8123 4567" isSketch={isSketch}/>
        <div style={{ fontSize: 7.5, fontWeight: 700, color: GRAY, textTransform: "uppercase", marginBottom: 3, fontFamily: isSketch ? "'Patrick Hand', sans-serif" : "inherit" }}>Preferred Language</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, marginBottom: 8 }}>
          {["English", "中文 Mandarin", "Melayu", "தமிழ் Tamil"].map((l, i) => (
            <div key={l} style={{ height: 24, border: `1.2px solid ${i === 0 ? INK : BRDR}`, borderRadius: 6, background: i === 0 ? INK : "#fff", color: i === 0 ? "#fff" : GRAY, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 600, fontFamily: isSketch ? "'Patrick Hand', sans-serif" : "inherit" }}>
              {l}
            </div>
          ))}
        </div>
        <WBtn label="Continue" isSketch={isSketch} circled/>
      </div>
    </div>
  );
}

function ElderScreen3({ isSketch }: { isSketch?: boolean }) {
  const cats = [
    ["🛒","Groceries"],
    ["💊","Medicine"],
    ["🏥","Med Escort"],
    ["📱","Digital Help"],
    ["📦","Lifting"],
    ["♿","Wheelchair"]
  ];
  return (
    <div style={{ background: "#fff", height: "100%" }}>
      <SBar isSketch={isSketch}/>
      <BkHdr title="Step 2 of 3: Request Help" subtitle="What do you need help with?" isSketch={isSketch}/>
      <div style={{ padding: "6px 12px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 5, marginBottom: 6 }}>
          {cats.map(([icon, lbl], i) => (
            <div key={lbl} style={{ height: 44, border: `1.5px solid ${i === 0 ? INK : BRDR}`, borderRadius: 6, background: i === 0 ? FILL : "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1 }}>
              <span style={{ fontSize: 12 }}>{icon}</span>
              <span style={{ fontSize: 6.5, fontWeight: 700, color: INK, fontFamily: isSketch ? "'Patrick Hand', sans-serif" : "inherit" }}>{lbl}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, marginBottom: 2 }}>
          <WInput label="Date" ph="Wed, 22 Jan" isSketch={isSketch}/>
          <WInput label="Time" ph="10:00 AM" isSketch={isSketch}/>
        </div>
        <WInput label="Singapore Address (OneMap)" ph="Blk 134 Jurong East Ave 1 #08-22" isSketch={isSketch}/>
        <WInput label="Mobility Notes (Optional)" ph="Uses walking frame. Need bags carried." isSketch={isSketch}/>
        <WBtn label="Submit Request" isSketch={isSketch} circled/>
      </div>
    </div>
  );
}

function ElderScreen4({ isSketch }: { isSketch?: boolean }) {
  return (
    <div style={{ background: FILL, height: "100%" }}>
      <div style={{ background: "#fff" }}>
        <SBar isSketch={isSketch}/>
        <BkHdr title="Step 3 of 3: Status" subtitle="Request Status & Tracking" isSketch={isSketch}/>
      </div>
      <Steps items={["Pending", "Accepted", "In Progress", "Done"]} active={1} isSketch={isSketch}/>
      <div style={{ padding: "6px 12px" }}>
        <div style={{ border: `1.2px solid ${BRDR}`, borderRadius: 8, padding: "6px 8px", background: "#fff", display: "flex", gap: 6, alignItems: "center", marginBottom: 6 }}>
          <span style={{ fontSize: 14 }}>✅</span>
          <div>
            <div style={{ fontSize: 9.5, fontWeight: 800, color: INK, fontFamily: isSketch ? "'Patrick Hand', sans-serif" : "inherit" }}>Volunteer Matched!</div>
            <div style={{ fontSize: 7, color: GRAY }}>Grocery Assistance · Wed, 10:00 AM</div>
          </div>
        </div>
        <Divider label="Your Volunteer" isSketch={isSketch}/>
        <div style={{ border: `1.2px solid ${BRDR}`, borderRadius: 8, padding: "7px", background: "#fff", marginBottom: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", border: `1.5px solid ${BRDR}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>👤</div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, color: INK, fontFamily: isSketch ? "'Patrick Hand', sans-serif" : "inherit" }}>Ben Lim Wei Jie ✓</div>
              <div style={{ fontSize: 7, color: GRAY }}>★★★★★ 4.9 · 47 tasks done</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
            <div style={{ height: 24, border: `1.2px solid ${BRDR}`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, fontFamily: isSketch ? "'Patrick Hand', sans-serif" : "inherit" }}>📞 Call</div>
            <div style={{ height: 24, background: INK, color: "#fff", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, fontFamily: isSketch ? "'Patrick Hand', sans-serif" : "inherit" }}>💬 Message</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
          <WBtn label="Cancel" outline isSketch={isSketch}/>
          <WBtn label="Reschedule" outline isSketch={isSketch} circled/>
        </div>
      </div>
    </div>
  );
}

function ElderScreen5({ isSketch }: { isSketch?: boolean }) {
  return (
    <div style={{ background: "#fff", height: "100%" }}>
      <SBar isSketch={isSketch}/>
      <BkHdr title="Reschedule Request" subtitle="Choose new date and time" isSketch={isSketch}/>
      <div style={{ padding: "6px 12px" }}>
        <div style={{ border: `1.2px solid ${BRDR}`, borderRadius: 8, padding: "5px", background: FILL, marginBottom: 6 }}>
          <div style={{ fontSize: 7.5, fontWeight: 700, textTransform: "uppercase", color: GRAY, marginBottom: 3, fontFamily: isSketch ? "'Patrick Hand', sans-serif" : "inherit" }}>Select New Date (Calendar)</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, textAlign: "center", fontSize: 7 }}>
            {["S","M","T","W","T","F","S"].map((d, i)=><span key={i} style={{ color: GRAY, fontWeight: 700 }}>{d}</span>)}
            {[19,20,21,22,23,24,25].map((n, i)=>(
              <div key={i} style={{ padding: "2px 0", borderRadius: 3, background: i === 4 ? INK : "transparent", color: i === 4 ? "#fff" : INK, fontWeight: i === 4 ? 700 : 400 }}>{n}</div>
            ))}
          </div>
        </div>
        <div style={{ border: `1.2px solid ${BRDR}`, borderRadius: 8, padding: "5px", background: FILL, marginBottom: 6 }}>
          <div style={{ fontSize: 7.5, fontWeight: 700, textTransform: "uppercase", color: GRAY, marginBottom: 3, fontFamily: isSketch ? "'Patrick Hand', sans-serif" : "inherit" }}>Select New Time (Clock Dial)</div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 5, margin: "2px 0" }}>
            <div style={{ padding: "2px 5px", border: `1.5px solid ${INK}`, borderRadius: 4, background: "#fff", fontWeight: 700, fontSize: 10 }}>11</div>
            <span>:</span>
            <div style={{ padding: "2px 5px", border: `1.5px solid ${INK}`, borderRadius: 4, background: "#fff", fontWeight: 700, fontSize: 10 }}>30</div>
            <div style={{ padding: "2px 5px", background: INK, color: "#fff", borderRadius: 4, fontWeight: 700, fontSize: 8 }}>AM</div>
          </div>
        </div>
        <WInput label="Reason for reschedule" ph="Clinic appointment moved to 11am" isSketch={isSketch}/>
        <WBtn label="Confirm Reschedule" isSketch={isSketch} circled/>
      </div>
    </div>
  );
}

function ElderScreen6({ isSketch }: { isSketch?: boolean }) {
  return (
    <div style={{ background: "#fff", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div>
        <SBar isSketch={isSketch}/>
        <BkHdr title="Rate Volunteer" subtitle="Feedback & Confirmation" isSketch={isSketch}/>
        <div style={{ padding: "10px 12px", textAlign: "center" }}>
          <Avatar size={44} label="Ben Lim Wei Jie" isSketch={isSketch}/>
          <div style={{ fontSize: 7.5, color: GRAY, marginBottom: 4 }}>Grocery Assistance · Wed, 10:00 AM</div>
          <Divider label="How did it go?" isSketch={isSketch}/>
          <div style={{ display: "flex", justifyContent: "center", gap: 4, margin: "5px 0 6px", fontSize: 18, color: INK }}>
            <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
          </div>
          <div style={{ border: `1.2px solid ${BRDR}`, borderRadius: 8, padding: "5px 7px", background: FILL, textAlign: "left", minHeight: 40, marginBottom: 6 }}>
            <span style={{ fontSize: 8, color: GRAY, fontFamily: isSketch ? "'Patrick Hand', sans-serif" : "inherit" }}>"Ben was very helpful and carried all groceries to the lift."</span>
          </div>
        </div>
      </div>
      <div style={{ padding: "8px 12px" }}>
        <WBtn label="Submit Rating & Finish" isSketch={isSketch} circled/>
      </div>
    </div>
  );
}

// ─── 🤝 VOLUNTEER FLOW SCREENS (V1 to V4) ───

function VolScreen1({ isSketch }: { isSketch?: boolean }) {
  return (
    <div style={{ background: "#fff", height: "100%" }}>
      <SBar isSketch={isSketch}/>
      <BkHdr title="Volunteer ID Verification" subtitle="Upload documents for review" isSketch={isSketch}/>
      <Steps items={["Personal", "NRIC Upload", "Review"]} active={1} isSketch={isSketch}/>
      <div style={{ padding: "6px 12px" }}>
        <XBox h={60} label={"Upload NRIC or Student ID\n(Front & Back Attachment)"} isSketch={isSketch}/>
        <div style={{ height: 4 }}/>
        <WInput label="Emergency Contact Name" ph="Mrs. Lim Siew Hong" isSketch={isSketch}/>
        <WInput label="Emergency Phone" ph="+65 9234 5678" isSketch={isSketch}/>
        <div style={{ border: `1.2px dashed ${BRDR}`, borderRadius: 6, padding: "5px 7px", background: FILL, marginBottom: 6, display: "flex", gap: 5, alignItems: "flex-start" }}>
          <span style={{ fontSize: 10 }}>⏳</span>
          <div>
            <div style={{ fontSize: 8, fontWeight: 700, color: INK, fontFamily: isSketch ? "'Patrick Hand', sans-serif" : "inherit" }}>Pending Admin Verification</div>
            <div style={{ fontSize: 6.5, color: GRAY, lineHeight: 1.15 }}>Requests unlocked after admin approval.</div>
          </div>
        </div>
        <WBtn label="Submit for Verification" isSketch={isSketch} circled/>
      </div>
    </div>
  );
}

function VolScreen2({ isSketch }: { isSketch?: boolean }) {
  const reqs = [
    { title: "Grocery Assistance", sub: "Jurong East · 1.2 km", elder: "Mdm Maria Lim", badge: "Live Request" },
    { title: "Medicine Collection", sub: "Clementi Polyclinic · 2.4 km", elder: "Mr. Tan Ah Kow", badge: null },
    { title: "Medical Escort", sub: "NUH Hospital · 3.8 km", elder: "Mdm Halimah", badge: null },
  ];
  return (
    <div style={{ background: FILL, height: "100%" }}>
      <div style={{ background: "#fff" }}>
        <SBar isSketch={isSketch}/>
        <BkHdr title="Available Requests" subtitle="Community tasks nearby" isSketch={isSketch}/>
      </div>
      <div style={{ padding: "6px 10px" }}>
        <div style={{ height: 26, border: `1.2px solid ${BRDR}`, borderRadius: 13, padding: "0 8px", display: "flex", alignItems: "center", gap: 5, background: "#fff", marginBottom: 5 }}>
          <span style={{ fontSize: 9, color: LITE }}>🔍</span>
          <span style={{ fontSize: 8.5, color: LITE, fontFamily: isSketch ? "'Patrick Hand', sans-serif" : "inherit" }}>Search location / service...</span>
        </div>
        <div style={{ display: "flex", gap: 3, marginBottom: 5, overflowX: "auto" }}>
          {["All", "Groceries", "Medicine", "Escort", "Digital"].map((c, i)=>(
            <span key={c} style={{ fontSize: 7, fontWeight: 700, padding: "2px 6px", borderRadius: 8, border: `1px solid ${i === 0 ? INK : BRDR}`, background: i === 0 ? INK : "#fff", color: i === 0 ? "#fff" : GRAY, fontFamily: isSketch ? "'Patrick Hand', sans-serif" : "inherit" }}>{c}</span>
          ))}
        </div>
        {reqs.map((r, i)=>(
          <div key={i} style={{ background: "#fff", border: `1.2px solid ${BRDR}`, borderRadius: 7, padding: "6px 7px", marginBottom: 5 }}>
            {r.badge && <span style={{ fontSize: 6, fontWeight: 800, background: "#FEF3C7", color: "#92400E", padding: "1px 4px", borderRadius: 3, textTransform: "uppercase", marginBottom: 2, display: "inline-block" }}>⭐ {r.badge}</span>}
            <div style={{ fontSize: 9, fontWeight: 800, color: INK, fontFamily: isSketch ? "'Patrick Hand', sans-serif" : "inherit" }}>{r.title}</div>
            <div style={{ fontSize: 7, color: GRAY, marginBottom: 3 }}>📍 {r.sub} · {r.elder}</div>
            <div style={{ borderTop: `1px solid ${BRDR}`, paddingTop: 3, display: "flex", justifyContent: "flex-end", gap: 3 }}>
              <div style={{ padding: "2px 5px", border: `1px solid ${BRDR}`, borderRadius: 4, fontSize: 7, color: GRAY }}>Decline</div>
              <div style={{ padding: "2px 7px", background: INK, color: "#fff", borderRadius: 4, fontSize: 7, fontWeight: 700, border: `1.5px solid ${RED}` }}>Accept Task</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VolScreen3({ isSketch }: { isSketch?: boolean }) {
  return (
    <div style={{ background: "#fff", height: "100%" }}>
      <SBar isSketch={isSketch}/>
      <BkHdr title="Active Task Progress" subtitle="Assigned task details" isSketch={isSketch}/>
      <Steps items={["Accepted", "In Progress", "Completed"]} active={1} isSketch={isSketch}/>
      <div style={{ padding: "6px 12px" }}>
        <div style={{ border: `1.2px solid ${BRDR}`, borderRadius: 8, padding: "5px 7px", background: FILL, marginBottom: 5 }}>
          <div style={{ fontSize: 9.5, fontWeight: 800, color: INK, fontFamily: isSketch ? "'Patrick Hand', sans-serif" : "inherit" }}>Grocery Assistance</div>
          <div style={{ fontSize: 7, color: GRAY }}>Wed, 22 Jan · 10:00 AM</div>
          <div style={{ fontSize: 7.5, color: INK, marginTop: 1 }}>📍 Blk 134 Jurong East Ave 1</div>
        </div>
        <Divider label="Requesting Elder" isSketch={isSketch}/>
        <div style={{ border: `1.2px solid ${BRDR}`, borderRadius: 8, padding: "5px 7px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
          <div>
            <div style={{ fontSize: 9, fontWeight: 800, color: INK, fontFamily: isSketch ? "'Patrick Hand', sans-serif" : "inherit" }}>Mdm Maria Lim (72 yrs)</div>
            <div style={{ fontSize: 7, color: GRAY }}>Walking frame · Elevator available</div>
          </div>
          <div style={{ display: "flex", gap: 3 }}>
            <div style={{ width: 20, height: 20, border: `1px solid ${BRDR}`, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8 }}>📞</div>
            <div style={{ width: 20, height: 20, border: `1.5px solid ${RED}`, background: INK, color: "#fff", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8 }}>💬</div>
          </div>
        </div>
        <WBtn label="✓ Mark Task Completed" isSketch={isSketch} circled/>
      </div>
    </div>
  );
}

function VolScreen4({ isSketch }: { isSketch?: boolean }) {
  return (
    <div style={{ background: FILL, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div>
        <SBar isSketch={isSketch}/>
        <BkHdr title="Chat: Mdm Maria Lim" subtitle="In-app messaging" isSketch={isSketch}/>
        <div style={{ padding: "6px 8px", display: "flex", flexDirection: "column", gap: 5 }}>
          <div style={{ display: "flex", gap: 3, alignItems: "flex-end" }}>
            <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#CBD5E1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7 }}>👵</div>
            <div style={{ background: "#fff", border: `1px solid ${BRDR}`, borderRadius: 7, padding: "4px 6px", maxWidth: "75%", fontSize: 7.5, fontFamily: isSketch ? "'Patrick Hand', sans-serif" : "inherit" }}>
              Hello Ben, could you also buy 1 carton of low-fat milk?
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ background: INK, color: "#fff", borderRadius: 7, padding: "4px 6px", maxWidth: "75%", fontSize: 7.5, fontFamily: isSketch ? "'Patrick Hand', sans-serif" : "inherit" }}>
              Sure Mdm Lim! I am at the supermarket right now.
            </div>
          </div>
        </div>
      </div>
      <div style={{ background: "#fff", borderTop: `1px solid ${BRDR}`, padding: "5px 7px" }}>
        <div style={{ display: "flex", gap: 3, overflowX: "auto", marginBottom: 3 }}>
          {["On my way!", "Arrived at block", "Done!"].map((s)=>(
            <span key={s} style={{ fontSize: 6.5, border: `1px solid ${BRDR}`, borderRadius: 4, padding: "1px 4px", background: FILL, whiteSpace: "nowrap" }}>{s}</span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 3 }}>
          <div style={{ flex: 1, height: 24, border: `1px solid ${BRDR}`, borderRadius: 4, padding: "0 6px", display: "flex", alignItems: "center", fontSize: 7.5, color: LITE }}>Type message...</div>
          <div style={{ width: 24, height: 24, background: INK, color: "#fff", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9 }}>➤</div>
        </div>
      </div>
    </div>
  );
}

// ─── 🛡️ ADMIN FLOW SCREENS (A1 to A4) ───

function AdminScreen1({ isSketch }: { isSketch?: boolean }) {
  return (
    <div style={{ background: "#fff", height: "100%" }}>
      <SBar isSketch={isSketch}/>
      <div style={{ background: INK, color: "#fff", padding: "5px 0", textAlign: "center", fontSize: 9, fontWeight: 900, letterSpacing: "1px", textTransform: "uppercase" }}>
        Admin System Portal
      </div>
      <div style={{ padding: "10px 12px" }}>
        <div style={{ textAlign: "center", margin: "8px 0" }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", border: `2px solid ${INK}`, margin: "0 auto 4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, background: FILL }}>🛡️</div>
          <div style={{ fontSize: 10.5, fontWeight: 800, color: INK, fontFamily: isSketch ? "'Patrick Hand', sans-serif" : "inherit" }}>System Governance</div>
          <div style={{ fontSize: 7, color: GRAY }}>Authorized staff access only</div>
        </div>
        <WInput label="Admin Email" ph="admin@helpinghands.sg" isSketch={isSketch}/>
        <WInput label="Passkey" ph="••••••••" dots isSketch={isSketch}/>
        <WBtn label="Authenticate" isSketch={isSketch} circled/>
      </div>
    </div>
  );
}

function AdminScreen2({ isSketch }: { isSketch?: boolean }) {
  return (
    <div style={{ background: FILL, height: "100%" }}>
      <div style={{ background: "#fff" }}>
        <SBar isSketch={isSketch}/>
        <BkHdr title="System Control Panel" subtitle="Governance & Safety" isSketch={isSketch}/>
      </div>
      <div style={{ padding: "6px 8px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, marginBottom: 6 }}>
          <div style={{ border: `1.2px solid ${BRDR}`, borderRadius: 7, background: "#fff", padding: "6px 3px", textAlign: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: INK }}>3</div>
            <div style={{ fontSize: 6.5, fontWeight: 700, textTransform: "uppercase", color: "#B45309" }}>Pending ID Review</div>
          </div>
          <div style={{ border: `1.2px solid ${BRDR}`, borderRadius: 7, background: "#fff", padding: "6px 3px", textAlign: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: INK }}>14</div>
            <div style={{ fontSize: 6.5, fontWeight: 700, textTransform: "uppercase", color: "#047857" }}>Active Tasks</div>
          </div>
        </div>
        <Divider label="Audit Queues" isSketch={isSketch}/>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ border: `1.2px solid ${BRDR}`, borderRadius: 6, background: "#fff", padding: "5px 7px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 8, fontWeight: 700, color: INK, fontFamily: isSketch ? "'Patrick Hand', sans-serif" : "inherit" }}>Volunteer Document Review</div>
              <div style={{ fontSize: 6.5, color: GRAY }}>3 documents pending verification</div>
            </div>
            <span style={{ fontSize: 8 }}>➔</span>
          </div>
          <div style={{ border: `1.2px solid ${BRDR}`, borderRadius: 6, background: "#fff", padding: "5px 7px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 8, fontWeight: 700, color: INK, fontFamily: isSketch ? "'Patrick Hand', sans-serif" : "inherit" }}>Safety Reports & Audits</div>
              <div style={{ fontSize: 6.5, color: GRAY }}>0 critical incident alerts</div>
            </div>
            <span style={{ fontSize: 8 }}>➔</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminScreen3({ isSketch }: { isSketch?: boolean }) {
  return (
    <div style={{ background: "#fff", height: "100%" }}>
      <SBar isSketch={isSketch}/>
      <BkHdr title="Audit: Ben Lim Wei Jie" subtitle="Credential Verification" isSketch={isSketch}/>
      <div style={{ padding: "6px 12px" }}>
        <XBox h={62} label={"Submitted NRIC / Student ID\nFront & Back Scan"} isSketch={isSketch}/>
        <div style={{ margin: "5px 0", fontSize: 7.5, lineHeight: 1.3 }}>
          <div><span style={{ fontWeight: 700 }}>Name:</span> Ben Lim Wei Jie</div>
          <div><span style={{ fontWeight: 700 }}>Phone:</span> +65 9123 4567</div>
          <div><span style={{ fontWeight: 700 }}>Status:</span> <span style={{ color: "#B45309", fontWeight: 700 }}>Pending Review</span></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, marginTop: 6 }}>
          <div style={{ height: 26, border: `1.2px solid #DC2626`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, color: "#DC2626", fontFamily: isSketch ? "'Patrick Hand', sans-serif" : "inherit" }}>Reject</div>
          <div style={{ height: 26, background: INK, color: "#fff", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, border: `1.5px solid ${RED}`, fontFamily: isSketch ? "'Patrick Hand', sans-serif" : "inherit" }}>✓ Approve</div>
        </div>
      </div>
    </div>
  );
}

function AdminScreen4({ isSketch }: { isSketch?: boolean }) {
  return (
    <div style={{ background: FILL, height: "100%" }}>
      <div style={{ background: "#fff" }}>
        <SBar isSketch={isSketch}/>
        <BkHdr title="Requests Oversight" subtitle="Live Singapore Audit Logs" isSketch={isSketch}/>
      </div>
      <div style={{ padding: "5px 7px", display: "flex", flexDirection: "column", gap: 3.5 }}>
        {[
          { t: "Grocery Help", loc: "Jurong East", elder: "Mdm Maria", vol: "Ben Lim", st: "Active" },
          { t: "Medicine", loc: "Clementi", elder: "Mr. Tan", vol: "Unassigned", st: "Pending" },
          { t: "Escort", loc: "Buona Vista", elder: "Mdm Halimah", vol: "Sarah Chen", st: "Done" },
        ].map((item, i)=>(
          <div key={i} style={{ border: `1.2px solid ${BRDR}`, borderRadius: 6, background: "#fff", padding: "5px 7px", fontSize: 7 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 1 }}>
              <span style={{ fontWeight: 700, color: INK, fontSize: 8, fontFamily: isSketch ? "'Patrick Hand', sans-serif" : "inherit" }}>{item.t}</span>
              <span style={{ fontWeight: 700, fontSize: 6, padding: "1px 3px", borderRadius: 3, background: item.st === "Active" ? "#DBEAFE" : item.st === "Pending" ? "#FEF3C7" : "#D1FAE5", color: item.st === "Active" ? "#1E40AF" : item.st === "Pending" ? "#92400E" : "#065F46" }}>{item.st}</span>
            </div>
            <div style={{ color: GRAY }}>Elder: {item.elder} · Volunteer: {item.vol} ({item.loc})</div>
          </div>
        ))}
      </div>
    </div>
  );
}


// ─── Phone Frame with Home Button & Notch ───────────────────────────────────

function Phone({
  title,
  subtitle,
  children,
  isSketch = true,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  isSketch?: boolean;
}) {
  return (
    <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ height: LH, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginBottom: 2 }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: INK, textAlign: "center", fontFamily: isSketch ? "'Patrick Hand', sans-serif" : "inherit" }}>
          {title}
        </span>
        {subtitle && <span style={{ fontSize: 7.5, color: GRAY, lineHeight: 1 }}>{subtitle}</span>}
      </div>
      <div style={{ width: PW, height: PH, border: `2.2px solid ${INK}`, borderRadius: 28, background: "#fff", overflow: "hidden", position: "relative", boxShadow: `3px 4px 0 rgba(0,0,0,0.12)`, display: "flex", flexDirection: "column" }}>
        {/* Ear speaker notch */}
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 56, height: 10, background: INK, borderRadius: "0 0 6px 6px", zIndex: 20 }}/>
        {/* Inner Screen Content */}
        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", paddingBottom: 28 }}>
          {children}
        </div>
        {/* Classic Circular Sketch Home Button */}
        <div style={{ position: "absolute", bottom: 4, left: "50%", transform: "translateX(-50%)", width: 22, height: 22, borderRadius: "50%", border: `1.5px solid ${INK}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 20 }}>
          <div style={{ width: 8, height: 8, border: `1px solid ${GRAY}`, borderRadius: 2 }}/>
        </div>
      </div>
    </div>
  );
}

// ─── Inline Horizontal Red Arrow ─────────────────────────────────────────────

function HArrow({ note }: { note?: string }) {
  const cy = LH + PH / 2;
  return (
    <div style={{ width: GAP, flexShrink: 0, height: TH, position: "relative" }}>
      <div style={{ position: "absolute", top: cy - 1.25, left: 0, right: 0, height: 2.5, background: RED }}/>
      <div style={{ position: "absolute", top: cy, right: -1, transform: "translateY(-50%)", width: 0, height: 0, borderTop: "6px solid transparent", borderBottom: "6px solid transparent", borderLeft: `11px solid ${RED}` }}/>
      <div style={{ position: "absolute", top: cy, left: 0, transform: "translate(-50%, -50%)", width: 8, height: 8, borderRadius: "50%", background: RED }}/>
      {note && (
        <div style={{ position: "absolute", top: cy - 18, left: "50%", transform: "translateX(-50%)", background: RED, color: "#fff", fontSize: 6.5, fontWeight: 800, padding: "2px 5px", borderRadius: 3, whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "0.04em" }}>
          {note}
        </div>
      )}
    </div>
  );
}

// ─── Row Section Header ───────────────────────────────────────────────────────

function RowLabel({ text, count, icon }: { text: string; count: string; icon: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: `0 ${PAD}px 14px` }}>
      <div style={{ flex: 1, height: 1, background: "#DDD" }}/>
      <div style={{ background: INK, color: "#fff", fontSize: 9.5, fontWeight: 800, padding: "5px 14px", borderRadius: 20, letterSpacing: "0.08em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6 }}>
        <span>{icon}</span>
        <span>{text}</span>
        <span style={{ opacity: 0.6, fontSize: 8.5 }}>({count})</span>
      </div>
      <div style={{ flex: 1, height: 1, background: "#DDD" }}/>
    </div>
  );
}

// ─── Main App Component ───────────────────────────────────────────────────────

export default function App() {
  const [filter, setFilter] = useState<"all" | "elder" | "volunteer" | "admin">("all");
  const [showArrows, setShowArrows] = useState(true);
  const [isSketch, setIsSketch] = useState(true);

  // Trigger direct download of the wireframe sheets
  const handleDownloadSheet1 = () => {
    const link = document.createElement("a");
    link.href = "/src/imports/helpinghands_wireframe_sheet_elder_volunteer.jpg";
    link.download = "HelpingHands_Elderly_Flow_Wireframe.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadSheet2 = () => {
    const link = document.createElement("a");
    link.href = "/src/imports/helpinghands_wireframe_sheet_volunteer_admin.jpg";
    link.download = "HelpingHands_Volunteer_Admin_Wireframe.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="wireframe-container" style={{ fontFamily: "'Patrick Hand', 'Nunito', sans-serif", background: BG, minHeight: "100vh", color: INK }}>
      {/* Header bar */}
      <div style={{ background: INK, padding: "12px 24px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, position: "sticky", top: 0, zIndex: 50, boxShadow: "0 2px 10px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: "#fff", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 16, color: INK }}>H</div>
          <div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 16, letterSpacing: "-0.01em" }}>
              HelpingHands · Low-Fidelity Navigation Wireframe
            </div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 10 }}>
              Exact App Mirror · Hand-Drawn Sketch Spec with Download Tools
            </div>
          </div>
        </div>

        {/* Controls & Download Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {/* Flow filter pills */}
          <div style={{ background: "rgba(255,255,255,0.12)", padding: "3px", borderRadius: 10, display: "flex", gap: 3 }}>
            {[
              { id: "all", label: "All Flows (14)" },
              { id: "elder", label: "👵 Elderly (6)" },
              { id: "volunteer", label: "🤝 Volunteer (4)" },
              { id: "admin", label: "🛡️ Admin (4)" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setFilter(t.id as any)}
                style={{ border: "none", background: filter === t.id ? "#fff" : "transparent", color: filter === t.id ? INK : "rgba(255,255,255,0.8)", padding: "4px 10px", borderRadius: 7, fontSize: 9, fontWeight: 700, cursor: "pointer" }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowArrows(!showArrows)}
            style={{ border: `1px solid ${RED}`, background: showArrows ? "rgba(229,62,62,0.2)" : "transparent", color: showArrows ? "#FEB2B2" : "#fff", padding: "4px 10px", borderRadius: 8, fontSize: 9, fontWeight: 700, cursor: "pointer" }}
          >
            {showArrows ? "✓ Red Arrows On" : "✕ Red Arrows Off"}
          </button>

          {/* Direct Download Buttons */}
          <button
            onClick={handleDownloadSheet1}
            style={{ border: "none", background: RED, color: "#fff", padding: "5px 12px", borderRadius: 8, fontSize: 9.5, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
          >
            <span>⬇️</span> Download Sheet 1 (Elderly)
          </button>

          <button
            onClick={handleDownloadSheet2}
            style={{ border: "none", background: "#2563EB", color: "#fff", padding: "5px 12px", borderRadius: 8, fontSize: 9.5, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
          >
            <span>⬇️</span> Download Sheet 2 (Vol & Admin)
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div style={{ overflowX: "auto", padding: "24px 0 40px" }}>
        <div style={{ width: "fit-content", minWidth: "100%", margin: "0 auto", padding: `0 ${PAD}px` }}>

          {/* ── ROW 1: ELDERLY & CAREGIVER FLOW ── */}
          {(filter === "all" || filter === "elder") && (
            <div style={{ marginBottom: 32, background: "rgba(255,255,255,0.7)", padding: "20px 16px 24px", borderRadius: 24, border: `1px solid ${BRDR}` }}>
              <RowLabel text="Elderly / Caregiver User Flow" count="Screens 1–6" icon="👵"/>
              <div style={{ display: "flex", alignItems: "flex-start", overflowX: "auto", paddingBottom: 8 }}>
                <Phone title="1. Member Log In" subtitle="app/index.tsx" isSketch={isSketch}>
                  <ElderScreen1 isSketch={isSketch}/>
                </Phone>

                {showArrows && <HArrow note="Register / Setup"/>}

                <Phone title="2. Account Setup" subtitle="app/elder/account-setup.tsx" isSketch={isSketch}>
                  <ElderScreen2 isSketch={isSketch}/>
                </Phone>

                {showArrows && <HArrow note="Request Help"/>}

                <Phone title="3. Request Help" subtitle="app/elder/request-help.tsx" isSketch={isSketch}>
                  <ElderScreen3 isSketch={isSketch}/>
                </Phone>

                {showArrows && <HArrow note="Matched"/>}

                <Phone title="4. Status & Tracking" subtitle="app/elder/request-status.tsx" isSketch={isSketch}>
                  <ElderScreen4 isSketch={isSketch}/>
                </Phone>

                {showArrows && <HArrow note="Reschedule"/>}

                <Phone title="5. Reschedule Modal" subtitle="Calendar & Clock Dial" isSketch={isSketch}>
                  <ElderScreen5 isSketch={isSketch}/>
                </Phone>

                {showArrows && <HArrow note="Rate & Finish"/>}

                <Phone title="6. Rate Volunteer" subtitle="app/elder/rating.tsx" isSketch={isSketch}>
                  <ElderScreen6 isSketch={isSketch}/>
                </Phone>
              </div>
            </div>
          )}

          {/* ── ROW 2: VOLUNTEER FLOW ── */}
          {(filter === "all" || filter === "volunteer") && (
            <div style={{ marginBottom: 32, background: "rgba(255,255,255,0.7)", padding: "20px 16px 24px", borderRadius: 24, border: `1px solid ${BRDR}` }}>
              <RowLabel text="Volunteer User Flow" count="Screens 1–4" icon="🤝"/>
              <div style={{ display: "flex", alignItems: "flex-start", overflowX: "auto", paddingBottom: 8 }}>
                <Phone title="1. ID Verification" subtitle="app/volunteer/verification.tsx" isSketch={isSketch}>
                  <VolScreen1 isSketch={isSketch}/>
                </Phone>

                {showArrows && <HArrow note="Admin Approved"/>}

                <Phone title="2. Request Feed" subtitle="app/volunteer/requests.tsx" isSketch={isSketch}>
                  <VolScreen2 isSketch={isSketch}/>
                </Phone>

                {showArrows && <HArrow note="Accept Task"/>}

                <Phone title="3. Active Task" subtitle="app/volunteer/task.tsx" isSketch={isSketch}>
                  <VolScreen3 isSketch={isSketch}/>
                </Phone>

                {showArrows && <HArrow note="In-App Chat"/>}

                <Phone title="4. Live Chat" subtitle="app/volunteer/chat.tsx" isSketch={isSketch}>
                  <VolScreen4 isSketch={isSketch}/>
                </Phone>
              </div>
            </div>
          )}

          {/* ── ROW 3: ADMINISTRATOR FLOW ── */}
          {(filter === "all" || filter === "admin") && (
            <div style={{ marginBottom: 24, background: "rgba(255,255,255,0.7)", padding: "20px 16px 24px", borderRadius: 24, border: `1px solid ${BRDR}` }}>
              <RowLabel text="Administrator Control Panel" count="Screens 1–4" icon="🛡️"/>
              <div style={{ display: "flex", alignItems: "flex-start", overflowX: "auto", paddingBottom: 8 }}>
                <Phone title="1. Admin Sign In" subtitle="app/admin/login.tsx" isSketch={isSketch}>
                  <AdminScreen1 isSketch={isSketch}/>
                </Phone>

                {showArrows && <HArrow note="Authenticated"/>}

                <Phone title="2. System Dashboard" subtitle="app/admin/dashboard.tsx" isSketch={isSketch}>
                  <AdminScreen2 isSketch={isSketch}/>
                </Phone>

                {showArrows && <HArrow note="Audit Volunteer"/>}

                <Phone title="3. Volunteer Audit" subtitle="Document Review" isSketch={isSketch}>
                  <AdminScreen3 isSketch={isSketch}/>
                </Phone>

                {showArrows && <HArrow note="Live Audit"/>}

                <Phone title="4. Request Oversight" subtitle="Community Audit Logs" isSketch={isSketch}>
                  <AdminScreen4 isSketch={isSketch}/>
                </Phone>
              </div>
            </div>
          )}

          {/* ── Legend ── */}
          <div style={{ margin: "16px 0 0", padding: "12px 18px", border: `1px solid ${BRDR}`, borderRadius: 12, background: "#fff", display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 9.5, fontWeight: 800, color: INK, textTransform: "uppercase", letterSpacing: "0.08em" }}>Legend</span>
            {[
              { color: RED, label: "Red Arrow = Directional Navigation" },
              { color: RED, label: "Red Circle = Trigger Button Node" },
              { color: INK, label: "Ink Frame = Hand-Drawn Phone Chassis with Home Button" },
              { color: GRAY, label: "Dashed Box / X-Box = Document Upload / Image Placeholder" },
            ].map(({ color, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 18, height: 3, background: color, borderRadius: 2 }}/>
                <span style={{ fontSize: 9, color: GRAY }}>{label}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}


