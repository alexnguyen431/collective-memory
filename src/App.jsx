import { useState, useRef, useEffect, useCallback, createContext, useContext } from "react";

const ThemeCtx = createContext();
const THEMES = {
  dark: {
    bg: "#111B21", surface: "#1F2C34", border: "rgba(134,150,160,0.12)", text: "#E9EDEF", text2: "#8696A0", text3: "rgba(134,150,160,0.75)", accent: "#00A884", red: "#EA4335",
    pill: "rgba(233,237,239,0.06)", pillBorder: "rgba(233,237,239,0.1)", pillActive: "rgba(0,168,132,0.12)", pillActiveText: "#00A884",
    prompt: "rgba(233,237,239,0.04)", promptBorder: "rgba(233,237,239,0.06)", promptHover: "rgba(233,237,239,0.08)", scroll: "rgba(233,237,239,0.06)",
    waHdr: "#1F2C34", waChat: "#0B141A", waInput: "#1F2C34", waField: "#2A3942",
    waBubOut: "#005C4B", waBubIn: "#202C33", waText: "#E9EDEF", waText2: "#8696A0",
    waDiv: "rgba(134,150,160,0.08)", waBar: "#E9EDEF", waHdrIcon: "#00A884", waHdrIcon2: "#8696A0",
    waNotice: "rgba(255,255,255,.03)", waHome: "rgba(233,237,239,.12)",
    waBubSh: "none", waFieldBd: "none", waMicBg: "#2A3942",
    waBg: `url("data:image/svg+xml,%3Csvg width='400' height='400' viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='.008'%3E%3Ccircle cx='50' cy='50' r='1.5'/%3E%3Ccircle cx='150' cy='80' r='1'/%3E%3Ccircle cx='250' cy='30' r='1.5'/%3E%3Ccircle cx='100' cy='180' r='1'/%3E%3Ccircle cx='200' cy='150' r='1.5'/%3E%3Ccircle cx='300' cy='200' r='1'/%3E%3Ccircle cx='50' cy='300' r='1.5'/%3E%3Ccircle cx='320' cy='350' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
    waInterBg: "rgba(0,168,132,0.08)", waInterBorder: "rgba(0,168,132,0.2)", waInterText: "#00A884",
    waThreadBg: "rgba(233,237,239,0.04)", waThreadBorder: "rgba(233,237,239,0.08)",
    waThreadBarBg: "rgba(233,237,239,0.04)", waThreadPill: "rgba(233,237,239,0.06)", waThreadPillActive: "rgba(0,168,132,0.15)",
  },
  light: {
    bg: "#FFFFFF", surface: "#F7F5F2", border: "rgba(17,27,33,0.06)", text: "#111B21", text2: "#667781", text3: "rgba(102,119,129,0.75)", accent: "#008069", red: "#DC3545",
    pill: "rgba(17,27,33,0.03)", pillBorder: "rgba(17,27,33,0.08)", pillActive: "rgba(0,128,105,0.1)", pillActiveText: "#008069",
    prompt: "#F7F5F2", promptBorder: "rgba(17,27,33,0.06)", promptHover: "#EFEDE9", scroll: "rgba(17,27,33,0.06)",
    waHdr: "#008069", waChat: "#EFEAE2", waInput: "#F0F2F5", waField: "#FFFFFF",
    waBubOut: "#D9FDD3", waBubIn: "#FFFFFF", waText: "#111B21", waText2: "#667781",
    waDiv: "rgba(0,0,0,0.05)", waBar: "#FFFFFF", waHdrIcon: "rgba(255,255,255,.9)", waHdrIcon2: "rgba(255,255,255,.8)",
    waNotice: "rgba(255,255,255,.7)", waHome: "rgba(0,0,0,.15)",
    waBubSh: "0 1px 1px rgba(0,0,0,0.06)", waFieldBd: "1px solid rgba(0,0,0,0.06)", waMicBg: "#F0F2F5",
    waBg: `url("data:image/svg+xml,%3Csvg width='400' height='400' viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23c9b99a' fill-opacity='.06'%3E%3Ccircle cx='50' cy='50' r='2'/%3E%3Ccircle cx='150' cy='80' r='1.5'/%3E%3Ccircle cx='250' cy='30' r='2'/%3E%3Ccircle cx='100' cy='180' r='1.5'/%3E%3Ccircle cx='200' cy='150' r='2'/%3E%3Ccircle cx='300' cy='200' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
    waInterBg: "rgba(0,128,105,0.06)", waInterBorder: "rgba(0,128,105,0.2)", waInterText: "#008069",
    waThreadBg: "rgba(0,0,0,0.03)", waThreadBorder: "rgba(0,0,0,0.06)",
    waThreadBarBg: "rgba(0,0,0,0.03)", waThreadPill: "rgba(0,0,0,0.04)", waThreadPillActive: "rgba(0,128,105,0.12)",
  },
};

const THREAD_COLORS = ["#00A884","#5856D6","#FF6B6B","#FF9500","#007AFF","#34C759","#FF2D55","#AF52DE"];

const SCN = {
  couple: { label: "Couple", emoji: "💑", groupName: "Marcus & Jenny ✨", desc: "Married couple sharing meals, travel & daily life",
    personas: { marcus: { name: "Marcus", avatar: "M", color: "#5856D6", ctx: ["Spicy food — Thai/Korean","Shellfish allergy","Window seats","Runs 3x/week","Gym Mon/Wed/Fri 6:30am","Book club 2nd Thursday","Mom's bday April 12","Wants pottery","Considering PM shift"] }, jenny: { name: "Jenny", avatar: "J", color: "#FF6B6B", ctx: ["Vegetarian — Italian/Indian","Hates cilantro","Aisle seats","Yoga Tue/Thu/Sat","Night owl","Parents visiting Mar 15–22","Friend's wedding May 3","Half marathon Oct","Photography courses"] } },
    shared: ["Married 1 yr","2BR Brooklyn","Cat: Mochi","Both hate cilantro","Eating less meat","Date <$80 walkable","Cook weekends","Japan Nov $3.8K/$6K","Want 2nd cat summer","Kitchen reno next yr","$200/wk groceries"],
    starter: [
      { id: "s1", role: "user", sender: "jenny", content: "@MetaAI we need to plan meals for next week — my parents arrive Saturday 😅", topic: "Meal Planning" },
      { id: "s2", role: "assistant", sender: "ai", content: "Let's keep weeknights simple! I'm thinking dal Monday, pesto pasta Wednesday, and a stir-fry Friday where @Marcus can add extra chili. For Saturday when your parents arrive — do they have dietary needs beyond vegetarian? That'll help me plan something special.", topic: "Meal Planning", interactive: { type: "options", title: "Weeknight dinner plan", options: [{ label: "🍛 Monday: Dal + rice", desc: "Simple, vegetarian, 30 min" },{ label: "🍝 Wednesday: Pesto pasta", desc: "Cilantro-free, @Jenny's fave" },{ label: "🥘 Friday: Stir-fry", desc: "Extra chili for @Marcus" }], action: "Confirm these three?" } },
      { id: "s3", role: "user", sender: "marcus", content: "All three work. Her mom is also vegetarian. @MetaAI I want to cook Saturday — ideas?", topic: "Meal Planning" },
      { id: "s4", role: "assistant", sender: "ai", content: "Love that @Marcus! How about a build-your-own taco bar? Veggie base with black beans and roasted sweet potato. Everyone picks toppings — keep cilantro quarantined 😄 Prep Saturday afternoon before they arrive. Want me to build the grocery list?", topic: "Meal Planning", interactive: { type: "confirm", prompt: "Build grocery list within $200 weekly budget?", yes: "Yes, build it", no: "Not yet" } },
      { id: "s5", role: "user", sender: "jenny", content: "btw @MetaAI can we talk about the Japan trip? How much more do we need to save?", topic: "Japan Trip" },
      { id: "s6", role: "assistant", sender: "ai", content: "You're at $3,800 of your $6,000 goal — $2,200 to go! At your current savings rate, you'd hit the target by mid-October, just in time for November. If you want a buffer, you could bump weekly savings by about $50. Want me to map out a rough budget breakdown for the trip?", topic: "Japan Trip" },
      { id: "s7", role: "user", sender: "marcus", content: "@MetaAI what about date night this Friday? It's my turn to pick", topic: "Date Night" },
      { id: "s8", role: "assistant", sender: "ai", content: "Nice @Marcus! Here are some walkable options under $80:", topic: "Date Night", interactive: { type: "options", title: "Friday date night ideas", options: [{ label: "🍷 Wine bar + small plates", desc: "That new place on Court St — veggie menu" },{ label: "🎨 Paint & sip night", desc: "$35/person, BYOB, walkable" },{ label: "🎲 Board game café", desc: "You two love games — $10 cover + drinks" }], action: "Pick one?" } },
    ],
    prompts: { marcus: ["@MetaAI help us figure out this weekend schedule","@MetaAI how much can we spend on reno and still hit Japan?","@MetaAI what should we cook tonight?","@MetaAI plan date night Friday — my pick"], jenny: ["@MetaAI help plan meals for my parents visiting","@MetaAI help plan our Japan trip","@MetaAI fun weekend activity besides dinner?","@MetaAI kitchen reno budget — help us think it through"] },
  },
  friends: { label: "Friends", emoji: "👯", groupName: "Japan 2026 🗾", desc: "Four friends planning a group trip to Japan",
    personas: { sam: { name: "Sam", avatar: "S", color: "#007AFF", ctx: ["Remote — flexible","Vegetarian","$2,500 budget","Temples + nature","Afraid of flying","DSLR photographer"] }, jo: { name: "Jo", avatar: "J", color: "#34C759", ctx: ["Teacher — Mar 20–31 only","Street food lover","$3K budget","Nightlife","Been to Tokyo","Basic Japanese"] }, nadia: { name: "Nadia", avatar: "N", color: "#FF2D55", ctx: ["Freelancer","Peanut allergy","$2K budget","Shopping + culture","First time Asia","Needs Wi-Fi"] } },
    shared: ["Friends since college","Japan late March","Tokyo/Kyoto/Osaka","$2K–$3K/person","Split Airbnb","Ryokan 1 night","Nadia: peanut-free"],
    starter: [
      { id: "f1", role: "user", sender: "jo", content: "Spring break confirmed: March 20–31 🙌", topic: "Dates" },
      { id: "f2", role: "user", sender: "sam", content: "@MetaAI help us plan! What route makes sense?", topic: "Itinerary" },
      { id: "f3", role: "assistant", sender: "ai", content: "11-day window! Here's a route balancing everyone:", topic: "Itinerary", interactive: { type: "options", title: "Proposed route", options: [{ label: "🗼 Tokyo — 4 nights", desc: "City, nightlife, shopping" },{ label: "⛩️ Kyoto — 3 nights", desc: "Temples, nature, ryokan" },{ label: "🏯 Osaka — 2 nights", desc: "Street food, day trips" }], action: "Lock this route?" } },
      { id: "f4", role: "user", sender: "nadia", content: "@MetaAI can we estimate total cost per person?", topic: "Budget" },
      { id: "f5", role: "assistant", sender: "ai", content: "Rough estimate per person: flights ~$800, accommodation ~$600 (mix of Airbnb + ryokan), transport ~$250 (JR Pass), food + activities ~$400. Total: roughly $2,050–$2,500. That fits @Sam and @Nadia's budget, and @Jo has room for extra nightlife 🎉", topic: "Budget" },
    ],
    prompts: { sam: ["@MetaAI best nature day trip from Tokyo?","@MetaAI ryokan for everyone's budget?","@MetaAI fair cost-splitting plan?","@MetaAI best Kyoto photo spots?"], jo: ["@MetaAI Tokyo nightlife beyond Shibuya?","@MetaAI build full 10-day itinerary","@MetaAI transport between cities?","@MetaAI peanut-safe street food for @Nadia?"], nadia: ["@MetaAI best shopping in Tokyo + Osaka?","@MetaAI total cost with flights?","@MetaAI Kyoto — hotel or Airbnb?","@MetaAI peanut-free Tokyo restaurants?"] },
  },
  family: { label: "Family", emoji: "👨‍👩‍👧", groupName: "The Chens 🏠", desc: "Family coordinating life across Portland & Seattle",
    personas: { david: { name: "David", avatar: "D", color: "#5856D6", ctx: ["Dad 58, semi-retired","Low carb","National parks","Handles finances"] }, mei: { name: "Mei", avatar: "M", color: "#FF9500", ctx: ["Mom 55, clinic part-time","Garden lover","Lactose intolerant","K-drama fan"] }, lily: { name: "Lily", avatar: "L", color: "#34C759", ctx: ["Daughter 27, eng in Seattle","Vegetarian","Visits every 6–8 wks","Cat allergy"] } },
    shared: ["D&M Portland, Lily Seattle","Mei bday May 14","National park trip planned","David low-carb, Mei dairy-free, Lily veg"],
    starter: [
      { id: "c1", role: "user", sender: "lily", content: "Mom's birthday in May! @MetaAI can you help us plan something?", topic: "Mom's Birthday" },
      { id: "c2", role: "assistant", sender: "ai", content: "@Mei's birthday is May 14 (Wednesday). Let's pick a weekend:", topic: "Mom's Birthday", interactive: { type: "timepicker", title: "Which weekend works?", slots: ["May 10–11 (before)","May 17–18 (after)","May 14 (actual day, midweek)"] } },
      { id: "c3", role: "user", sender: "david", content: "@MetaAI the national park trip — can we start figuring out dates and which park?", topic: "National Park Trip" },
      { id: "c4", role: "assistant", sender: "ai", content: "Great timing @David! For summer, I'd suggest late July or August. Given @Lily is in Seattle and you're in Portland, Crater Lake is a perfect midpoint — about 4 hours from both of you. Alternatively, Olympic National Park is stunning and closer to @Lily. Want me to compare options?", topic: "National Park Trip" },
    ],
    prompts: { david: ["@MetaAI plan the national park trip","@MetaAI birthday dinner for all 3 diets","@MetaAI bathroom reno cost?","@MetaAI family photo album setup"], mei: ["@MetaAI when is @Lily visiting?","@MetaAI K-dramas for @David too","@MetaAI spring garden plan","@MetaAI family phone plan worth it?"], lily: ["@MetaAI best weekend to visit?","@MetaAI national park trip plan","@MetaAI smart home for parents?","@MetaAI Mom's birthday gift ideas"] },
  },
  cofounders: { label: "Co-founders", emoji: "🚀", groupName: "Calico HQ 🧠", desc: "Two co-founders building an AI startup",
    personas: { alex: { name: "Alex", avatar: "A", color: "#007AFF", ctx: ["CEO — product/fundraising","Ex-Stripe PM","Morning person","Customer discovery","Hire eng Q2"] }, ren: { name: "Ren", avatar: "R", color: "#FF2D55", ctx: ["CTO — eng/infra","Ex-Figma eng","Night owl","Building v1 solo","Anti scope creep"] } },
    shared: ["Calico: AI contracts for SMBs","Pre-seed bootstrapped","8mo runway","v1 by April","<5 people","Seed Q3","Next.js+Python+OpenAI","Weekly sync Mon 11am"],
    starter: [
      { id: "x1", role: "user", sender: "ren", content: "I just finished the contract upload flow. @MetaAI can you help us figure out what's left before we can launch v1?", topic: "V1 Launch" },
      { id: "x2", role: "assistant", sender: "ai", content: "Nice work @Ren! Based on what you've shared, here's what I'd break the remaining work into:", topic: "V1 Launch", interactive: { type: "options", title: "V1 remaining work", options: [{ label: "📄 PDF parsing polish", desc: "Handle edge cases — scanned docs, multi-page" },{ label: "📊 Summary dashboard", desc: "Show key clauses, risks, dates at a glance" },{ label: "🔐 Auth + onboarding", desc: "Login flow, first-run experience" }], action: "Confirm these are the blockers?" } },
      { id: "x3", role: "user", sender: "alex", content: "@MetaAI we also need to start thinking about fundraising. When should we start reaching out to investors?", topic: "Fundraising" },
      { id: "x4", role: "assistant", sender: "ai", content: "Good timing to think about this @Alex. With 8 months of runway, I'd start warm intros now and formal pitches in about 6 weeks. That gives @Ren time to get v1 polished so you have a live product to demo — investors at seed stage want to see a working product, not just slides. Want me to help draft a rough fundraising timeline?", topic: "Fundraising", interactive: { type: "confirm", prompt: "Draft a 12-week fundraising timeline leading to your Q3 seed round?", yes: "Yes, draft it", no: "Not yet" } },
    ],
    prompts: { alex: ["@MetaAI help us prioritize what ships in v1 vs later","@MetaAI draft a pitch deck outline for seed investors","@MetaAI when should we start hiring? Walk through timing","@MetaAI help write a cold outreach email to investors"], ren: ["@MetaAI should we switch to Anthropic from OpenAI? Tradeoffs?","@MetaAI how long will the remaining v1 work take?","@MetaAI help define what's NOT in v1 — keep us focused","@MetaAI what's our biggest tech debt risk right now?"] },
  },
};

const buildSys = (scn, who, personas, indCtx, shared) => {
  const names = Object.values(personas).map(p => p.name);
  const ctx = Object.entries(indCtx).map(([k, items]) => `${personas[k].name}: ${items.join("; ")}`).join("\n");
  return `You are Meta AI in WhatsApp group: ${names.join(", ")}. Tagged @MetaAI.
Scenario: ${scn.desc}. From: ${who}
CONTEXTS:\n${ctx}
SHARED: ${shared.join("; ")}
RULES: Warm, concise (2-4 paragraphs). No bullets unless asked. @Name tags. Max 2 emoji. Everyone sees everything. Never break character.
NOTE: Users may reply to you without tagging @MetaAI — treat these as directed at you if they follow your previous message or are clearly continuing the conversation.

THREAD TOPIC: You MUST include a topic tag at the START of your response: <topic>Short Topic Name</topic>
This helps organize the conversation. Use 2-4 word topic names like "Meal Planning", "Japan Budget", "Date Night", "Demo Sprint". Reuse existing topics when continuing a discussion.

INTERACTIVE (optional, after main text):
<interactive>{"type":"options","title":"...","options":[{"label":"...","desc":"..."}],"action":"..."}</interactive>
OR: <interactive>{"type":"confirm","prompt":"...","yes":"...","no":"..."}</interactive>
OR: <interactive>{"type":"timepicker","title":"...","slots":["...","..."]}</interactive>
Only when offering concrete choices.

CONTEXT UPDATES — IMPORTANT: After EVERY response, carefully check if the conversation revealed ANY new information about individuals or the group. This includes preferences, dislikes, decisions, plans, facts, schedule changes, budget updates, or anything worth remembering. If someone says they like or dislike something, that's a context update. If a decision is made, that's a shared context update. ALWAYS include the update block when there's new info:
<context_update>{"individual_KEY":["new fact about person"],"shared":["new shared fact"]}</context_update>
Use lowercase keys matching persona keys (e.g. "individual_marcus"). Be specific and concise in facts (e.g. "Hates board games", "Found a good contractor for kitchen reno").`;
};

function parseResponse(text) {
  let interactive = null, topic = null, updates = null, clean = text;
  const tm = clean.match(/<topic>(.*?)<\/topic>/);
  if (tm) { topic = tm[1].trim(); clean = clean.replace(tm[0], "").trim(); }
  const im = clean.match(/<interactive>([\s\S]*?)<\/interactive>/);
  if (im) { try { interactive = JSON.parse(im[1]); } catch {} clean = clean.replace(im[0], "").trim(); }
  const cm = clean.match(/<context_update>([\s\S]*?)<\/context_update>/);
  if (cm) { try { updates = JSON.parse(cm[1]); } catch {} clean = clean.replace(cm[0], "").trim(); }
  return { clean, topic, interactive, updates };
}

function renderMd(text) {
  const parts = [];
  let remaining = text;
  let key = 0;
  while (remaining.length > 0) {
    const boldIdx = remaining.indexOf("**");
    if (boldIdx !== -1) {
      const endIdx = remaining.indexOf("**", boldIdx + 2);
      if (endIdx !== -1) {
        if (boldIdx > 0) parts.push(<span key={key++}>{remaining.slice(0, boldIdx)}</span>);
        parts.push(<strong key={key++}>{remaining.slice(boldIdx + 2, endIdx)}</strong>);
        remaining = remaining.slice(endIdx + 2);
        continue;
      }
    }
    // Single * italic (only if no ** nearby)
    const italIdx = remaining.indexOf("*");
    if (italIdx !== -1 && remaining[italIdx + 1] !== "*") {
      const endIt = remaining.indexOf("*", italIdx + 1);
      if (endIt !== -1 && remaining[endIt - 1] !== "*" && endIt > italIdx + 1) {
        if (italIdx > 0) parts.push(<span key={key++}>{remaining.slice(0, italIdx)}</span>);
        parts.push(<em key={key++}>{remaining.slice(italIdx + 1, endIt)}</em>);
        remaining = remaining.slice(endIt + 1);
        continue;
      }
    }
    parts.push(<span key={key++}>{remaining}</span>);
    break;
  }
  return parts.length > 0 ? parts : text;
}

function renderM(text, personas) {
  const all = [...Object.values(personas).map(p => p.name), "MetaAI"];
  const re = new RegExp(`(${all.map(n => `@${n}`).join("|")})`, "gi");
  return text.split(re).map((p, i) => {
    if (p.toLowerCase() === "@metaai") return <span key={i} style={{ color: "#0081FB", fontWeight: 600 }}>@MetaAI</span>;
    const m = Object.values(personas).find(x => p.toLowerCase() === `@${x.name.toLowerCase()}`);
    if (m) return <span key={i} style={{ color: m.color, fontWeight: 600 }}>@{m.name}</span>;
    return <span key={i}>{renderMd(p)}</span>;
  });
}

/* ── Interactive Components ────────────────────────────── */
function OptionsCard({ data, onSelect, personas }) {
  const t = useContext(ThemeCtx); const [sel, setSel] = useState(new Set());
  const toggle = (i) => { const s = new Set(sel); s.has(i) ? s.delete(i) : s.add(i); setSel(s); };
  return (
    <div style={{ marginTop: 6, borderRadius: 10, border: `1px solid ${t.waInterBorder}`, overflow: "hidden", background: t.waInterBg }}>
      {data.title && <div style={{ padding: "7px 10px", fontSize: 11, fontWeight: 600, color: t.waInterText, borderBottom: `1px solid ${t.waInterBorder}` }}>{data.title}</div>}
      {data.options?.map((o, i) => (
        <div key={i} onClick={() => toggle(i)} style={{ padding: "7px 10px", borderBottom: i < data.options.length - 1 ? `1px solid ${t.waInterBorder}40` : "none", cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 8, background: sel.has(i) ? t.waInterText + "12" : "transparent", transition: "background .15s" }}>
          <div style={{ width: 17, height: 17, borderRadius: 5, border: `2px solid ${sel.has(i) ? t.waInterText : t.waText2}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1, background: sel.has(i) ? t.waInterText : "transparent", transition: "all .15s" }}>{sel.has(i) && <svg width="10" height="10" viewBox="0 0 24 24" fill="#fff"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>}</div>
          <div><div style={{ fontSize: 12, fontWeight: 500, color: t.waText, lineHeight: 1.3 }}>{renderM(o.label, personas)}</div>{o.desc && <div style={{ fontSize: 10.5, color: t.waText2, lineHeight: 1.3 }}>{renderM(o.desc, personas)}</div>}</div>
        </div>
      ))}
      {sel.size > 0 && <div onClick={() => onSelect(data.options.filter((_, i) => sel.has(i)).map(o => o.label).join(", "))} style={{ padding: "7px 10px", textAlign: "center", cursor: "pointer", fontSize: 11.5, fontWeight: 600, color: t.waInterText, borderTop: `1px solid ${t.waInterBorder}`, background: t.waInterText + "08" }}>{sel.size === 1 ? "Confirm" : `Confirm these ${sel.size}`} →</div>}
    </div>
  );
}

function ConfirmCard({ data, onSelect }) {
  const t = useContext(ThemeCtx);
  return (
    <div style={{ marginTop: 6, borderRadius: 10, border: `1px solid ${t.waInterBorder}`, overflow: "hidden", background: t.waInterBg }}>
      <div style={{ padding: "8px 12px", fontSize: 12, color: t.waText, lineHeight: 1.4 }}>{data.prompt}</div>
      <div style={{ display: "flex", borderTop: `1px solid ${t.waInterBorder}` }}>
        <div onClick={() => onSelect(data.no || "No")} style={{ flex: 1, padding: "8px", textAlign: "center", cursor: "pointer", fontSize: 12, color: t.waText2, borderRight: `1px solid ${t.waInterBorder}` }}>{data.no || "No"}</div>
        <div onClick={() => onSelect(data.yes || "Yes")} style={{ flex: 1, padding: "8px", textAlign: "center", cursor: "pointer", fontSize: 12, fontWeight: 600, color: t.waInterText }}>{data.yes || "Yes"}</div>
      </div>
    </div>
  );
}

function TimePickerCard({ data, onSelect, activePersona, personas }) {
  const t = useContext(ThemeCtx);
  const [voterMap, setVoterMap] = useState({});
  const hasVoted = activePersona in voterMap;
  const voteChoice = voterMap[activePersona];
  const personaCount = Object.keys(personas || {}).length;
  const tallies = (data.slots || []).map((_, i) => Object.values(voterMap).filter(v => v === i).length);
  const total = Object.keys(voterMap).length;
  const maxVotes = Math.max(...tallies, 0);
  const allVoted = total >= personaCount;
  const remaining = personaCount - total;

  const [sent, setSent] = useState(false);

  const handleVote = (i) => {
    if (hasVoted && voteChoice === i) return;
    const newMap = { ...voterMap, [activePersona]: i };
    setVoterMap(newMap);
    const newTotal = Object.keys(newMap).length;
    if (newTotal >= personaCount && !sent) {
      const newTallies = (data.slots || []).map((_, idx) => Object.values(newMap).filter(v => v === idx).length);
      const maxV = Math.max(...newTallies);
      const winners = data.slots.filter((_, idx) => newTallies[idx] === maxV);
      setSent(true);
      if (winners.length > 1) {
        // Tie — ask AI to facilitate tiebreak
        const tiedNames = winners.join(" vs ");
        setTimeout(() => onSelect(`Poll tied between: ${tiedNames}. Can you help us break the tie?`), 1200);
      } else {
        const winIdx = newTallies.indexOf(maxV);
        setTimeout(() => onSelect(`Poll result: everyone voted — ${data.slots[winIdx]} wins (${Math.round((maxV / newTotal) * 100)}%, ${maxV}/${newTotal} votes)`), 1200);
      }
    }
  };

  // Collect voter names per option for display
  const voterNames = (data.slots || []).map((_, i) =>
    Object.entries(voterMap).filter(([, v]) => v === i).map(([k]) => personas?.[k]?.name || k)
  );

  return (
    <div style={{ marginTop: 6, borderRadius: 10, border: `1px solid ${t.waInterBorder}`, overflow: "hidden", background: t.waInterBg }}>
      <div style={{ padding: "9px 12px 6px", display: "flex", alignItems: "center", gap: 6 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill={t.waInterText}><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z"/></svg>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: t.waText }}>{data.title || "Poll"}</span>
      </div>
      <div style={{ padding: "2px 12px 10px" }}>
        {data.slots?.map((sl, i) => {
          const pct = total > 0 ? Math.round((tallies[i] / total) * 100) : 0;
          const isMyVote = hasVoted && voteChoice === i;
          const isWinner = total > 0 && tallies[i] === maxVotes;
          const showResults = total > 0;
          return (
            <div key={i} onClick={() => handleVote(i)} style={{ marginBottom: 5, cursor: "pointer", borderRadius: 8, overflow: "hidden", border: `1px solid ${isMyVote ? t.waInterText + "40" : t.waInterBorder}`, position: "relative", transition: "all .2s" }}>
              {showResults && (
                <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: `${pct}%`, background: isMyVote ? t.waInterText + "18" : t.waInterText + "08", transition: "width 0.6s ease-out", borderRadius: 8 }} />
              )}
              <div style={{ padding: "9px 12px", display: "flex", alignItems: "center", gap: 10, position: "relative", zIndex: 1 }}>
                {!hasVoted ? (
                  <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${t.waText2}40`, flexShrink: 0 }} />
                ) : isMyVote ? (
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: t.waInterText, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="#fff"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                  </div>
                ) : (
                  <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${t.waText2}20`, flexShrink: 0 }} />
                )}
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 12.5, color: t.waText, fontWeight: isMyVote ? 600 : 400 }}>{sl}</span>
                  {showResults && voterNames[i].length > 0 && (
                    <div style={{ fontSize: 10, color: t.waText2, marginTop: 1 }}>
                      {voterNames[i].map((name, ni) => {
                        const p = Object.values(personas || {}).find(x => x.name === name);
                        return <span key={ni}>{ni > 0 && ", "}<span style={{ color: p?.color || t.waText2, fontWeight: 500 }}>{name}</span></span>;
                      })}
                    </div>
                  )}
                </div>
                {showResults && (
                  <span style={{ fontSize: 11, fontWeight: isWinner ? 600 : 400, color: isWinner ? t.waInterText : t.waText2 }}>{pct}%</span>
                )}
              </div>
            </div>
          );
        })}
        <div style={{ fontSize: 10.5, color: t.waText2, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill={t.waText2}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
          {(() => {
            const winners = (data.slots || []).filter((_, idx) => tallies[idx] === maxVotes && maxVotes > 0);
            const isTie = allVoted && winners.length > 1;
            if (!hasVoted) return `${total} of ${personaCount} · tap to vote as ${personas?.[activePersona]?.name || "you"}`;
            if (isTie) return `⚡ Tied! ${remaining > 0 ? `${remaining} still to vote` : "Waiting for tiebreak..."}`;
            if (allVoted) return `${total} of ${personaCount} · all voted ✓`;
            return `${total} of ${personaCount} · ${remaining} still to vote · tap to change`;
          })()}
        </div>
      </div>
    </div>
  );
}

function InterBlock({ data, onSelect, personas, activePersona }) {
  if (!data) return null;
  if (data.type === "options") return <OptionsCard data={data} onSelect={onSelect} personas={personas} />;
  if (data.type === "confirm") return <ConfirmCard data={data} onSelect={onSelect} />;
  if (data.type === "timepicker") return <TimePickerCard data={data} onSelect={onSelect} activePersona={activePersona} personas={personas} />;
  return null;
}

/* ── Bubble ─────────────────────────────────────────────── */
function Bubble({ msg, personas, onSelect, activePersona }) {
  const t = useContext(ThemeCtx);
  const isAI = msg.sender === "ai";
  const out = !isAI && msg.sender === activePersona;
  const sender = !isAI ? personas[msg.sender] : null;
  const senderKey = !isAI ? msg.sender : null;
  const showAvatar = !out;
  return (
    <div style={{ alignSelf: out ? "flex-end" : "flex-start", maxWidth: "84%", marginBottom: 1.5, animation: "msgIn .18s ease", display: "flex", gap: 4, alignItems: "flex-start" }}>
      {showAvatar && (
        <div style={{ flexShrink: 0, marginTop: 2 }}>
          {isAI ? (
            <MetaAIAvatar size={22} />
          ) : (
            <PersonaAvatar persona={sender} personaKey={senderKey} size={22} borderRadius={11} />
          )}
        </div>
      )}
      <div style={{ background: out ? t.waBubOut : t.waBubIn, borderRadius: out ? "10px 2px 10px 10px" : "2px 10px 10px 10px", padding: "5px 9px 3px", boxShadow: t.waBubSh, minWidth: 0 }}>
        {out && sender && <div style={{ fontSize: 10.5, fontWeight: 700, color: sender.color, marginBottom: .5 }}>~ {sender.name}</div>}
        {!out && !isAI && sender && <div style={{ fontSize: 10.5, fontWeight: 700, color: sender.color, marginBottom: .5 }}>~ {sender.name}</div>}
        {isAI && <div style={{ fontSize: 10.5, fontWeight: 700, color: "#0081FB", marginBottom: .5 }}>Meta AI</div>}
        <div style={{ fontSize: 13, lineHeight: 1.42, color: t.waText, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{renderM(msg.content, personas)}</div>
        {!out && msg.interactive && <InterBlock data={msg.interactive} onSelect={onSelect} personas={personas} activePersona={activePersona} />}
        <div style={{ fontSize: 9, color: t.waText2, opacity: .55, textAlign: "right", marginTop: 1, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 3 }}>
          {msg.time}{out && <svg width="13" height="7" viewBox="0 0 16 8" fill="none"><path d="M1 4l3 3 5-6M6 4l3 3 5-6" stroke="#53BDEB" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        </div>
      </div>
    </div>
  );
}

function Dots() { const t = useContext(ThemeCtx); return <div style={{ alignSelf: "flex-start", display: "flex", gap: 4, alignItems: "flex-start", marginBottom: 1.5 }}><div style={{ flexShrink: 0, marginTop: 2 }}><MetaAIAvatar size={22} /></div><div style={{ background: t.waBubIn, borderRadius: "2px 10px 10px 10px", padding: "10px 16px", display: "flex", gap: 5, boxShadow: t.waBubSh }}>{[0, 150, 300].map(d => <div key={d} style={{ width: 6, height: 6, borderRadius: "50%", background: t.waText2, opacity: .35, animation: `dotB 1.2s ${d}ms ease-in-out infinite` }} />)}</div></div>; }

function Pill({ children, onClick, active, color }) {
  const t = useContext(ThemeCtx);
  return <button onClick={onClick} style={{
    padding: "7px 16px", borderRadius: 50,
    border: `1px solid ${t.text}`,
    background: active ? "#25D366" : "transparent",
    color: active ? "#111B21" : t.text, fontSize: 14, fontFamily: "inherit", cursor: "pointer",
    fontWeight: active ? 500 : 400, letterSpacing: "-.01em",
    transition: "background .25s ease, border-color .25s ease",
    display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap",
  }}>{children}</button>;
}

/* ── Typewriter for new context items ───────────────────── */
function Typewriter({ text, color }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed(""); setDone(false);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      if (i <= text.length) { setDisplayed(text.slice(0, i)); }
      else { setDone(true); clearInterval(iv); }
    }, 28);
    return () => clearInterval(iv);
  }, [text]);
  return (
    <span>
      {displayed}
      {!done && <span style={{ display: "inline-block", width: 2, height: 12, background: color, marginLeft: 1, animation: "blink 0.6s step-end infinite", verticalAlign: "text-bottom" }} />}
    </span>
  );
}

/* ── Meta AI Avatar — gradient ring on white ────────────── */
function MetaAIAvatar({ size = 22 }) {
  const ringSize = Math.round(size * 0.6);
  const r = ringSize / 2;
  const strokeW = ringSize * 0.2;
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 0 0 0.5px rgba(0,0,0,.08)" }}>
      <svg width={ringSize} height={ringSize} viewBox={`0 0 ${ringSize} ${ringSize}`} style={{ display: "block" }}>
        <defs>
          <linearGradient id="metaRing" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00E5FF"/>
            <stop offset="30%" stopColor="#0081FB"/>
            <stop offset="60%" stopColor="#A040F0"/>
            <stop offset="100%" stopColor="#FF80E0"/>
          </linearGradient>
        </defs>
        <circle cx={r} cy={r} r={r - strokeW / 2} fill="none" stroke="url(#metaRing)" strokeWidth={strokeW}/>
      </svg>
    </div>
  );
}

/* ── Avatar component — real photos with solid color fallback ── */
const AVATAR_PHOTOS = {
  marcus: "https://randomuser.me/api/portraits/thumb/men/32.jpg",
  jenny: "https://randomuser.me/api/portraits/thumb/women/44.jpg",
  sam: "https://randomuser.me/api/portraits/thumb/men/22.jpg",
  jo: "https://randomuser.me/api/portraits/thumb/women/65.jpg",
  nadia: "https://randomuser.me/api/portraits/thumb/women/28.jpg",
  david: "https://randomuser.me/api/portraits/thumb/men/52.jpg",
  mei: "https://randomuser.me/api/portraits/thumb/women/51.jpg",
  lily: "https://randomuser.me/api/portraits/thumb/women/17.jpg",
  alex: "https://randomuser.me/api/portraits/thumb/men/36.jpg",
  ren: "https://randomuser.me/api/portraits/thumb/women/38.jpg",
};
const AVATAR_COLORS = {
  marcus: "#5856D6", jenny: "#FF6B6B", sam: "#007AFF", jo: "#34C759",
  nadia: "#FF2D55", david: "#5856D6", mei: "#FF9500", lily: "#34C759",
  alex: "#007AFF", ren: "#FF2D55",
};

function PersonaAvatar({ persona, size = 22, borderRadius = 11, personaKey }) {
  const key = personaKey || persona?.name?.toLowerCase() || "default";
  const [imgFailed, setImgFailed] = useState(false);
  const photoUrl = AVATAR_PHOTOS[key];
  const bg = AVATAR_COLORS[key] || persona?.color || "#888";
  const initial = persona?.avatar || persona?.name?.[0] || "?";
  const fs = Math.round(size * 0.42);

  if (photoUrl && !imgFailed) {
    return (
      <div style={{ width: size, height: size, borderRadius, overflow: "hidden", flexShrink: 0, background: bg }}>
        <img src={photoUrl} alt={persona?.name} onError={() => setImgFailed(true)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>
    );
  }

  return (
    <div style={{ width: size, height: size, borderRadius, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ color: "#fff", fontSize: fs, fontWeight: 700, fontFamily: "'Helvetica Neue',sans-serif", lineHeight: 1 }}>{initial}</span>
    </div>
  );
}

function CtxCard({ title, items, icon, color, newItems, persona, personaKey }) {
  const t = useContext(ThemeCtx);
  return (
    <div style={{ background: t.surface, borderRadius: 12, border: `1px solid ${t.border}`, overflow: "hidden" }}>
      <div style={{ padding: "10px 14px", borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", gap: 8 }}>
        {persona ? <PersonaAvatar persona={persona} personaKey={personaKey} size={22} borderRadius={11} /> : <div style={{ width: 22, height: 22, borderRadius: 11, background: color + "14", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color }}>{icon}</div>}
        <span style={{ fontSize: 12, fontWeight: 500, color: t.text, letterSpacing: "-0.01em" }}>{title}</span>
        <span style={{ marginLeft: "auto", fontSize: 10, color: t.text3 }}>{items.length}</span>
      </div>
      <div style={{ padding: "6px 14px 10px" }}>
        {items.map((it, i) => { const isN = newItems?.includes(it); return <div key={`${it}-${i}`} style={{ fontSize: 11.5, lineHeight: 1.5, color: isN ? color : t.text2, padding: "2px 0 2px 10px", borderLeft: `2px solid ${isN ? color : t.border}`, background: isN ? color + "0A" : "transparent", fontWeight: isN ? 550 : 400, transition: "all .4s", borderRadius: isN ? "0 5px 5px 0" : 0 }}>{isN ? <Typewriter text={it} color={color} /> : it}</div>; })}
      </div>
    </div>
  );
}

/* WA logo SVG */
const WALogo = () => (
  <svg width="131" height="31" viewBox="0 0 131 31" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M49.0664 17.9283H49.0272L46.5619 7.97656H43.5914L41.0748 17.8077H41.0341L38.7573 7.98259H35.5908L39.4102 22.4156H42.6234L45.0269 12.5921H45.0676L47.5133 22.4156H50.6662L54.5398 7.98259H51.4277L49.0664 17.9283ZM64.2187 12.865C63.9149 12.478 63.5144 12.1779 63.0576 11.995C62.4546 11.7675 61.8125 11.6615 61.1683 11.6828C60.5909 11.6917 60.0233 11.8336 59.5097 12.0975C58.9237 12.3912 58.4378 12.8518 58.1134 13.4214H58.0531V7.98259H55.1882V22.4156H58.0531V16.9377C58.0531 15.8731 58.228 15.1081 58.5778 14.6427C58.9277 14.1773 59.4936 13.9451 60.2757 13.9461C60.9617 13.9461 61.4412 14.1587 61.7096 14.5839C61.978 15.0091 62.1137 15.6515 62.1137 16.514V22.4156H64.9786V15.9877C64.9831 15.3938 64.9254 14.801 64.8067 14.219C64.7135 13.7297 64.5127 13.2671 64.2187 12.865ZM76.0401 20.089V14.6608C76.0401 14.0265 75.8989 13.5174 75.6164 13.1334C75.333 12.7467 74.9585 12.436 74.5263 12.2287C74.0601 12.0076 73.5619 11.8616 73.0501 11.7959C72.521 11.7225 71.9875 11.6852 71.4533 11.6843C70.8726 11.6837 70.2932 11.7408 69.7238 11.8547C69.1793 11.9581 68.6563 12.1529 68.1768 12.4307C67.7223 12.6956 67.3353 13.062 67.0459 13.5013C66.7303 14.0055 66.5554 14.5849 66.5392 15.1795H69.4041C69.4584 14.6141 69.6484 14.2085 69.9711 13.9732C70.2938 13.738 70.7461 13.6053 71.3131 13.6053C71.5527 13.6042 71.7921 13.6209 72.0293 13.6551C72.2363 13.6826 72.4358 13.7513 72.6158 13.8571C72.7863 13.96 72.9259 14.1069 73.0199 14.2824C73.1312 14.5116 73.183 14.7652 73.1707 15.0197C73.1855 15.1454 73.1693 15.2728 73.1235 15.3907C73.0778 15.5087 73.0039 15.6138 72.9084 15.6967C72.6804 15.8699 72.4166 15.9899 72.1363 16.048C71.7711 16.1369 71.3996 16.1979 71.0251 16.2305C70.6059 16.2717 70.1817 16.3255 69.7525 16.3918C69.3201 16.4599 68.8917 16.5516 68.4693 16.6662C68.0648 16.7706 67.6817 16.9446 67.3369 17.1804C66.9989 17.4196 66.7216 17.7346 66.5272 18.1002C66.3033 18.5553 66.196 19.059 66.2151 19.5658C66.2026 20.0451 66.2958 20.5213 66.488 20.9606C66.6589 21.3394 66.9173 21.6722 67.2419 21.9316C67.5774 22.1937 67.9619 22.3859 68.3728 22.4971C68.827 22.6221 69.2964 22.6835 69.7675 22.6795C70.4108 22.6796 71.0505 22.5846 71.6659 22.3976C72.2812 22.2107 72.8382 21.8691 73.2838 21.4054C73.2965 21.5786 73.3202 21.7508 73.3547 21.9211C73.3878 22.0886 73.4316 22.2538 73.4859 22.4156H76.396C76.2352 22.1157 76.1386 21.7855 76.1125 21.4461C76.06 20.9957 76.0359 20.5425 76.0401 20.089ZM73.1753 18.3701C73.1721 18.5866 73.1555 18.8026 73.1255 19.017C73.0877 19.2986 72.9949 19.5702 72.8526 19.8161C72.6855 20.0973 72.4487 20.3305 72.165 20.4931C71.8564 20.6821 71.4186 20.7766 70.8517 20.7766C70.6281 20.7769 70.4049 20.7562 70.1852 20.7148C69.9849 20.6807 69.7929 20.6085 69.6198 20.5022C69.4572 20.401 69.3245 20.2584 69.2353 20.089C69.1353 19.8884 69.0866 19.6662 69.0935 19.4422C69.0853 19.2113 69.134 18.9819 69.2353 18.7742C69.3261 18.6035 69.4538 18.4551 69.6092 18.34C69.775 18.2197 69.9594 18.1275 70.155 18.067C70.3635 17.9997 70.576 17.9458 70.7914 17.9057C71.0205 17.8665 71.2437 17.8303 71.4774 17.8047C71.7111 17.779 71.9298 17.7428 72.1348 17.7036C72.3334 17.6659 72.5293 17.6156 72.7214 17.5529C72.888 17.5013 73.0421 17.4155 73.1737 17.3011L73.1753 18.3701ZM81.4005 8.83H78.5356V11.9648H76.7895V13.8858H78.5266V20.0514C78.5077 20.4907 78.5979 20.9279 78.7889 21.324C78.9524 21.6379 79.2012 21.8992 79.5067 22.0779C79.8331 22.2609 80.1913 22.3806 80.5622 22.4307C80.98 22.4925 81.4019 22.5228 81.8242 22.5212C82.1092 22.5212 82.3972 22.5212 82.6943 22.5016C82.9651 22.4913 83.235 22.4641 83.5025 22.4202V20.1916C83.3622 20.2213 83.2202 20.2419 83.0772 20.2534C82.9265 20.267 82.7757 20.2745 82.6128 20.2745C82.1288 20.2745 81.8046 20.1916 81.6418 20.0302C81.4789 19.8689 81.4005 19.5462 81.4005 19.0607V13.8858H83.5025V11.9648H81.396L81.4005 8.83ZM93.2627 17.8348C93.0745 17.507 92.8172 17.224 92.5088 17.0055C92.1849 16.7762 91.8294 16.5954 91.4533 16.4687C91.0567 16.336 90.6481 16.2214 90.2304 16.1264C89.8128 16.0314 89.4298 15.944 89.0392 15.8641C88.687 15.7931 88.3391 15.702 87.9973 15.5912C87.7286 15.5088 87.4786 15.3746 87.2615 15.1961C87.1697 15.1203 87.0964 15.0245 87.0473 14.9161C86.9981 14.8076 86.9745 14.6894 86.978 14.5704C86.9672 14.3862 87.0229 14.2043 87.1348 14.0577C87.2411 13.9276 87.3764 13.8244 87.5299 13.7561C87.6939 13.6872 87.8671 13.643 88.0441 13.6249C88.2195 13.6093 88.3957 13.6028 88.5718 13.6053C89.0342 13.5936 89.4926 13.6939 89.9078 13.8979C90.2832 14.0924 90.4928 14.4663 90.532 15.0197H93.2612C93.2318 14.4506 93.0613 13.8977 92.7651 13.4108C92.5001 12.9966 92.1443 12.648 91.7247 12.3915C91.2857 12.1269 90.8033 11.9421 90.2998 11.8457C89.7583 11.7367 89.2071 11.6827 88.6547 11.6843C88.0984 11.6837 87.5432 11.7342 86.9961 11.8351C86.4846 11.9262 85.9925 12.1042 85.5411 12.3614C85.1129 12.6067 84.7547 12.9576 84.5006 13.3807C84.2195 13.8869 84.0833 14.4608 84.1071 15.0393C84.0942 15.4454 84.1922 15.8473 84.3906 16.2018C84.579 16.5183 84.8368 16.7879 85.1445 16.9904C85.4712 17.207 85.8264 17.377 86.2 17.4956C86.5965 17.6237 87.0052 17.7353 87.4213 17.8288C88.2347 17.9864 89.0355 18.2031 89.8173 18.4772C90.3903 18.6913 90.6768 19.0145 90.6768 19.4467C90.6857 19.6729 90.6218 19.896 90.4943 20.083C90.3752 20.2494 90.2207 20.3874 90.042 20.4871C89.8532 20.5909 89.6498 20.6656 89.4388 20.7088C89.2299 20.7556 89.0166 20.7798 88.8025 20.7811C88.527 20.7817 88.2524 20.7477 87.9853 20.6801C87.7357 20.6181 87.4992 20.5119 87.2871 20.3665C87.0837 20.2232 86.9143 20.0368 86.7911 19.8207C86.6583 19.5756 86.5923 19.3001 86.5996 19.0215H83.8613C83.8642 19.636 84.0279 20.2391 84.3363 20.7706C84.6155 21.225 84.9958 21.6089 85.4476 21.8924C85.9233 22.1838 86.4472 22.3881 86.9946 22.4956C87.5787 22.618 88.174 22.6792 88.7708 22.678C89.3581 22.6786 89.944 22.621 90.5199 22.5061C91.0618 22.402 91.5793 22.1974 92.0459 21.903C92.5269 21.6048 92.9192 21.1832 93.182 20.682C93.4448 20.1808 93.5685 19.6184 93.5401 19.0532C93.5536 18.6304 93.4564 18.2115 93.2582 17.8378L93.2627 17.8348ZM98.9608 7.97958L93.5055 22.4126H96.6976L97.83 19.1994H103.225L104.315 22.4126H107.611L102.212 7.98259L98.9608 7.97958ZM98.6593 16.8336L100.54 11.5381H100.579L102.399 16.8336H98.6593ZM117.522 13.3807C117.128 12.8646 116.624 12.4432 116.046 12.1473C115.388 11.8222 114.66 11.6628 113.926 11.6828C113.312 11.675 112.704 11.8059 112.147 12.0658C111.593 12.3395 111.131 12.77 110.82 13.3038H110.779V11.9648H108.05V26.0752H110.915V21.1234H110.954C111.291 21.6237 111.755 22.0246 112.299 22.2845C112.858 22.5503 113.469 22.6854 114.087 22.6795C114.784 22.6928 115.474 22.5376 116.097 22.2272C116.658 21.94 117.149 21.5322 117.533 21.033C117.925 20.5194 118.216 19.9368 118.392 19.3155C118.581 18.6587 118.676 17.9785 118.674 17.295C118.677 16.5744 118.582 15.8567 118.392 15.1614C118.218 14.5178 117.923 13.9134 117.522 13.3807ZM115.684 18.4545C115.613 18.8291 115.472 19.1871 115.27 19.51C114.927 19.991 114.422 20.3311 113.847 20.467C113.273 20.603 112.668 20.5254 112.147 20.2489C111.832 20.0683 111.565 19.8149 111.369 19.51C111.165 19.1867 111.022 18.8291 110.945 18.4545C110.857 18.0499 110.813 17.6368 110.814 17.2226C110.813 16.8016 110.853 16.3814 110.933 15.9681C111.006 15.5885 111.147 15.2252 111.349 14.896C111.543 14.5883 111.806 14.3302 112.117 14.1421C112.475 13.9325 112.884 13.8279 113.299 13.8406C113.707 13.8296 114.109 13.9341 114.46 14.1421C114.775 14.3346 115.041 14.5972 115.238 14.9096C115.446 15.2412 115.593 15.6073 115.672 15.9907C115.761 16.3964 115.805 16.8105 115.803 17.2257C115.806 17.638 115.768 18.0496 115.69 18.4545H115.684ZM129.829 15.169C129.657 14.5225 129.362 13.9153 128.959 13.3807C128.566 12.8647 128.062 12.4433 127.485 12.1473C126.826 11.8225 126.098 11.6631 125.363 11.6828C124.749 11.6755 124.142 11.8064 123.585 12.0658C123.031 12.3399 122.569 12.7703 122.257 13.3038H122.218V11.9648H119.483V26.0752H122.347V21.1234H122.388C122.724 21.6233 123.188 22.0241 123.732 22.2845C124.29 22.5503 124.902 22.6854 125.52 22.6795C126.217 22.6928 126.907 22.5376 127.531 22.2272C128.092 21.94 128.582 21.5321 128.965 21.033C129.357 20.5194 129.649 19.9368 129.825 19.3155C130.015 18.6589 130.11 17.9786 130.108 17.295C130.114 16.5773 130.022 15.8621 129.835 15.169H129.829ZM127.115 18.4545C127.045 18.8293 126.904 19.1874 126.701 19.51C126.489 19.8342 126.2 20.1005 125.859 20.2848C125.519 20.4691 125.137 20.5657 124.75 20.5657C124.363 20.5657 123.982 20.4691 123.641 20.2848C123.301 20.1005 123.012 19.8342 122.8 19.51C122.597 19.1864 122.453 18.8289 122.376 18.4545C122.289 18.0498 122.245 17.6368 122.245 17.2226C122.244 16.8015 122.284 16.3814 122.366 15.9681C122.444 15.5873 122.591 15.2239 122.8 14.896C122.994 14.589 123.257 14.331 123.567 14.1421C123.925 13.9325 124.335 13.8279 124.749 13.8406C125.157 13.8294 125.56 13.934 125.91 14.1421C126.226 14.3345 126.493 14.5972 126.69 14.9096C126.898 15.2412 127.045 15.6073 127.124 15.9907C127.213 16.3964 127.257 16.8105 127.255 17.2257C127.253 17.6385 127.21 18.0501 127.127 18.4545H127.115Z" fill="#25D366"/><path d="M30.3139 14.8011C30.1739 10.9697 28.5594 7.34056 25.8073 4.67136C23.0552 2.00216 19.3784 0.499287 15.5446 0.476567H15.4722C12.8904 0.474649 10.3527 1.14494 8.10857 2.42148C5.86449 3.69802 3.99142 5.53682 2.67367 7.75695C1.35592 9.97709 0.6389 12.5021 0.593155 15.0834C0.547411 17.6648 1.17452 20.2135 2.41278 22.479L1.09794 30.3469C1.0958 30.363 1.09712 30.3794 1.10182 30.395C1.10651 30.4106 1.11448 30.425 1.12518 30.4373C1.13588 30.4496 1.14907 30.4594 1.16387 30.4662C1.17867 30.473 1.19475 30.4765 1.21103 30.4766H1.23365L9.01561 28.7456C11.0263 29.7109 13.2282 30.2118 15.4586 30.2112C15.6004 30.2112 15.7421 30.2112 15.8838 30.2112C17.8458 30.1552 19.7773 29.7112 21.5667 28.9048C23.3562 28.0984 24.9682 26.9456 26.3098 25.5129C27.6514 24.0802 28.696 22.396 29.3832 20.5574C30.0704 18.7189 30.3867 16.7625 30.3139 14.8011ZM15.8099 27.6252C15.6923 27.6252 15.5747 27.6252 15.4586 27.6252C13.4874 27.6277 11.5444 27.156 9.79366 26.2501L9.39559 26.042L4.11815 27.289L5.09221 21.9497L4.86604 21.5667C3.78579 19.725 3.20393 17.6336 3.17778 15.4985C3.15163 13.3635 3.68208 11.2584 4.71689 9.39075C5.75171 7.52306 7.25518 5.95715 9.07924 4.84724C10.9033 3.73732 12.985 3.1217 15.1194 3.06101C15.238 3.06101 15.3571 3.06101 15.4767 3.06101C18.6992 3.07056 21.7889 4.34564 24.0802 6.61154C26.3715 8.87743 27.681 11.9528 27.7265 15.1749C27.7719 18.3971 26.5498 21.5081 24.3234 23.8378C22.0969 26.1675 19.0444 27.5293 15.8235 27.6298L15.8099 27.6252Z" fill="#25D366"/><path d="M10.2894 8.16663C10.1057 8.17022 9.92456 8.21063 9.75673 8.28548C9.5889 8.36033 9.43779 8.4681 9.31236 8.6024C8.95801 8.96579 7.96736 9.84034 7.91006 11.6769C7.85277 13.5134 9.13594 15.3304 9.31537 15.5852C9.49481 15.84 11.7686 19.8072 15.5141 21.416C17.7156 22.3645 18.6806 22.5273 19.3063 22.5273C19.5642 22.5273 19.7587 22.5002 19.9622 22.4881C20.6483 22.4459 22.1969 21.6528 22.5346 20.7903C22.8724 19.9278 22.895 19.1739 22.806 19.0231C22.7171 18.8723 22.4728 18.7637 22.1049 18.5707C21.737 18.3777 19.9321 17.4127 19.5928 17.277C19.467 17.2184 19.3316 17.1832 19.1932 17.173C19.1031 17.1777 19.0155 17.2043 18.938 17.2506C18.8605 17.2968 18.7954 17.3613 18.7484 17.4383C18.4469 17.8138 17.7548 18.6295 17.5225 18.8648C17.4718 18.9232 17.4093 18.9703 17.3392 19.0031C17.2691 19.0358 17.1928 19.0534 17.1154 19.0548C16.9728 19.0485 16.8333 19.0109 16.7068 18.9447C15.6135 18.4804 14.6167 17.8155 13.768 16.9845C12.975 16.2029 12.3022 15.3081 11.7716 14.3292C11.5666 13.9492 11.7716 13.7532 11.9586 13.5753C12.1456 13.3973 12.3461 13.1516 12.5391 12.9389C12.6975 12.7573 12.8295 12.5543 12.9312 12.3358C12.9838 12.2344 13.0104 12.1215 13.0085 12.0073C13.0067 11.893 12.9765 11.7811 12.9206 11.6814C12.8317 11.4914 12.1667 9.62321 11.8546 8.87381C11.6013 8.23298 11.2997 8.21187 11.0358 8.19227C10.8187 8.17719 10.5699 8.16965 10.3211 8.16211H10.2894" fill="#25D366"/></svg>
);

/* ── PRD Section component ─────────────────────────────── */
function PRDSection({ num, title, t, children }) {
  return (
    <div style={{ marginBottom: 36, paddingBottom: 36, borderBottom: `1px solid ${t.border}` }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 12 }}>
        <span style={{ fontSize: 22, fontWeight: 400, color: "#25D366", fontVariantNumeric: "tabular-nums" }}>{num}.</span>
        <h3 style={{ fontSize: 22, fontWeight: 400, letterSpacing: "-.02em", margin: 0, color: t.text }}>{title}</h3>
      </div>
      <div style={{ fontSize: 15, lineHeight: 1.7, color: t.text2 }}>{children}</div>
    </div>
  );
}

/* ── MAIN ──────────────────────────────────────────────── */
export default function App() {
  const [mode, setMode] = useState("light");
  const [page, setPage] = useState(() => window.location.hash === "#prd" ? "prd" : "demo");
  const navigate = (p) => { setPage(p); window.history.pushState(null, "", p === "prd" ? "#prd" : window.location.pathname); };
  useEffect(() => { const onPop = () => setPage(window.location.hash === "#prd" ? "prd" : "demo"); window.addEventListener("popstate", onPop); return () => window.removeEventListener("popstate", onPop); }, []);
  const [scnKey, setScnKey] = useState("couple");
  const scn = SCN[scnKey];
  const pKeys = Object.keys(scn.personas);
  const [active, setActive] = useState(pKeys[0]);
  const [fadeKey, setFadeKey] = useState(0);
  const [msgs, setMsgs] = useState(scn.starter.map((m, i) => ({ ...m, time: `9:${String(30 + i).padStart(2, "0")} AM` })));
  const [indCtx, setIndCtx] = useState(() => { const o = {}; for (const [k, v] of Object.entries(scn.personas)) o[k] = [...v.ctx]; return o; });
  const [shared, setShared] = useState([...scn.shared]);
  const [newInd, setNewInd] = useState({});
  const [newSh, setNewSh] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTopic, setActiveTopic] = useState(null);
  const [apiCalls, setApiCalls] = useState(0);
  const callTimesRef = useRef([]);
  const endRef = useRef(null);
  const taRef = useRef(null);
  const phoneAreaRef = useRef(null);
  const [phoneScale, setPhoneScale] = useState(1);
  const PHONE_W = 393, PHONE_H = 780;
  const MIN_SCALE = 0.78;
  const t = THEMES[mode];

  // ── Security constants ──
  const MAX_INPUT_LENGTH = 500;
  const MAX_API_CALLS_SESSION = 50;
  const MAX_API_CALLS_PER_MINUTE = 8;
  const MIN_COOLDOWN_MS = 2000;
  const MAX_HISTORY_MESSAGES = 12;
  const lastCallRef = useRef(0);

  // Derive topics from messages
  const topics = [...new Set(msgs.filter(m => m.topic).map(m => m.topic))];
  const topicColorMap = {};
  topics.forEach((tp, i) => { topicColorMap[tp] = THREAD_COLORS[i % THREAD_COLORS.length]; });
  const filteredMsgs = activeTopic ? msgs.filter(m => m.topic === activeTopic || !m.topic) : msgs;

  const chatRef = useRef(null);
  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [msgs, loading]);
  useEffect(() => { if (!input && taRef.current) taRef.current.style.height = "auto"; }, [input]);

  // Only scale phone down when it doesn't fit — never up, never below MIN_SCALE
  useEffect(() => {
    const calc = () => {
      if (!phoneAreaRef.current) return;
      const availH = phoneAreaRef.current.clientHeight;
      if (availH >= PHONE_H) { setPhoneScale(1); return; }
      setPhoneScale(Math.max(availH / PHONE_H, MIN_SCALE));
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  const switchScn = (key) => { const s = SCN[key]; setScnKey(key); setActive(Object.keys(s.personas)[0]); setMsgs(s.starter.map((m, i) => ({ ...m, time: `9:${String(30 + i).padStart(2, "0")} AM` }))); const o = {}; for (const [k, v] of Object.entries(s.personas)) o[k] = [...v.ctx]; setIndCtx(o); setShared([...s.shared]); setNewInd({}); setNewSh([]); setInput(""); setLoading(false); setActiveTopic(null); setFadeKey(f => f + 1); };
  const resetCtx = () => { const s = SCN[scnKey]; const o = {}; for (const [k, v] of Object.entries(s.personas)) o[k] = [...v.ctx]; setIndCtx(o); setShared([...s.shared]); setNewInd({}); setNewSh([]); setMsgs(s.starter.map((m, i) => ({ ...m, time: `9:${String(30 + i).padStart(2, "0")} AM` }))); setActiveTopic(null); setInput(""); setLoading(false); };

  const applyUpdates = useCallback((updates) => {
    if (!updates) return;
    for (const k of pKeys) {
      const uK = `individual_${k}`;
      if (updates[uK]?.length) {
        setIndCtx(prev => {
          const fresh = updates[uK].filter(item => !prev[k]?.includes(item));
          if (!fresh.length) return prev;
          setNewInd(p => ({ ...p, [k]: fresh }));
          setTimeout(() => setNewInd(p => { const n = { ...p }; delete n[k]; return n; }), 8000);
          return { ...prev, [k]: [...prev[k], ...fresh] };
        });
      }
    }
    if (updates.shared?.length) {
      setShared(prev => {
        const fresh = updates.shared.filter(item => !prev.includes(item));
        if (!fresh.length) return prev;
        setNewSh(fresh);
        setTimeout(() => setNewSh([]), 8000);
        return [...prev, ...fresh];
      });
    }
  }, [pKeys]);

  const send = useCallback(async (text) => {
    if (!text.trim() || loading) return;
    // ── Security: input length cap ──
    const sanitized = text.trim().slice(0, MAX_INPUT_LENGTH);
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const msg = { id: "u" + Date.now(), role: "user", sender: active, content: sanitized, time, topic: activeTopic || undefined };
    setMsgs(prev => [...prev, msg]); setInput("");
    // Smart intent detection
    const hasTag = sanitized.toLowerCase().includes("@metaai");
    const lastMsg = msgs[msgs.length - 1];
    const lastWasAI = lastMsg?.sender === "ai";
    const inThread = !!activeTopic;
    const hasQuestion = sanitized.includes("?");
    const shouldRespond = hasTag || inThread || lastWasAI || hasQuestion;
    if (!shouldRespond) return;
    // ── Security: session limit ──
    if (apiCalls >= MAX_API_CALLS_SESSION) {
      setMsgs(p => [...p, { id: "lim" + Date.now(), role: "assistant", sender: "ai", content: "You've reached the demo limit for this session. Refresh the page to start a new session! This is a prototype — thanks for trying it out 🙏", time }]);
      return;
    }
    // ── Security: rate limit (calls per minute) ──
    const now = Date.now();
    callTimesRef.current = callTimesRef.current.filter(t => now - t < 60000);
    if (callTimesRef.current.length >= MAX_API_CALLS_PER_MINUTE) {
      setMsgs(p => [...p, { id: "rate" + Date.now(), role: "assistant", sender: "ai", content: "Slow down a bit! Too many messages in a short time. Try again in a few seconds 😊", time }]);
      return;
    }
    // ── Security: cooldown ──
    if (now - lastCallRef.current < MIN_COOLDOWN_MS) {
      setMsgs(p => [...p, { id: "cool" + Date.now(), role: "assistant", sender: "ai", content: "Give me a moment to think... try again in a sec!", time }]);
      return;
    }
    lastCallRef.current = now;
    callTimesRef.current.push(now);
    setLoading(true);
    setApiCalls(c => c + 1);
    try {
      const contextHint = activeTopic ? `\n\nCurrent thread topic: "${activeTopic}". Continue this topic unless the user clearly changes subject.` : "";
      // ── Security: truncate message history to last N messages ──
      const allMsgs = msgs.concat([msg]);
      const truncated = allMsgs.length > MAX_HISTORY_MESSAGES ? allMsgs.slice(-MAX_HISTORY_MESSAGES) : allMsgs;
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ system: buildSys(scn, scn.personas[active].name, scn.personas, indCtx, shared) + contextHint, messages: truncated.map(m => ({ role: m.role, content: m.role === "user" ? `[${scn.personas[m.sender]?.name}]: ${m.content}` : m.content })) }) });
      const data = await res.json();
      const raw = data.content?.filter(b => b.type === "text").map(b => b.text).join("\n") || "Try again? 🔄";
      const { clean, topic, interactive, updates } = parseResponse(raw);
      const aiMsg = { id: "a" + Date.now(), role: "assistant", sender: "ai", content: clean, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), interactive, topic: topic || activeTopic || undefined };
      if (topic && !msg.topic) { setMsgs(prev => prev.map(m => m.id === msg.id ? { ...m, topic } : m).concat([aiMsg])); }
      else { setMsgs(p => [...p, aiMsg]); }
      applyUpdates(updates);
    } catch { setMsgs(p => [...p, { id: "e" + Date.now(), role: "assistant", sender: "ai", content: "Connection hiccup — try again! 🔄", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]); }
    finally { setLoading(false); }
  }, [active, msgs, loading, indCtx, shared, scn, pKeys, activeTopic, applyUpdates, apiCalls]);

  const handleInteraction = (value) => { send(`@MetaAI ${value}`); };
  const persona = scn.personas[active];
  const prompts = scn.prompts[active] || [];
  const memberLine = Object.values(scn.personas).map(p => p.name).join(", ") + ", Meta AI";

  return (
    <ThemeCtx.Provider value={t}>
      <div style={{ minHeight: "100vh", background: t.bg, color: t.text, fontFamily: "'Helvetica Neue',Helvetica,-apple-system,sans-serif", display: "flex", flexDirection: "column", transition: "background .3s,color .3s" }}>
        <style>{`
          @keyframes dotB{0%,60%,100%{transform:translateY(0);opacity:.3}30%{transform:translateY(-4px);opacity:.7}}
          @keyframes msgIn{from{opacity:0;transform:translateY(3px)}to{opacity:1;transform:translateY(0)}}
          @keyframes hl{0%{background:rgba(0,168,132,.12)}100%{background:transparent}}
          @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
          @keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-33.33%)}}
          @keyframes fadeIn{from{opacity:0}to{opacity:1}}
          @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
          .facepile > div { transition: margin-left .25s ease; }
          .facepile:hover > div { margin-left: -2px !important; }
          .facepile:hover > div:first-child { margin-left: 0 !important; }
          @media (max-width: 1200px) {
            .side-panel { flex: 0 1 200px !important; }
          }
          @media (max-width: 1050px) {
            .side-panel { display: none !important; }
          }
          @media (max-width: 600px) {
            .scenario-title h2 { font-size: 16px !important; }
          }
          *{box-sizing:border-box}
          ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${t.scroll};border-radius:4px}
          .hide-scroll::-webkit-scrollbar{display:none}
          textarea::placeholder{color:${t.waText2}}
        `}</style>

        <header style={{ padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", background: mode === "light" ? "#FCF5EB" : t.bg, borderBottom: `1px solid ${t.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div onClick={() => navigate("demo")} style={{ cursor: "pointer" }}><WALogo /></div>
            <div style={{ width: 1, height: 20, background: t.border }} />
            <div><h1 style={{ fontSize: 15, fontWeight: 600, margin: 0, letterSpacing: "-.01em", color: t.text }}>Collective Memory Interactive Concept</h1><p style={{ fontSize: 14, margin: "2px 0 0", color: t.text3, fontWeight: 400 }}>Meta AI × WhatsApp</p></div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => navigate(page === "prd" ? "demo" : "prd")} style={{ padding: "8px 20px", borderRadius: 50, border: page === "prd" ? "2px solid #25D366" : `1px solid ${t.text}`, background: page === "prd" ? "#25D366" : "transparent", color: page === "prd" ? "#111B21" : t.text, fontSize: 14, cursor: "pointer", fontFamily: "inherit", fontWeight: page === "prd" ? 500 : 400, letterSpacing: "-.01em", padding: page === "prd" ? "7px 19px" : "8px 20px" }}>PRD</button>
            <button onClick={() => { setMsgs([]); setActiveTopic(null); }} style={{ padding: "8px 20px", borderRadius: 50, border: `1px solid ${t.text}`, background: "transparent", color: t.text, fontSize: 14, cursor: "pointer", fontFamily: "inherit", fontWeight: 400, letterSpacing: "-.01em" }}>Clear</button>
            <button onClick={resetCtx} style={{ padding: "8px 20px", borderRadius: 50, border: `1px solid ${t.text}`, background: "transparent", color: t.text, fontSize: 14, cursor: "pointer", fontFamily: "inherit", fontWeight: 400, letterSpacing: "-.01em" }}>Reset</button>
            <button onClick={() => setMode(m => m === "dark" ? "light" : "dark")} style={{ padding: "8px 20px", borderRadius: 50, border: `1px solid ${t.text}`, background: "transparent", color: t.text, fontSize: 14, cursor: "pointer", fontFamily: "inherit", fontWeight: 400, letterSpacing: "-.01em", display: "flex", alignItems: "center", justifyContent: "center" }}>{mode === "dark" ? "☀️" : "🌙"}</button>
          </div>
        </header>

        {page === "demo" ? <>
        <div style={{ padding: "10px 24px 8px", display: "flex", alignItems: "center", gap: 8, borderBottom: `1px solid ${t.border}`, flexWrap: "wrap", position: "sticky", top: 0, zIndex: 100, background: t.bg }}>
          <div style={{ display: "flex", gap: 6, flex: 1, alignItems: "center" }}>
            <span style={{ fontSize: 14, color: t.text3, paddingRight: 2 }}>Scenarios</span>
            {Object.entries(SCN).map(([k, s]) => <Pill key={k} onClick={() => switchScn(k)} active={scnKey === k}><span style={{ fontSize: 14 }}>{s.emoji}</span>{s.label}</Pill>)}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 14, color: t.text3, paddingRight: 2 }}>Send as</span>
            {pKeys.map(k => { const p = scn.personas[k]; return <Pill key={k} onClick={() => setActive(k)} active={active === k} color={p.color}><PersonaAvatar persona={p} personaKey={k} size={20} borderRadius={10} />{p.name}</Pill>; })}
          </div>
        </div>


        <div ref={phoneAreaRef} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "60px 24px", minHeight: 0, overflow: "auto" }}>
         <div key={fadeKey} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", margin: "auto 0", animation: "fadeIn .4s ease-in-out" }}>
          {/* Scenario title */}
          <div className="scenario-title" style={{ textAlign: "center", paddingBottom: 24 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 22 }}>{scn.emoji}</span>
              <h2 style={{ fontSize: 28, fontWeight: 400, margin: 0, color: t.text, letterSpacing: "-0.03em", lineHeight: 1.2 }}>{scn.desc}</h2>
            </div>
            <p style={{ fontSize: 14, color: t.text3, margin: "4px 0 0", fontWeight: 400, letterSpacing: "-0.01em" }}>{scn.groupName} · {pKeys.length} members + Meta AI</p>
          </div>
          {/* Phone + side panels row */}
          <div style={{ display: "flex", gap: 16, justifyContent: "center", alignItems: "center", width: "100%" }}>
            <div className="side-panel" style={{ flex: "0 1 248px", minWidth: 0, display: "flex", flexDirection: "column", gap: 8, maxHeight: PHONE_H * phoneScale, overflowY: "auto", paddingRight: 4 }}>
              {pKeys.map(k => <CtxCard key={k} title={`${scn.personas[k].name}'s Memory`} items={indCtx[k]} icon={scn.personas[k].avatar} color={scn.personas[k].color} newItems={newInd[k] || []} persona={scn.personas[k]} personaKey={k} />)}
            </div>

            <div style={{ flex: "0 0 auto", width: PHONE_W * phoneScale, height: PHONE_H * phoneScale, position: "relative" }}>
            <div className="phone-frame" style={{ width: PHONE_W, height: PHONE_H, position: "absolute", top: 0, left: "50%", marginLeft: -(PHONE_W / 2), borderRadius: 55, background: "linear-gradient(170deg,#2C2C2E,#1C1C1E 40%,#161618 60%,#1C1C1E)", boxShadow: "0 0 0 .5px rgba(255,255,255,.06),inset 0 1px 0 rgba(255,255,255,.04),0 12px 40px rgba(0,0,0,.18),0 4px 12px rgba(0,0,0,.1)", padding: 9, transformOrigin: "top center", transform: `scale(${phoneScale})` }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: 55, pointerEvents: "none", zIndex: 1, background: "linear-gradient(180deg,rgba(255,255,255,.06) 0%,transparent 8%,transparent 92%,rgba(255,255,255,.02) 100%)" }} />
              {[116, 162, 218].map(top => <div key={top} style={{ position: "absolute", left: -2, top, width: 3, height: top === 116 ? 26 : 48, borderRadius: "3px 0 0 3px", background: "#2C2C2E", boxShadow: "-1px 0 2px rgba(0,0,0,.5)" }} />)}
              <div style={{ position: "absolute", right: -2, top: 176, width: 3, height: 64, borderRadius: "0 3px 3px 0", background: "#2C2C2E", boxShadow: "1px 0 2px rgba(0,0,0,.5)" }} />

              <div style={{ width: "100%", height: "100%", borderRadius: 47, overflow: "hidden", background: t.waChat, display: "flex", flexDirection: "column", position: "relative", zIndex: 2 }}>
                <div style={{ height: 42, background: t.waHdr, position: "relative", display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "0 24px 2px" }}>
                  <div style={{ position: "absolute", top: 7, left: "50%", transform: "translateX(-50%)", width: 118, height: 28, borderRadius: 16, background: "#000", zIndex: 10 }}><div style={{ position: "absolute", right: 24, top: 7, width: 10, height: 10, borderRadius: "50%", background: "radial-gradient(circle at 38% 34%,#1A1A2E,#060610)", border: "1.5px solid #0A0A14" }} /></div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: t.waBar, zIndex: 20 }}>9:41</span>
                  <div style={{ display: "flex", gap: 4, alignItems: "center", zIndex: 20 }}>
                    <svg width="14" height="9" viewBox="0 0 14 10" fill={t.waBar}><rect x="0" y="6" width="3" height="4" rx=".5"/><rect x="4" y="4" width="3" height="6" rx=".5"/><rect x="8" y="1" width="3" height="9" rx=".5"/></svg>
                    <svg width="13" height="10" viewBox="0 0 16 12" fill={t.waBar}><path d="M1 4.2C3 2.1 5.4 1 8 1s5 1.1 7 3.2l-1.4 1.4C11.8 3.8 10 3 8 3S4.2 3.8 2.4 5.6L1 4.2z"/><path d="M4 7.5c1.1-1.1 2.5-1.7 4-1.7s2.9.6 4 1.7l-1.4 1.4c-.7-.7-1.6-1.1-2.6-1.1s-1.9.4-2.6 1.1L4 7.5z"/><circle cx="8" cy="11" r="1.3"/></svg>
                    <div style={{ width: 20, height: 9, borderRadius: 2.5, border: `1px solid ${t.waBar}55`, padding: 1 }}><div style={{ width: "75%", height: "100%", borderRadius: 1, background: "#34C759" }} /></div>
                  </div>
                </div>

                <div style={{ background: t.waHdr, padding: "1px 10px 7px", display: "flex", alignItems: "center", gap: 8 }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill={t.waHdrIcon}><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
                  <div style={{ width: 38, height: 30, position: "relative", flexShrink: 0 }}>
                    {pKeys.slice(0, 3).map((k, i) => (
                      <div key={k} style={{ position: "absolute", left: i * 9, top: i === 1 ? 0 : 4, zIndex: 3 - i, borderRadius: "50%", border: `2px solid ${t.waHdr}`, overflow: "hidden", lineHeight: 0 }}>
                        <PersonaAvatar persona={scn.personas[k]} personaKey={k} size={20} borderRadius={10} />
                      </div>
                    ))}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: t.waBar, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", lineHeight: 1.2 }}>{scn.groupName}</div>
                    <div style={{ fontSize: 10, color: t.waHdrIcon2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", lineHeight: 1.3, opacity: .8 }}>{memberLine}</div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={t.waHdrIcon2}><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                </div>

                {/* Thread navigation bar */}
                {topics.length > 1 && (
                  <div style={{ background: t.waThreadBarBg, borderBottom: `1px solid ${t.waDiv}`, padding: "6px 10px", display: "flex", gap: 4, overflowX: "auto", flexShrink: 0, msOverflowStyle: "none", scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }} className="hide-scroll">
                    <button onClick={() => setActiveTopic(null)} style={{ padding: "4px 10px", borderRadius: 14, border: `1px solid ${!activeTopic ? t.waInterText + "40" : t.waThreadBorder}`, background: !activeTopic ? t.waThreadPillActive : t.waThreadPill, color: !activeTopic ? t.waInterText : t.waText2, fontSize: 10.5, fontWeight: !activeTopic ? 600 : 400, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", transition: "all .15s" }}>All ({msgs.length})</button>
                    {topics.map((tp, i) => {
                      const count = msgs.filter(m => m.topic === tp).length;
                      const isActive = activeTopic === tp;
                      const color = topicColorMap[tp];
                      return <button key={tp} onClick={() => setActiveTopic(isActive ? null : tp)} style={{ padding: "4px 10px", borderRadius: 14, border: `1px solid ${isActive ? color + "40" : t.waThreadBorder}`, background: isActive ? color + "15" : t.waThreadPill, color: isActive ? color : t.waText2, fontSize: 10.5, fontWeight: isActive ? 600 : 400, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 4, transition: "all .15s" }}>
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: color, flexShrink: 0 }} />
                        {tp} ({count})
                      </button>;
                    })}
                  </div>
                )}

                {/* Chat */}
                <div ref={chatRef} style={{ flex: 1, background: t.waChat, backgroundImage: t.waBg, overflowY: "auto", padding: "8px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
                  <div style={{ alignSelf: "center", background: t.waNotice, borderRadius: 8, padding: "5px 14px", fontSize: 10, color: t.waText2, textAlign: "center", marginBottom: 8, boxShadow: t.waBubSh }}>🔒 Tag @MetaAI or reply directly · topics auto-organize</div>
                  {filteredMsgs.length === 0 && <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 10, padding: 40 }}><MetaAIAvatar size={44} /><span style={{ fontSize: 12, color: t.waText2 }}>Tag <span style={{ color: "#0081FB", fontWeight: 600 }}>@MetaAI</span> to start</span></div>}

                  {filteredMsgs.map((m, i) => {
                    const prevTopic = i > 0 ? filteredMsgs[i - 1]?.topic : null;
                    const showDivider = m.topic && m.topic !== prevTopic && !activeTopic;
                    const color = topicColorMap[m.topic] || t.waText2;
                    return (
                      <div key={m.id || i} style={{ display: "flex", flexDirection: "column" }}>
                        {showDivider && (
                          <div onClick={() => setActiveTopic(m.topic)} style={{ alignSelf: "center", display: "flex", alignItems: "center", gap: 6, margin: "8px 0 4px", cursor: "pointer", padding: "3px 12px", borderRadius: 12, background: color + "10", border: `1px solid ${color}25`, transition: "all .15s" }}>
                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />
                            <span style={{ fontSize: 10.5, fontWeight: 600, color }}>{m.topic}</span>
                            <span style={{ fontSize: 9.5, color: t.waText2 }}>· tap to filter</span>
                          </div>
                        )}
                        <Bubble msg={m} personas={scn.personas} onSelect={handleInteraction} activePersona={active} />
                      </div>
                    );
                  })}
                  {loading && <Dots />}
                  <div ref={endRef} />
                </div>

                {/* Input */}
                {activeTopic && (
                  <div onClick={() => setActiveTopic(null)} style={{ background: topicColorMap[activeTopic] + "10", borderTop: `1px solid ${topicColorMap[activeTopic]}20`, padding: "6px 14px", display: "flex", alignItems: "center", gap: 6, cursor: "pointer", flexShrink: 0 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: topicColorMap[activeTopic] }} />
                    <span style={{ fontSize: 10.5, fontWeight: 600, color: topicColorMap[activeTopic] }}>In: {activeTopic}</span>
                    <span style={{ marginLeft: "auto", fontSize: 10, color: t.waText2 }}>✕ back to all</span>
                  </div>
                )}
                <div style={{ background: t.waInput, padding: "4px 6px 20px", display: "flex", alignItems: "flex-end", gap: 6 }}>
                  <div style={{ flex: 1, display: "flex", alignItems: "flex-end", background: t.waField, borderRadius: 22, padding: "0 6px 0 14px", minHeight: 34, border: t.waFieldBd }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={t.waText2} style={{ flexShrink: 0, marginBottom: 8, opacity: .5 }}><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>
                    <textarea ref={taRef} value={input} maxLength={500} onChange={e => { setInput(e.target.value); e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 96) + "px"; }} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }} placeholder={activeTopic ? `Reply in ${activeTopic}...` : `Message as ${persona.name}...`} disabled={loading} rows={1} style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: t.waText, fontSize: 13.5, padding: "6px 6px", fontFamily: "inherit", resize: "none", lineHeight: 1.3, maxHeight: 96 }} />
                  </div>
                  <button onClick={() => send(input)} disabled={!input.trim() || loading} style={{ width: 34, height: 34, borderRadius: "50%", background: input.trim() ? "#00A884" : t.waMicBg, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: input.trim() ? "pointer" : "default", transition: "background .15s", flexShrink: 0 }}>
                    {input.trim() ? <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg> : <svg width="16" height="16" viewBox="0 0 24 24" fill={t.waText2}><path d="M12 15c1.66 0 3-1.34 3-3V6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 15 6.7 12H5c0 3.41 2.72 6.23 6 6.72V22h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/></svg>}
                  </button>
                </div>
                <div style={{ position: "absolute", bottom: 5, left: "50%", transform: "translateX(-50%)", width: 110, height: 4, borderRadius: 2, background: t.waHome }} />
              </div>
            </div>
            </div>

          <div className="side-panel" style={{ flex: "0 1 248px", minWidth: 0, maxHeight: PHONE_H * phoneScale, overflowY: "auto", paddingLeft: 4 }}>
            <div style={{ background: t.surface, borderRadius: 12, border: `1px solid ${t.border}`, overflow: "hidden" }}>
              <div style={{ padding: "10px 14px", borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", gap: 8 }}>
                <div className="facepile" style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                  {pKeys.slice(0, 4).map((k, i) => (
                    <div key={k} style={{ marginLeft: i === 0 ? 0 : -6, zIndex: 4 - i, borderRadius: "50%", border: `1.5px solid ${t.surface}`, overflow: "hidden", lineHeight: 0 }}>
                      <PersonaAvatar persona={scn.personas[k]} personaKey={k} size={20} borderRadius={10} />
                    </div>
                  ))}
                </div>
                <span style={{ fontSize: 12, fontWeight: 500, color: t.text, letterSpacing: "-0.01em" }}>Shared Memory</span>
                <span style={{ marginLeft: "auto", fontSize: 10, color: t.text3 }}>{shared.length}</span>
              </div>
              <div style={{ padding: "6px 14px 10px" }}>
                {shared.map((it, i) => { const isN = newSh?.includes(it); return <div key={`${it}-${i}`} style={{ fontSize: 11.5, lineHeight: 1.5, color: isN ? "#00A884" : t.text2, padding: "2px 0 2px 10px", borderLeft: `2px solid ${isN ? "#00A884" : t.border}`, background: isN ? "#00A884" + "0A" : "transparent", fontWeight: isN ? 550 : 400, transition: "all .4s", borderRadius: isN ? "0 5px 5px 0" : 0 }}>{isN ? <Typewriter text={it} color="#00A884" /> : it}</div>; })}
              </div>
            </div>
          </div>
          {/* end phone+sides row */}
          </div>
         </div>
        {/* end outer column */}
        </div>

        {/* Marquee prompts — full width */}
        <div style={{ padding: "18px 0 16px", borderTop: `1px solid ${t.border}` }}>
          <div style={{ fontSize: 14, color: t.text3, fontWeight: 500, padding: "0 24px 10px", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: "#0081FB", fontWeight: 600 }}>@MetaAI</span> prompt suggestions · click to send
          </div>
          <div style={{ overflow: "hidden", position: "relative" }}>
            <div style={{ display: "flex", gap: 8, animation: "marquee 35s linear infinite", width: "max-content", paddingLeft: 24 }} onMouseEnter={e => e.currentTarget.style.animationPlayState = "paused"} onMouseLeave={e => e.currentTarget.style.animationPlayState = "running"}>
              {[...prompts, ...prompts, ...prompts].map((p, i) => (
                <button key={`${active}-mq-${i}`} onClick={() => { setActiveTopic(null); send(p); }} style={{
                  background: "transparent", border: `1px solid ${t.text}`,
                  borderRadius: 50, padding: "8px 20px", color: t.text,
                  fontSize: 14, fontWeight: 400, letterSpacing: "-.01em",
                  cursor: "pointer", lineHeight: 1.35, fontFamily: "inherit",
                  whiteSpace: "nowrap", flexShrink: 0,
                  transition: "background .25s ease, border-color .25s ease",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = t.accent + "08"; e.currentTarget.style.borderColor = t.accent; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = t.text; }}
                >{renderM(p, scn.personas)}</button>
              ))}
            </div>
          </div>
        </div>
        </> : (
        <div style={{ flex: 1, display: "flex", justifyContent: "center", padding: "60px 24px", overflow: "auto" }}>
          <div style={{ maxWidth: 720, width: "100%", animation: "fadeIn .4s ease-in-out" }}>
            <button onClick={() => navigate("demo")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 20px", borderRadius: 50, border: `1px solid ${t.text}`, background: "transparent", color: t.text, fontSize: 14, cursor: "pointer", fontFamily: "inherit", fontWeight: 400, letterSpacing: "-.01em", marginBottom: 32, transition: "background .25s ease" }} onMouseEnter={e => e.currentTarget.style.background = t.accent + "08"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill={t.text}><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
              Back to prototype
            </button>
            <div style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 32, fontWeight: 400, letterSpacing: "-.03em", lineHeight: 1.2, margin: "0 0 8px", color: t.text }}>Collective Memory PRD</h2>
              <p style={{ fontSize: 16, color: t.text3, margin: 0, fontWeight: 400, lineHeight: 1.5 }}>A native shared-context AI layer for close groups, built into WhatsApp.</p>
            </div>

            <PRDSection num="1" title="Overview" t={t}>
              <p>Every AI assistant built today is designed for one person. One context. One life.</p>
              <p>But most of the decisions we make, the meals we plan, trips we book, shows we watch, money we manage, we make them with someone else. A partner. A friend group. A family. Co-founders building something together.</p>
              <p>This PRD proposes Collective Memory: a native, group-aware AI context layer built into WhatsApp, powered by Meta AI. It is not a group chat bot. It is a shared memory and planning layer that a close group builds together, and that grows smarter the more they use it.</p>
            </PRDSection>

            <PRDSection num="2" title="Problem" t={t}>
              <p>Meta AI on WhatsApp today is a personal assistant living in a group chat. That is the wrong mental model.</p>
              <p>The most important "groups" in most people's lives are not large communities or work Slacks. They are the small, high-trust circles: a partner, a tight friend group, a family, a founding team. These groups have no shared AI layer today.</p>
              <p style={{ fontWeight: 500, marginTop: 16 }}>Specific pain points:</p>
              <ul style={{ paddingLeft: 20, margin: "8px 0", listStyleType: "disc" }}>
                <li style={{ marginBottom: 6 }}>Each person maintains their own context and preferences separately. The AI does not know them as a unit.</li>
                <li style={{ marginBottom: 6 }}>No AI today knows that a couple both hate cilantro, that a friend group is planning a Japan trip, that a family is coordinating a birthday, or that co-founders need to align on a launch timeline.</li>
                <li style={{ marginBottom: 6 }}>Joint planning requires each person to have separate conversations with AI, then compare outputs manually.</li>
                <li style={{ marginBottom: 6 }}>Personal AI assistants create duplication, not collaboration.</li>
              </ul>
            </PRDSection>

            <PRDSection num="3" title="Proposal" t={t}>
              <p>A shared AI context, built natively into WhatsApp, for close groups of any type.</p>
              <p>All members opt in to a shared layer. They teach it things. It remembers for everyone. They query it together or individually. The AI responds with context that reflects the full group.</p>

              <h4 style={{ fontSize: 15, fontWeight: 500, margin: "20px 0 6px", color: t.text }}>3.1 Shared Memory</h4>
              <p>Group members can add facts, preferences, and notes to a shared memory store:</p>
              <ul style={{ paddingLeft: 20, margin: "8px 0", listStyleType: "disc", fontStyle: "italic", color: t.text3 }}>
                <li style={{ marginBottom: 4 }}>"We're trying to eat less meat."</li>
                <li style={{ marginBottom: 4 }}>"Sam has a nut allergy."</li>
                <li style={{ marginBottom: 4 }}>"Mei's birthday is May 14."</li>
                <li style={{ marginBottom: 4 }}>"We're targeting a pre-seed raise by Q2."</li>
              </ul>
              <p>The AI surfaces this context automatically in relevant conversations, without being asked.</p>

              <h4 style={{ fontSize: 15, fontWeight: 500, margin: "20px 0 6px", color: t.text }}>3.2 Joint Planning</h4>
              <p>A single message to the shared thread can trigger full joint planning: dinners for the week, grocery lists, date night ideas, travel itineraries, a shared budget, or a product launch timeline. The AI knows every member's schedule, preferences, and constraints.</p>

              <h4 style={{ fontSize: 15, fontWeight: 500, margin: "20px 0 6px", color: t.text }}>3.3 Shared Decisions</h4>
              <p>Drop a link to an Airbnb, a restaurant, a product, or a flight. The AI synthesizes a recommendation that accounts for what everyone in the group cares about, not just whoever sent the message.</p>

              <h4 style={{ fontSize: 15, fontWeight: 500, margin: "20px 0 6px", color: t.text }}>3.4 Private Context, Shared Surface</h4>
              <p>Each member's individual Meta AI conversations remain fully private. The shared context is an explicit opt-in layer that the group builds together. Trust is designed in from day one.</p>

              <h4 style={{ fontSize: 15, fontWeight: 500, margin: "20px 0 6px", color: t.text }}>3.5 Group Types</h4>
              <p>Collective Memory is designed for small, high-trust groups. Four primary use cases at launch:</p>
              <ul style={{ paddingLeft: 20, margin: "8px 0", listStyleType: "disc" }}>
                <li style={{ marginBottom: 6 }}><span style={{ fontWeight: 500 }}>Couples</span> — Shared meals, finances, travel, date nights, household coordination.</li>
                <li style={{ marginBottom: 6 }}><span style={{ fontWeight: 500 }}>Friends</span> — Trip planning, group activities, shared interests, event coordination.</li>
                <li style={{ marginBottom: 6 }}><span style={{ fontWeight: 500 }}>Family</span> — Birthdays, visits, family trips, schedules across generations.</li>
                <li style={{ marginBottom: 6 }}><span style={{ fontWeight: 500 }}>Co-founders</span> — Product timelines, investor prep, hiring decisions, shared strategy.</li>
              </ul>
            </PRDSection>

            <PRDSection num="4" title="Why WhatsApp" t={t}>
              <ul style={{ paddingLeft: 20, margin: "8px 0", listStyleType: "disc" }}>
                <li style={{ marginBottom: 6 }}>2 billion active users. Already the default communication layer for close groups in most of the world.</li>
                <li style={{ marginBottom: 6 }}>No new app to download. No new behavior to adopt. The group chat is already open.</li>
                <li style={{ marginBottom: 6 }}>Meta AI is already in the product. This is one architectural layer deeper.</li>
                <li style={{ marginBottom: 6 }}>The data moat is relational, not personal. You cannot port a shared memory graph to a competitor.</li>
              </ul>
            </PRDSection>

            <PRDSection num="5" title="Why Now" t={t}>
              <p>Every major AI company is racing to build personal memory. OpenAI, Google, Apple, Anthropic. All focused on the individual.</p>
              <p>Nobody is building shared memory.</p>
              <p>The friend group planning a trip together, the couple that cooks together, the family coordinating across time zones, the co-founders aligning on strategy: these are underserved units of intelligence. First mover here has a real moat. The shared context graph is inherently sticky and group-native in a way individual AI tools are not.</p>
            </PRDSection>

            <PRDSection num="6" title="Success Metrics" t={t}>
              <p style={{ fontWeight: 500 }}>Primary</p>
              <ul style={{ paddingLeft: 20, margin: "8px 0", listStyleType: "disc" }}>
                <li style={{ marginBottom: 6 }}>Shared thread retention: 7-day retention of shared AI threads</li>
                <li style={{ marginBottom: 6 }}>Memory growth: Number of shared memory entries created per group per week</li>
                <li style={{ marginBottom: 6 }}>30-day retention: Percentage of shared threads still active at 30 days</li>
              </ul>
              <p style={{ fontWeight: 500, marginTop: 16 }}>Secondary</p>
              <ul style={{ paddingLeft: 20, margin: "8px 0", listStyleType: "disc" }}>
                <li style={{ marginBottom: 6 }}>NPS on shared AI experience vs. individual AI experience</li>
                <li style={{ marginBottom: 6 }}>Percentage of groups using both individual and shared contexts</li>
                <li style={{ marginBottom: 6 }}>Planning task completion rate across group types (meals, travel, events, work milestones)</li>
                <li style={{ marginBottom: 6 }}>Distribution of active group types (couple, friends, family, co-founders)</li>
              </ul>
            </PRDSection>

            <PRDSection num="7" title="Risks and Mitigations" t={t}>
              <ul style={{ paddingLeft: 20, margin: "8px 0", listStyleType: "disc" }}>
                <li style={{ marginBottom: 12 }}><span style={{ fontWeight: 500 }}>Privacy Risk:</span> Members may feel uncomfortable with a persistent shared memory layer visible to the whole group. Mitigation: Explicit opt-in per member, transparent memory UI, easy deletion, and clear separation from individual AI context.</li>
                <li style={{ marginBottom: 12 }}><span style={{ fontWeight: 500 }}>Group Dynamics Risk:</span> Shared memory could surface tension (e.g., one member's notes about another). Mitigation: Shared memory is collaborative, not surveillance. Entries are visible to all members at all times.</li>
                <li style={{ marginBottom: 12 }}><span style={{ fontWeight: 500 }}>Scope Risk:</span> Different group types have very different needs. Mitigation: Launch with four focused archetypes (couples, friends, family, co-founders) with tailored system prompts and context structures for each.</li>
                <li style={{ marginBottom: 12 }}><span style={{ fontWeight: 500 }}>Adoption Risk:</span> Groups may not discover or activate the feature. Mitigation: Surface entry point organically in existing WhatsApp group threads. No separate app or onboarding flow.</li>
              </ul>
            </PRDSection>

            <div style={{ height: 80 }} />
          </div>
        </div>
        )}
      </div>
    </ThemeCtx.Provider>
  );
}
