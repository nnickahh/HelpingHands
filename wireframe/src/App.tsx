// HelpingHands · Low-Fidelity Navigation Wireframe
// 2 rows × 4 phone frames · monochrome + red arrows

const RED = "#DC2626"
const INK = "#1A1A1A"
const GRAY = "#888"
const LITE = "#BDBDBD"
const BRDR = "#CCCCCC"
const FILL = "#F4F4F4"
const BG   = "#F6F5F1"

const PW = 210   // phone frame width
const PH = 452   // phone frame height
const LH = 28    // label height above phone
const TH = LH + PH  // total phone cell height = 480
const GAP = 38   // horizontal gap (arrow space)
const PAD = 40   // left/right canvas padding

// ─── Atoms ───────────────────────────────────────────────────────────────────

function SBar() {
  return (
    <div style={{ height: 34, paddingTop: 18, paddingLeft: 13, paddingRight: 10,
      display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontSize: 9.5, fontWeight: 700, color: INK, fontFamily: "monospace" }}>9:41</span>
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        <svg width="14" height="8" viewBox="0 0 14 8">
          <rect x="0" y="5" width="2.5" height="3" rx="0.4" fill={LITE}/>
          <rect x="3.5" y="3.5" width="2.5" height="4.5" rx="0.4" fill={GRAY}/>
          <rect x="7" y="1.5" width="2.5" height="6.5" rx="0.4" fill={INK}/>
          <rect x="10.5" y="0" width="2.5" height="8" rx="0.4" fill={INK}/>
        </svg>
        <svg width="14" height="9" viewBox="0 0 14 9" fill="none" stroke={INK} strokeWidth="1.1">
          <path d="M0.5 6.5C0.5 6.5 3 2 7 2C11 2 13.5 6.5 13.5 6.5" opacity="0.4" strokeLinecap="round"/>
          <path d="M2.5 6.5C2.5 6.5 4.5 4 7 4C9.5 4 11.5 6.5 11.5 6.5" opacity="0.75" strokeLinecap="round"/>
          <circle cx="7" cy="7.5" r="1" fill={INK} stroke="none"/>
        </svg>
        <svg width="22" height="10" viewBox="0 0 22 10" fill="none">
          <rect x="0.5" y="0.5" width="19" height="9" rx="2" stroke={INK} strokeWidth="1.2"/>
          <rect x="19.5" y="3" width="2" height="4" rx="1" fill={INK} opacity="0.5"/>
          <rect x="2" y="2" width="13" height="6" rx="1" fill={INK}/>
        </svg>
      </div>
    </div>
  )
}

function BkHdr({ title }: { title: string }) {
  return (
    <div style={{ height: 40, display: "flex", alignItems: "center", padding: "0 13px",
      borderBottom: `1px solid ${BRDR}`, gap: 8 }}>
      <span style={{ fontSize: 19, color: GRAY, lineHeight: 1, fontWeight: 300 }}>‹</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: INK, flex: 1, letterSpacing: "-0.01em" }}>{title}</span>
    </div>
  )
}

function WInput({ ph, dots }: { ph: string; dots?: boolean }) {
  return (
    <div style={{ height: 36, border: `1.5px solid ${BRDR}`, borderRadius: 20,
      padding: "0 14px", display: "flex", alignItems: "center", marginBottom: 9, background: "#fff" }}>
      <span style={{ fontSize: 10.5, color: dots ? INK : LITE }}>
        {dots ? "●●●●●●●●" : ph}
      </span>
    </div>
  )
}

function WBtn({ label, outline }: { label: string; outline?: boolean }) {
  return (
    <div style={{ height: 38, background: outline ? "#fff" : INK,
      border: `1.5px solid ${INK}`, borderRadius: 22,
      display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 9 }}>
      <span style={{ fontSize: 11.5, fontWeight: 700, color: outline ? INK : "#fff" }}>{label}</span>
    </div>
  )
}

function XBox({ w, h, label }: { w?: number | string; h: number; label?: string }) {
  return (
    <div style={{ width: w ?? "100%", height: h, border: `1.5px solid ${BRDR}`,
      borderRadius: 6, position: "relative", background: "#fff", overflow: "hidden", flexShrink: 0 }}>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} preserveAspectRatio="none">
        <line x1="0" y1="0" x2="100%" y2="100%" stroke={LITE} strokeWidth="1.2"/>
        <line x1="100%" y1="0" x2="0" y2="100%" stroke={LITE} strokeWidth="1.2"/>
      </svg>
      {label && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 8.5, color: GRAY, textAlign: "center",
          padding: "4px", lineHeight: 1.3, pointerEvents: "none" }}>{label}</div>
      )}
    </div>
  )
}

function Avatar({ size, label }: { size: number; label?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginBottom: 4 }}>
      <div style={{ width: size, height: size, borderRadius: "50%", border: `2px solid ${INK}`,
        display: "flex", alignItems: "center", justifyContent: "center", background: "#fff" }}>
        <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 28 28" fill="none"
          stroke={GRAY} strokeWidth="1.8" strokeLinecap="round">
          <circle cx="14" cy="10" r="5"/>
          <path d="M4 25c0-5 4.5-8.5 10-8.5s10 3.5 10 8.5"/>
        </svg>
      </div>
      {label && <div style={{ fontSize: 12, fontWeight: 700, color: INK }}>{label}</div>}
    </div>
  )
}

function Steps({ items, active }: { items: string[]; active: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "10px 13px 6px" }}>
      {items.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", flex: i < items.length - 1 ? 1 : 0 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <div style={{ width: 21, height: 21, borderRadius: "50%",
              background: i < active ? INK : i === active ? INK : "#fff",
              border: `1.5px solid ${i < active ? INK : i === active ? INK : BRDR}`,
              display: "flex", alignItems: "center", justifyContent: "center" }}>
              {i < active
                ? <span style={{ fontSize: 9, color: "#fff", fontWeight: 700 }}>✓</span>
                : <span style={{ fontSize: 9, color: i === active ? "#fff" : GRAY, fontWeight: 600 }}>{i + 1}</span>}
            </div>
            <span style={{ fontSize: 7.5, color: i <= active ? INK : GRAY, textAlign: "center",
              width: 44, lineHeight: 1.25, fontWeight: i === active ? 700 : 400 }}>{s}</span>
          </div>
          {i < items.length - 1 && (
            <div style={{ flex: 1, height: 1.5, background: i < active ? INK : BRDR, margin: "0 3px", marginBottom: 13 }}/>
          )}
        </div>
      ))}
    </div>
  )
}

function Divider({ label }: { label?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7, margin: "8px 13px" }}>
      <div style={{ flex: 1, height: 1, background: BRDR }}/>
      {label && <span style={{ fontSize: 8, color: GRAY, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>}
      {label && <div style={{ flex: 1, height: 1, background: BRDR }}/>}
    </div>
  )
}

// ─── 8 Screen Content Components ─────────────────────────────────────────────

function Screen1() {
  return (
    <div style={{ background: "#fff", height: "100%", display: "flex", flexDirection: "column" }}>
      <SBar/>
      {/* Logo bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        padding: "8px 0 9px", borderBottom: `1px solid ${BRDR}` }}>
        <div style={{ width: 20, height: 20, border: `1.5px solid ${INK}`, borderRadius: 4,
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 11, fontWeight: 900, color: INK }}>H</span>
        </div>
        <span style={{ fontSize: 13, fontWeight: 800, color: INK }}>HelpingHands</span>
      </div>
      <div style={{ flex: 1, padding: "20px 18px 14px" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <Avatar size={72} label="Log In"/>
        </div>
        <WInput ph="Email / Phone Number"/>
        <WInput ph="Password" dots/>
        <div style={{ height: 6 }}/>
        <WBtn label="Log In"/>
        <div style={{ textAlign: "center", marginTop: 10 }}>
          <span style={{ fontSize: 10, color: GRAY }}>Not registered yet?  </span>
          <span style={{ fontSize: 10, color: INK, textDecoration: "underline", fontWeight: 700 }}>Sign Up</span>
        </div>
      </div>
    </div>
  )
}

function Screen2() {
  return (
    <div style={{ background: "#fff", height: "100%" }}>
      <SBar/>
      <BkHdr title="ID Verification"/>
      <Steps items={["Personal", "ID Upload", "Review"]} active={1}/>
      <Divider/>
      <div style={{ padding: "4px 13px 0" }}>
        <XBox h={80} label={"Upload ID Document\n(Photo or file attachment)"}/>
        <div style={{ height: 10 }}/>
        <WInput ph="Emergency Contact Name"/>
        <WInput ph="Emergency Contact Phone"/>
        {/* Pending banner */}
        <div style={{ border: `1.5px dashed ${BRDR}`, borderRadius: 8, padding: "9px 11px",
          marginBottom: 10, display: "flex", gap: 8, alignItems: "flex-start", background: FILL }}>
          <span style={{ fontSize: 14, lineHeight: 1 }}>⏳</span>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: INK, marginBottom: 2 }}>Pending Admin Verification</div>
            <div style={{ fontSize: 8.5, color: GRAY, lineHeight: 1.35 }}>
              Requests visible only after approval is granted by admin.
            </div>
          </div>
        </div>
        <WBtn label="Submit for Verification"/>
      </div>
    </div>
  )
}

function Screen3() {
  const reqs = [
    { icon: "▣", title: "Grocery Assistance",    sub: "Wed, 10:00 AM · Jurong East · 1.2 km" },
    { icon: "✚", title: "Medicine Collection",   sub: "Thu, 2:30 PM · Clementi · 2.4 km" },
    { icon: "▤", title: "Appointment Escort",    sub: "Fri, 9:00 AM · Buona Vista · 3.8 km" },
  ]
  return (
    <div style={{ background: FILL, height: "100%" }}>
      <div style={{ background: "#fff" }}>
        <SBar/>
        <BkHdr title="Available Requests"/>
      </div>
      <div style={{ padding: "10px 12px 0" }}>
        {/* Search */}
        <div style={{ height: 34, border: `1.5px solid ${BRDR}`, borderRadius: 20,
          padding: "0 12px", display: "flex", alignItems: "center", gap: 8,
          background: "#fff", marginBottom: 9 }}>
          <span style={{ fontSize: 12, color: LITE }}>○</span>
          <span style={{ fontSize: 10.5, color: LITE }}>Search requests…</span>
        </div>
        {/* Filter chips */}
        <div style={{ display: "flex", gap: 5, marginBottom: 10, flexWrap: "wrap" }}>
          {["All", "Groceries", "Medicine", "Appt.", "Digital"].map((c, i) => (
            <div key={c} style={{ height: 22, padding: "0 9px", border: `1.2px solid ${i === 0 ? INK : BRDR}`,
              borderRadius: 11, display: "flex", alignItems: "center",
              background: i === 0 ? INK : "#fff" }}>
              <span style={{ fontSize: 8.5, fontWeight: 600, color: i === 0 ? "#fff" : GRAY }}>{c}</span>
            </div>
          ))}
        </div>
        {/* Request cards */}
        {reqs.map((r, i) => (
          <div key={i} style={{ background: "#fff", border: `1.2px solid ${BRDR}`, borderRadius: 9,
            padding: "9px 10px", marginBottom: 8 }}>
            <div style={{ display: "flex", gap: 7, alignItems: "flex-start", marginBottom: 6 }}>
              <XBox w={40} h={40} label={r.icon}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: INK, marginBottom: 2 }}>{r.title}</div>
                <div style={{ fontSize: 8.5, color: GRAY, lineHeight: 1.35 }}>{r.sub}</div>
              </div>
            </div>
            <div style={{ borderTop: `1px solid ${BRDR}`, paddingTop: 7, display: "flex", justifyContent: "flex-end" }}>
              <div style={{ height: 24, background: INK, borderRadius: 12, padding: "0 10px",
                display: "inline-flex", alignItems: "center" }}>
                <span style={{ fontSize: 9, color: "#fff", fontWeight: 700 }}>Accept Request</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Screen4() {
  return (
    <div style={{ background: "#fff", height: "100%" }}>
      <SBar/>
      <BkHdr title="Active Task"/>
      <Steps items={["Accepted", "In Progress", "Completed"]} active={1}/>
      <Divider/>
      <div style={{ padding: "4px 13px 0" }}>
        {/* Task card */}
        <div style={{ border: `1.2px solid ${BRDR}`, borderRadius: 9, padding: "9px 10px", marginBottom: 10 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 7 }}>
            <XBox w={36} h={36} label="▣"/>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: INK }}>Grocery Assistance</div>
              <div style={{ fontSize: 8.5, color: GRAY }}>Wed, 22 Jan · 10:00 AM</div>
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${BRDR}`, paddingTop: 7, fontSize: 8.5, color: GRAY }}>
            📍 Block 134, Jurong East Ave 1
          </div>
        </div>
        <Divider label="Requesting Elder"/>
        {/* Elder info */}
        <div style={{ border: `1.2px solid ${BRDR}`, borderRadius: 9, padding: "9px 10px", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", border: `1.5px solid ${BRDR}`,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={GRAY} strokeWidth="2">
                <circle cx="12" cy="8.5" r="4.5"/>
                <path d="M4 21c0-4.5 3.6-7.5 8-7.5s8 3 8 7.5"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: INK }}>Mdm Maria Lim</div>
              <div style={{ fontSize: 8.5, color: GRAY }}>72 yrs · Jurong East</div>
            </div>
            <div style={{ display: "flex", gap: 5 }}>
              <div style={{ width: 28, height: 28, border: `1.2px solid ${BRDR}`, borderRadius: 7,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>📞</div>
              <div style={{ width: 28, height: 28, border: `1.2px solid ${BRDR}`, borderRadius: 7,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>💬</div>
            </div>
          </div>
        </div>
        {/* Mobility note */}
        <div style={{ border: `1px dashed ${BRDR}`, borderRadius: 7, padding: "7px 10px", marginBottom: 12 }}>
          <div style={{ fontSize: 8, fontWeight: 700, color: GRAY, textTransform: "uppercase", marginBottom: 2 }}>Mobility Notes</div>
          <div style={{ fontSize: 9, color: INK }}>Uses walking frame. Please use bags.</div>
        </div>
        <WBtn label="✓ Mark Task as Completed"/>
      </div>
    </div>
  )
}

function Screen5() {
  return (
    <div style={{ background: "#fff", height: "100%", display: "flex", flexDirection: "column" }}>
      <SBar/>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        padding: "8px 0 9px", borderBottom: `1px solid ${BRDR}` }}>
        <div style={{ width: 20, height: 20, border: `1.5px solid ${INK}`, borderRadius: 4,
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 11, fontWeight: 900, color: INK }}>H</span>
        </div>
        <span style={{ fontSize: 13, fontWeight: 800, color: INK }}>HelpingHands</span>
      </div>
      <div style={{ flex: 1, padding: "14px 18px" }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: INK, textAlign: "center", marginBottom: 14 }}>
          Create Account
        </div>
        {/* Role toggle */}
        <div style={{ display: "flex", gap: 8, marginBottom: 13 }}>
          {[["I need help", true], ["I'm a Caregiver", false]].map(([lbl, active]) => (
            <div key={lbl as string} style={{ flex: 1, height: 38, border: `1.5px solid ${active ? INK : BRDR}`,
              borderRadius: 22, display: "flex", alignItems: "center", justifyContent: "center",
              background: active ? INK : "#fff" }}>
              <span style={{ fontSize: 9.5, fontWeight: 700, color: active ? "#fff" : GRAY }}>{lbl as string}</span>
            </div>
          ))}
        </div>
        <WInput ph="Full Name"/>
        <WInput ph="Phone Number"/>
        <div style={{ fontSize: 8.5, fontWeight: 700, color: GRAY, textTransform: "uppercase",
          letterSpacing: "0.05em", marginBottom: 8 }}>Preferred Language</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, marginBottom: 13 }}>
          {["English", "中文 Mandarin", "Melayu", "Tamil"].map((l, i) => (
            <div key={l} style={{ height: 32, border: `1.5px solid ${i === 0 ? INK : BRDR}`,
              borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
              background: i === 0 ? INK : "#fff" }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: i === 0 ? "#fff" : GRAY }}>{l}</span>
            </div>
          ))}
        </div>
        <WBtn label="Create Account"/>
      </div>
    </div>
  )
}

function Screen6() {
  const cats = [["▣","Groceries"],["✚","Medicine"],["▤","Appointment"],["●","Digital Help"],["▦","Carrying"],["♿","Accompany"]]
  return (
    <div style={{ background: "#fff", height: "100%" }}>
      <SBar/>
      <BkHdr title="Request Help"/>
      <div style={{ padding: "9px 12px 0" }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: INK, marginBottom: 9 }}>What do you need help with?</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 13 }}>
          {cats.map(([icon, lbl], i) => (
            <div key={lbl} style={{ height: 56, border: `1.5px solid ${i === 0 ? INK : BRDR}`,
              borderRadius: 9, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 3,
              background: i === 0 ? FILL : "#fff" }}>
              <span style={{ fontSize: 16, color: GRAY }}>{icon}</span>
              <span style={{ fontSize: 8, color: INK, fontWeight: 600, textAlign: "center", lineHeight: 1.2 }}>{lbl}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <WInput ph="Date"/>
          <WInput ph="Time"/>
        </div>
        <WInput ph="Location / Address"/>
        <div style={{ height: 52, border: `1.5px solid ${BRDR}`, borderRadius: 9,
          padding: "9px 12px", marginBottom: 10, background: "#fff" }}>
          <span style={{ fontSize: 9.5, color: LITE }}>Mobility Notes (optional)…</span>
        </div>
        <WBtn label="Submit Request"/>
      </div>
    </div>
  )
}

function Screen7() {
  return (
    <div style={{ background: FILL, height: "100%" }}>
      <div style={{ background: "#fff" }}>
        <SBar/>
        <BkHdr title="Request Status"/>
      </div>
      <Steps items={["Pending", "Accepted", "In Progress", "Done"]} active={1}/>
      <div style={{ padding: "2px 12px 0" }}>
        <div style={{ border: `1.2px solid ${BRDR}`, borderRadius: 8, padding: "8px 10px",
          background: "#fff", display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: 14 }}>✅</span>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: INK }}>Volunteer Matched!</div>
            <div style={{ fontSize: 8.5, color: GRAY }}>Grocery Assistance · Wed, 10:00 AM</div>
          </div>
        </div>
        <Divider label="Your Volunteer"/>
        <div style={{ border: `1.2px solid ${BRDR}`, borderRadius: 9, padding: "11px 10px", background: "#fff", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", border: `1.5px solid ${BRDR}`,
                display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={GRAY} strokeWidth="2">
                  <circle cx="12" cy="8.5" r="4.5"/>
                  <path d="M4 21c0-4.5 3.6-7.5 8-7.5s8 3 8 7.5"/>
                </svg>
              </div>
              <div style={{ position: "absolute", bottom: -1, right: -1, width: 13, height: 13,
                borderRadius: "50%", background: INK, border: "1.5px solid #fff",
                display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#fff", fontSize: 6.5, fontWeight: 800 }}>✓</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: INK }}>Ben Lim Wei Jie</div>
              <div style={{ fontSize: 8.5, color: GRAY }}>★★★★★ 4.9 · 47 tasks done</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {["📞  Call", "💬  Message"].map(lbl => (
              <div key={lbl} style={{ height: 32, border: `1.2px solid ${BRDR}`, borderRadius: 16,
                display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 9.5, fontWeight: 700, color: INK }}>{lbl}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <WBtn label="Cancel Request" outline/>
          <WBtn label="Reschedule" outline/>
        </div>
      </div>
    </div>
  )
}

function Screen8() {
  return (
    <div style={{ background: "#fff", height: "100%" }}>
      <SBar/>
      <BkHdr title="Rate Your Volunteer"/>
      <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Avatar size={62}/>
        <div style={{ fontSize: 13, fontWeight: 700, color: INK, marginTop: 4 }}>Ben Lim Wei Jie</div>
        <div style={{ fontSize: 9, color: GRAY, marginBottom: 14 }}>Grocery Assistance · Wed, 10:00 AM</div>
        <Divider label="How did it go?"/>
        <div style={{ display: "flex", gap: 6, margin: "10px 0 14px" }}>
          {[1,2,3,4,5].map(s => (
            <span key={s} style={{ fontSize: 27, color: s <= 4 ? INK : LITE, lineHeight: 1 }}>★</span>
          ))}
        </div>
        <div style={{ width: "100%" }}>
          <div style={{ fontSize: 8.5, fontWeight: 700, color: GRAY, textTransform: "uppercase",
            letterSpacing: "0.05em", marginBottom: 7 }}>Leave a comment (optional)</div>
          <div style={{ height: 68, border: `1.5px solid ${BRDR}`, borderRadius: 9,
            padding: "9px 12px", marginBottom: 12, background: "#fff", width: "100%", boxSizing: "border-box" as const }}>
            <span style={{ fontSize: 9.5, color: LITE }}>"Ben was very helpful and patient…"</span>
          </div>
          <WBtn label="Submit Rating & Confirm"/>
        </div>
      </div>
    </div>
  )
}

// ─── Phone frame ─────────────────────────────────────────────────────────────

function Phone({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ height: LH, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 11.5, fontWeight: 800, color: INK, textAlign: "center",
          fontFamily: "inherit", letterSpacing: "-0.01em" }}>{title}</span>
      </div>
      <div style={{ width: PW, height: PH, border: `2px solid ${INK}`, borderRadius: 26,
        background: "#fff", overflow: "hidden", position: "relative",
        boxShadow: `3px 4px 0 ${LITE}` }}>
        {/* Notch */}
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: 60, height: 11, background: INK, borderRadius: "0 0 7px 7px", zIndex: 10 }}/>
        {/* Home bar */}
        <div style={{ position: "absolute", bottom: 5, left: "50%", transform: "translateX(-50%)",
          width: 45, height: 3, background: INK, borderRadius: 2, zIndex: 10, opacity: 0.35 }}/>
        <div style={{ height: "100%", overflowY: "auto", overflowX: "hidden", scrollbarWidth: "none" as const }}>
          {children}
        </div>
      </div>
    </div>
  )
}

// ─── Inline horizontal arrow ──────────────────────────────────────────────────

function HArrow({ note }: { note?: string }) {
  const cy = LH + PH / 2  // vertical center within the total cell height
  return (
    <div style={{ width: GAP, flexShrink: 0, height: TH, position: "relative" }}>
      {/* Line */}
      <div style={{ position: "absolute", top: cy - 1.25, left: 0, right: 0, height: 2.5, background: RED }}/>
      {/* Arrowhead */}
      <div style={{ position: "absolute", top: cy, right: -1, transform: "translateY(-50%)",
        width: 0, height: 0,
        borderTop: "6px solid transparent",
        borderBottom: "6px solid transparent",
        borderLeft: `11px solid ${RED}` }}/>
      {/* Optional note above */}
      {note && (
        <div style={{ position: "absolute", top: cy - 18, left: "50%", transform: "translateX(-50%)",
          background: RED, color: "#fff", fontSize: 7, fontWeight: 800, padding: "2px 5px",
          borderRadius: 3, whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "0.04em" }}>
          {note}
        </div>
      )}
    </div>
  )
}

// ─── Vertical branch connector (between row 1 and row 2) ─────────────────────

function VertBranch() {
  // The branch arrow drops from the bottom of Screen 1 (first column)
  // x = PAD(40) + PW/2(105) = 145 from the canvas left edge
  // We use padding: "0 PAD" on the phone rows, so relative to row-inner padding box, x = PW/2 = 105
  const x = 105
  const H = 88  // total height of this connector section

  return (
    <div style={{ position: "relative", height: H, padding: `0 ${PAD}px` }}>
      {/* Vertical shaft */}
      <div style={{ position: "absolute", left: PAD + x, top: 0, width: 2.5, height: H - 12, background: RED }}/>
      {/* Arrowhead (downward) */}
      <div style={{ position: "absolute", left: PAD + x - 6, top: H - 14,
        width: 0, height: 0,
        borderLeft: "6.5px solid transparent",
        borderRight: "6.5px solid transparent",
        borderTop: `13px solid ${RED}` }}/>
      {/* Label */}
      <div style={{ position: "absolute", left: PAD + x + 12, top: 26,
        background: RED, color: "#fff", fontSize: 8, fontWeight: 800,
        padding: "3px 8px", borderRadius: 4, whiteSpace: "nowrap",
        textTransform: "uppercase", letterSpacing: "0.06em" }}>
        Elder / Caregiver Branch ↓
      </div>
    </div>
  )
}

// ─── Section row label ────────────────────────────────────────────────────────

function RowLabel({ text, isSecond }: { text: string; isSecond?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12,
      padding: `${isSecond ? 0 : 0}px ${PAD}px 14px` }}>
      <div style={{ flex: 1, height: 1, background: "#DDD" }}/>
      <div style={{ background: INK, color: "#fff", fontSize: 9, fontWeight: 700,
        padding: "4px 14px", borderRadius: 20, letterSpacing: "0.1em", textTransform: "uppercase",
        whiteSpace: "nowrap" }}>
        {text}
      </div>
      <div style={{ flex: 1, height: 1, background: "#DDD" }}/>
    </div>
  )
}

// ─── Entry arrow (left of Screen 1) ──────────────────────────────────────────

function EntryArrow() {
  const cy = LH + PH / 2
  return (
    <div style={{ width: 36, flexShrink: 0, height: TH, position: "relative" }}>
      <div style={{ position: "absolute", top: cy - 1.25, left: 0, right: 4, height: 2.5, background: RED }}/>
      <div style={{ position: "absolute", top: cy, right: -3, transform: "translateY(-50%)",
        width: 0, height: 0,
        borderTop: "6px solid transparent",
        borderBottom: "6px solid transparent",
        borderLeft: `11px solid ${RED}` }}/>
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

const CANVAS_W = PAD * 2 + PW * 4 + GAP * 3 + 36 // +36 for entry arrow

export default function App() {
  return (
    <div style={{ fontFamily: "'Nunito', -apple-system, Arial, sans-serif",
      background: BG, minHeight: "100vh" }}>

      {/* Header bar */}
      <div style={{ background: INK, padding: "13px 28px",
        display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, background: "#fff", borderRadius: 6,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 900, fontSize: 17, color: INK }}>H</div>
        <div>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 17, letterSpacing: "-0.01em" }}>
            HelpingHands
          </div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10.5 }}>
            Low-Fidelity Navigation Wireframe · 8 Screens · 2 User Flows
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <span style={{ border: "1px solid rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.7)",
            fontSize: 9, fontWeight: 700, padding: "3px 10px", borderRadius: 12,
            textTransform: "uppercase", letterSpacing: "0.07em" }}>Grayscale Wireframe</span>
          <span style={{ border: `1px solid ${RED}40`, color: RED, background: `${RED}15`,
            fontSize: 9, fontWeight: 700, padding: "3px 10px", borderRadius: 12,
            textTransform: "uppercase", letterSpacing: "0.07em" }}>Red Arrows = Navigation</span>
        </div>
      </div>

      {/* Wireframe canvas */}
      <div style={{ overflowX: "auto", padding: "36px 0 52px" }}>
        <div style={{ width: CANVAS_W, margin: "0 auto", minWidth: CANVAS_W }}>

          {/* ── Row 1 ── */}
          <RowLabel text="Volunteer Flow · Screens 1–4"/>
          <div style={{ display: "flex", padding: `0 ${PAD - 36}px 0 0`, alignItems: "flex-start" }}>
            <EntryArrow/>
            <Phone title="1. Registration / Log In">
              <Screen1/>
            </Phone>
            <HArrow note="Volunteer Path"/>
            <Phone title="2. ID Verification">
              <Screen2/>
            </Phone>
            <HArrow note="Post-Approval"/>
            <Phone title="3. Request Feed">
              <Screen3/>
            </Phone>
            <HArrow/>
            <Phone title="4. Task Progress">
              <Screen4/>
            </Phone>
          </div>

          {/* ── Branch connector ── */}
          <VertBranch/>

          {/* ── Row 2 ── */}
          <RowLabel text="Elder / Caregiver Flow · Screens 5–8" isSecond/>
          <div style={{ display: "flex", padding: `0 ${PAD - 36}px 0 0`, alignItems: "flex-start" }}>
            {/* Spacer to align Screen 5 under Screen 1 */}
            <div style={{ width: 36, flexShrink: 0 }}/>
            <Phone title="5. Elder Account Setup">
              <Screen5/>
            </Phone>
            <HArrow/>
            <Phone title="6. Create Assistance Request">
              <Screen6/>
            </Phone>
            <HArrow/>
            <Phone title="7. Status & Tracking">
              <Screen7/>
            </Phone>
            <HArrow/>
            <Phone title="8. Rating & Confirmation">
              <Screen8/>
            </Phone>
          </div>

          {/* ── Legend ── */}
          <div style={{ margin: "36px 40px 0", padding: "14px 18px",
            border: `1px solid ${BRDR}`, borderRadius: 10, background: "#fff",
            display: "flex", gap: 28, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: INK, textTransform: "uppercase",
              letterSpacing: "0.08em" }}>Legend</span>
            {[
              { color: RED, label: "Directional navigation arrow" },
              { color: INK, label: "Phone frame / UI element" },
              { color: GRAY, label: "Placeholder text / icon" },
              { color: LITE, label: "X = Image placeholder" },
            ].map(({ color, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 22, height: 3, background: color, borderRadius: 2 }}/>
                <span style={{ fontSize: 10, color: GRAY }}>{label}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
