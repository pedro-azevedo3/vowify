"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Donut, Avatar } from "@/components/landing/shared";
import { supabase } from "@/lib/supabase";

// ── Dark mode context ──────────────────────────────────────────────────────
const DarkCtx = React.createContext<{ dark: boolean; toggle: () => void }>({ dark: false, toggle: () => {} });
function useDark() { return React.useContext(DarkCtx); }

function MoonIcon() {
  return <svg viewBox="0 0 20 20" width="15" height="15" fill="currentColor"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>;
}
function SunIcon() {
  return <svg viewBox="0 0 20 20" width="15" height="15" fill="currentColor"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"/></svg>;
}

// ── Types ─────────────────────────────────────────────────────────────────
type Status = "confirmed" | "declined";
type View   = "dashboard" | "messages" | "settings";

// ── Types ─────────────────────────────────────────────────────────────────
type Guest = { id?: string; name: string; phone: string; status: Status; plus: number; group: string; at: string; restriction?: string };
type SidebarEvent = { id: string; name: string; when: string };
type InfoSavePayload = {
  name: string; date: string; time: string; location: string; address: string;
  guestLimit: number; trajeOn: boolean; trajeText: string;
  acompOn: boolean; restricaoOn: boolean; msgOn: boolean; msgText: string;
};
type PerEventState = {
  name: string; date: string; time: string; location: string; address: string;
  guestLimit: number; guests: Guest[];
  trajeOn: boolean; trajeText: string;
  acompOn: boolean; restricaoOn: boolean; msgOn: boolean; msgText: string;
  colorId: string; fontId: string;
  organizerName: string;
};

// ── Data ──────────────────────────────────────────────────────────────────
const EVENTS = [
  { id: 1, name: "30 anos da Marina", when: "22 jun · 21h" },
  { id: 2, name: "Casamento J&L",     when: "12 set · 17h" },
  { id: 3, name: "Confra Velkro",     when: "14 dez · 19h" },
];

const ALL_GUESTS: Guest[] = [
  { name: "Marina Castro",        phone: "+55 11 98845-2210", status: "confirmed" as Status, plus: 1, group: "Família",   at: "há 2 min" },
  { name: "Pedro Augusto Lima",   phone: "+55 11 99712-0388", status: "confirmed" as Status, plus: 1, group: "Trabalho",  at: "há 8 min" },
  { name: "Ana Beatriz Souza",    phone: "+55 21 98101-4456", status: "declined"  as Status, plus: 0, group: "Amigos",    at: "há 14 min" },
  { name: "Lucas Tavares",        phone: "+55 11 98845-2210", status: "confirmed" as Status, plus: 0, group: "Faculdade", at: "há 22 min" },
  { name: "Rafaela Pires",        phone: "+55 11 97763-9920", status: "confirmed" as Status, plus: 0, group: "Família",   at: "há 31 min" },
  { name: "Henrique Bittencourt", phone: "+55 11 98200-1144", status: "declined"  as Status, plus: 0, group: "Trabalho",  at: "há 3 h" },
  { name: "Camila Veloso",        phone: "+55 11 98123-7766", status: "confirmed" as Status, plus: 1, group: "Amigos",    at: "há 1 h" },
  { name: "João Pedro Maia",      phone: "+55 11 99001-3344", status: "confirmed" as Status, plus: 0, group: "Faculdade", at: "há 4 h" },
  { name: "Tiago Rezende",        phone: "+55 11 97710-2298", status: "confirmed" as Status, plus: 0, group: "Trabalho",  at: "há 5 h" },
  { name: "Larissa Pacheco",      phone: "+55 11 98845-6633", status: "declined"  as Status, plus: 0, group: "Amigos",    at: "há 6 h" },
];

const INITIAL_EVENTS_DATA: Record<number, PerEventState> = {
  1: {
    name: "30 anos da Marina", date: "22/06/2026", time: "21:00",
    location: "Casa de festas Solar", address: "Rua das Acácias, 220",
    guestLimit: 80, guests: ALL_GUESTS,
    trajeOn: true, trajeText: "Esporte fino",
    acompOn: true, restricaoOn: true, msgOn: false, msgText: "",
    colorId: "violet", fontId: "bricolage", organizerName: "",
  },
  2: {
    name: "Casamento J&L", date: "12/09/2026", time: "17:00",
    location: "Igreja São João", address: "Av. Central, 500",
    guestLimit: 150,
    guests: [
      { name: "Carlos Andrade",   phone: "+55 11 98001-1122", status: "confirmed" as Status, plus: 1, group: "Família", at: "há 1 h" },
      { name: "Fernanda Lima",    phone: "+55 11 97002-3344", status: "confirmed" as Status, plus: 1, group: "Amigos",  at: "há 2 h" },
      { name: "Ricardo Sousa",    phone: "+55 21 99003-5566", status: "declined"  as Status, plus: 0, group: "Trabalho",at: "há 3 h" },
      { name: "Patrícia Mendes",  phone: "+55 11 98004-7788", status: "confirmed" as Status, plus: 0, group: "Família", at: "há 4 h" },
      { name: "Bruno Carvalho",   phone: "+55 11 97005-9900", status: "confirmed" as Status, plus: 1, group: "Amigos",  at: "há 5 h" },
    ],
    trajeOn: true, trajeText: "Social",
    acompOn: true, restricaoOn: true, msgOn: false, msgText: "",
    colorId: "rose", fontId: "playfair", organizerName: "",
  },
  3: {
    name: "Confra Velkro", date: "14/12/2026", time: "19:00",
    location: "Casa do João", address: "Rua das Flores, 42",
    guestLimit: 30,
    guests: [
      { name: "André Peixoto",  phone: "+55 11 98100-2233", status: "confirmed" as Status, plus: 0, group: "Amigos", at: "há 30 min" },
      { name: "Juliana Costa",  phone: "+55 11 97200-4455", status: "confirmed" as Status, plus: 1, group: "Amigos", at: "há 1 h" },
      { name: "Marcos Freitas", phone: "+55 21 99300-6677", status: "declined"  as Status, plus: 0, group: "Amigos", at: "há 2 h" },
    ],
    trajeOn: false, trajeText: "",
    acompOn: false, restricaoOn: false, msgOn: false, msgText: "",
    colorId: "ocean", fontId: "bricolage", organizerName: "",
  },
};


const STATUS_META = {
  confirmed: { label: "Confirmado", bg: "#e6f7ee", color: "#0f6b32", border: "rgba(22,163,74,.18)"   },
  declined:  { label: "Não vai",    bg: "#fde7ee", color: "#9a0a37", border: "rgba(225,17,78,.18)"   },
};

// ── Table column definition (shared between header + rows) ─────────────────
const COL = "2fr 1.4fr 1fr 1fr 0.5fr 32px";

// ── Helpers ───────────────────────────────────────────────────────────────
const toSlug = (name: string, id: string) =>
  name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  + "-" + id.slice(0, 8);

// ── DB helpers ────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapGuestFromDb = (row: any): Guest => ({
  id: row.id,
  name: row.name,
  phone: row.phone,
  status: row.status as Status,
  plus: row.plus ?? 0,
  restriction: row.restriction ?? "",
  group: "",
  at: row.responded_at
    ? new Date(row.responded_at).toLocaleString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    : "—",
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapFromDb = (row: any): PerEventState => ({
  name: row.name, date: row.date, time: row.time,
  location: row.location, address: row.address,
  guestLimit: row.guest_limit, guests: [],
  trajeOn: row.traje_on, trajeText: row.traje_text,
  acompOn: row.acomp_on, restricaoOn: row.restricao_on ?? true, msgOn: row.msg_on, msgText: row.msg_text,
  colorId: row.color_id, fontId: row.font_id,
  organizerName: row.organizer_name ?? "",
});

const DEFAULT_EVENT = {
  name: "Meu primeiro evento", date: "", time: "", location: "", address: "",
  guest_limit: 50, traje_on: false, traje_text: "", acomp_on: true, restricao_on: true,
  msg_on: false, msg_text: "", color_id: "violet", font_id: "bricolage", organizer_name: "",
};

// ── Page ──────────────────────────────────────────────────────────────────
export default function MinhaFestaPage() {
  const [view,          setView]          = useState<View>("dashboard");
  const [activeEventId, setActiveEventId] = useState("");
  const [sidebarEvents, setSidebarEvents] = useState<SidebarEvent[]>([]);
  const [filter,        setFilter]        = useState("all");
  const [query,         setQuery]         = useState("");
  const [sideOpen,      setSideOpen]      = useState(false);
  const [isDesktop,     setIsDesktop]     = useState(false);
  const [eventsData,    setEventsData]    = useState<Record<string, PerEventState>>({});
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [userName,      setUserName]      = useState("");
  const [userEmail,     setUserEmail]     = useState("");
  const [dark, setDark] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("vw-dark") === "1") setDark(true);
  }, []);
  const toggleDark = () => setDark(d => {
    const next = !d;
    localStorage.setItem("vw-dark", next ? "1" : "0");
    return next;
  });

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  const loadGuests = async (eventId: string) => {
    const { data } = await supabase.from("guests").select("*").eq("event_id", eventId).order("responded_at");
    if (data) {
      setEventsData(prev => ({
        ...prev,
        [eventId]: { ...prev[eventId], guests: data.map(mapGuestFromDb) },
      }));
    }
  };

  useEffect(() => {
    const loadEvents = async (userId: string, displayName: string) => {
      const { data } = await supabase.from("events").select("*").eq("user_id", userId).order("created_at");
      let firstId = "";
      if (!data || data.length === 0) {
        const { data: created } = await supabase
          .from("events").insert({ ...DEFAULT_EVENT, user_id: userId, organizer_name: displayName }).select().single();
        if (created) {
          setEventsData({ [created.id]: { ...mapFromDb(created), guests: [] } });
          setSidebarEvents([{ id: created.id, name: created.name, when: `${created.date} · ${created.time}` }]);
          setActiveEventId(created.id);
          firstId = created.id;
        }
      } else {
        const mapped: Record<string, PerEventState> = {};
        const sidebar: SidebarEvent[] = [];
        data.forEach(row => {
          // Se o evento não tem organizer_name, injeta o nome localmente e atualiza no banco
          const orgName = row.organizer_name || displayName;
          mapped[row.id] = { ...mapFromDb(row), organizerName: orgName, guests: [] };
          sidebar.push({ id: row.id, name: row.name, when: `${row.date} · ${row.time}` });
        });
        setEventsData(mapped);
        setSidebarEvents(sidebar);
        const empty = data.filter(r => !r.organizer_name).map(r => r.id);
        if (empty.length > 0) {
          supabase.from("events").update({ organizer_name: displayName }).in("id", empty);
        }
        setActiveEventId(data[0].id);
        firstId = data[0].id;
      }
      setLoadingEvents(false);
      if (firstId) loadGuests(firstId);
    };

    const setFromSession = (session: { user: { id: string; email?: string; user_metadata?: { full_name?: string } } } | null) => {
      if (!session) { window.location.href = "/"; return; }
      const displayName = session.user.user_metadata?.full_name ?? session.user.email ?? "";
      setUserEmail(session.user.email ?? "");
      setUserName(displayName);
      loadEvents(session.user.id, displayName);
    };

    supabase.auth.getSession().then(({ data: { session } }) => setFromSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (session) setFromSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Realtime: escuta novos convidados confirmando pelo link
  useEffect(() => {
    if (!activeEventId) return;
    const channel = supabase
      .channel(`guests-${activeEventId}`)
      .on("postgres_changes", {
        event: "INSERT", schema: "public", table: "guests",
        filter: `event_id=eq.${activeEventId}`,
      }, payload => {
        setEventsData(prev => {
          const ev = prev[activeEventId];
          if (!ev) return prev;
          const already = ev.guests.some(g => g.id === payload.new.id);
          if (already) return prev;
          return { ...prev, [activeEventId]: { ...ev, guests: [...ev.guests, mapGuestFromDb(payload.new)] } };
        });
      })
      .subscribe();

    // Fallback: recarrega convidados a cada 30s caso Realtime não dispare
    const interval = setInterval(() => loadGuests(activeEventId), 30000);

    return () => { supabase.removeChannel(channel); clearInterval(interval); };
  }, [activeEventId]);

  const ev = eventsData[activeEventId];
  const upd = (partial: Partial<PerEventState>) =>
    setEventsData(prev => ({ ...prev, [activeEventId]: { ...prev[activeEventId], ...partial } }));

  const setEventName   = (v: string)  => upd({ name: v });
  const setGuestLimit  = (v: number)  => upd({ guestLimit: v });
  const setGuests      = (fn: (p: Guest[]) => Guest[]) => { if (ev) upd({ guests: fn(ev.guests) }); };
  const setEventInfo   = (v: { date: string; time: string; location: string; address: string }) =>
    upd({ date: v.date, time: v.time, location: v.location, address: v.address });
  const setTrajeOn     = (v: boolean) => upd({ trajeOn: v });
  const setTrajeText   = (v: string)  => upd({ trajeText: v });
  const setAcompOn     = (v: boolean) => upd({ acompOn: v });
  const setRestricaoOn = (v: boolean) => upd({ restricaoOn: v });
  const setMsgOn       = (v: boolean) => upd({ msgOn: v });
  const setMsgText     = (v: string)  => upd({ msgText: v });
  const setColorId     = (v: string)  => upd({ colorId: v });
  const setFontId      = (v: string)  => upd({ fontId: v });
  const deleteGuest = async (guestId: string) => {
    if (!ev) return;
    upd({ guests: ev.guests.filter(g => (g.id ?? g.name) !== guestId) });
    if (guestId.includes("-")) await supabase.from("guests").delete().eq("id", guestId);
  };

  const persistInfo = async (payload: InfoSavePayload) => {
    if (!activeEventId) return;
    await supabase.from("events").update({
      name: payload.name, date: payload.date, time: payload.time,
      location: payload.location, address: payload.address,
      guest_limit: payload.guestLimit,
      traje_on: payload.trajeOn, traje_text: payload.trajeText,
      acomp_on: payload.acompOn, restricao_on: payload.restricaoOn, msg_on: payload.msgOn, msg_text: payload.msgText,
    }).eq("id", activeEventId);
    setSidebarEvents(prev => prev.map(e =>
      e.id === activeEventId ? { ...e, name: payload.name, when: `${payload.date} · ${payload.time}` } : e
    ));
  };

  const persistAppearance = async (colorId: string, fontId: string) => {
    if (!activeEventId) return;
    await supabase.from("events").update({ color_id: colorId, font_id: fontId }).eq("id", activeEventId);
  };

  if (loadingEvents || !ev) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#faf7ff" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 999, border: "3px solid #ece7f5", borderTopColor: "#b14eff", animation: "spin 0.8s linear infinite" }} />
        <span style={{ fontSize: 14, color: "#6e6880" }}>Carregando…</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  const eventName = ev.name;
  const guestLimit = ev.guestLimit;
  const guests = ev.guests;
  const eventInfo = { date: ev.date, time: ev.time, location: ev.location, address: ev.address };
  const event = { id: activeEventId, name: ev.name, when: `${ev.date} · ${ev.time}` };
  const counts = guests.reduce<Record<string, number>>((a, g) => { a[g.status] = (a[g.status] || 0) + 1; return a; }, {});
  const total          = guests.length;
  const confirmedCount = counts.confirmed || 0;
  const companions     = guests.filter(g => g.status === "confirmed").reduce((a, g) => a + g.plus, 0);
  const respondedPct   = total > 0 ? Math.round(((confirmedCount + (counts.declined || 0)) / total) * 100) : 0;

  const filtered = guests.filter(g => {
    if (filter !== "all" && g.status !== filter) return false;
    if (query && !g.name.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const navItems: { key: View; label: string; icon: React.ReactNode; disabled?: boolean }[] = [
    { key: "dashboard", label: "Meu evento",   icon: <CalendarIcon /> },

    { key: "settings",  label: "Configurações",icon: <SettingsIcon /> },
  ];

  return (
    <DarkCtx.Provider value={{ dark, toggle: toggleDark }}>
    <div className={dark ? "crm-dark" : ""} style={{ background: "var(--vw-bg)", fontFamily: "var(--font-bricolage), system-ui, sans-serif", minHeight: "100vh" }}>

      {/* ── Sidebar (fixed, desktop only) ── */}
      <Sidebar
        view={view} setView={v => { setView(v); setSideOpen(false); }}
        activeEventId={activeEventId} setActiveEventId={id => { setActiveEventId(id); setView("dashboard"); setFilter("all"); setQuery(""); setSideOpen(false); loadGuests(id); }}
        navItems={navItems} events={sidebarEvents} open={sideOpen} onClose={() => setSideOpen(false)}
        isDesktop={isDesktop} userName={userName} userEmail={userEmail}
      />

      {/* ── Mobile top bar ── */}
      {!isDesktop && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 40, background: "var(--vw-card)", borderBottom: "1px solid var(--vw-border)", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none" }}>
            <Image src="/logo.png" alt="Vowify" width={24} height={24} style={{ borderRadius: 6 }} priority />
            <span style={{ fontSize: 16, fontWeight: 700, color: "var(--vw-t1)" }}>Vowify</span>
          </Link>
          <button onClick={() => setSideOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6e6880", display: "flex" }}><MenuIcon /></button>
        </div>
      )}

      {/* ── Main ── */}
      <main style={{
        marginLeft: isDesktop ? 240 : 0,
        padding: isDesktop ? "32px 32px 64px" : "80px 20px 64px",
      }}>
        {view === "dashboard" && (
          <DashboardView
            event={event} counts={counts} total={total}
            confirmedCount={confirmedCount} companions={companions}
            respondedPct={respondedPct}
            filter={filter} setFilter={setFilter}
            query={query} setQuery={setQuery}
            filtered={filtered} guests={guests} guestLimit={guestLimit}
            onDelete={deleteGuest} eventName={eventName} eventInfo={eventInfo} organizerName={ev.organizerName}
          />
        )}

        {view === "messages"  && <MessagesView />}
        {view === "settings"  && <SettingsView event={event} guestLimit={guestLimit} setGuestLimit={setGuestLimit} eventName={eventName} setEventName={setEventName} eventInfo={eventInfo} setEventInfo={setEventInfo} colorId={ev.colorId} setColorId={setColorId} fontId={ev.fontId} setFontId={setFontId} trajeOn={ev.trajeOn} setTrajeOn={setTrajeOn} trajeText={ev.trajeText} setTrajeText={setTrajeText} acompOn={ev.acompOn} setAcompOn={setAcompOn} restricaoOn={ev.restricaoOn} setRestricaoOn={setRestricaoOn} msgOn={ev.msgOn} setMsgOn={setMsgOn} msgText={ev.msgText} setMsgText={setMsgText} onPersistInfo={persistInfo} onPersistAppearance={persistAppearance} organizerName={ev.organizerName} userName={userName} sidebarEvents={sidebarEvents} />}
      </main>

      <AppToast />
    </div>
    </DarkCtx.Provider>
  );
}

// ── User menu ──────────────────────────────────────────────────────────────
function UserMenu({ userName, userEmail }: { userName: string; userEmail: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div ref={ref} style={{ marginTop: "auto", position: "relative" }}>
      {open && (
        <div style={{
          position: "absolute", bottom: "calc(100% + 8px)", left: 0, right: 0,
          background: "var(--vw-card)", borderRadius: 12, border: "1px solid var(--vw-border)",
          boxShadow: "0 4px 6px rgba(15,11,30,.04), 0 12px 32px rgba(15,11,30,.10)",
          overflow: "hidden", zIndex: 50,
        }}>
          <button
            onClick={() => { setOpen(false); showToast("Histórico de compras — em breve!"); }}
            style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "11px 14px", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "var(--vw-t2)", fontFamily: "inherit", textAlign: "left" }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--vw-hover)")}
            onMouseLeave={e => (e.currentTarget.style.background = "none")}
          >
            <svg viewBox="0 0 16 16" width="15" height="15" fill="none">
              <path d="M2 3h1.5l2 7h5l1.5-5H5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="6.5" cy="12.5" r="1" fill="currentColor"/>
              <circle cx="11" cy="12.5" r="1" fill="currentColor"/>
            </svg>
            Histórico de compras
          </button>
          <div style={{ height: 1, background: "var(--vw-border)", margin: "0 14px" }} />
          <button
            onClick={handleSignOut}
            style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "11px 14px", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#e1124e", fontFamily: "inherit", textAlign: "left" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#fde7ee")}
            onMouseLeave={e => (e.currentTarget.style.background = "none")}
          >
            <svg viewBox="0 0 16 16" width="15" height="15" fill="none">
              <path d="M6 3H3a1 1 0 00-1 1v8a1 1 0 001 1h3M10 11l3-3-3-3M13 8H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Sair
          </button>
        </div>
      )}

      <button
        onClick={() => setOpen(v => !v)}
        style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: 10, borderRadius: 10, background: open ? "#f1e1ff" : "var(--vw-hover)", border: "1px solid var(--vw-border)", cursor: "pointer", fontFamily: "inherit", transition: "background .12s" }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.background = "var(--vw-hover)"; }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.background = "var(--vw-hover)"; }}
      >
        <Avatar name={userName || userEmail} size={32} />
        <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: "var(--vw-t1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userName || "—"}</div>
          <div style={{ fontSize: 11, color: "var(--vw-t3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userEmail}</div>
        </div>
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" style={{ flexShrink: 0, color: "var(--vw-t4)", transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }}>
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}

// ── Sidebar component ──────────────────────────────────────────────────────
function Sidebar({ view, setView, activeEventId, setActiveEventId, navItems, events, open, onClose, isDesktop, userName, userEmail }: {
  view: View; setView: (v: View) => void;
  activeEventId: string; setActiveEventId: (id: string) => void;
  navItems: { key: View; label: string; icon: React.ReactNode; disabled?: boolean }[];
  events: SidebarEvent[]; open: boolean; onClose: () => void;
  isDesktop: boolean; userName: string; userEmail: string;
}) {
  const { dark, toggle } = useDark();
  const inner = (
    <div style={{ width: 240, height: "100vh", background: "var(--vw-card)", borderRight: "1px solid var(--vw-border)", padding: 24, display: "flex", flexDirection: "column", gap: 24, overflowY: "auto" }}>
      <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
        <Image src="/logo.png" alt="Vowify" width={28} height={28} style={{ borderRadius: 8 }} priority />
        <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--vw-t1)" }}>Vowify</span>
      </Link>

      <button
        onClick={toggle}
        style={{
          height: 34, width: "100%", borderRadius: 8, border: "1px solid var(--vw-border)",
          background: "transparent", color: "var(--vw-t3)", fontSize: 13, fontWeight: 500,
          cursor: "pointer", display: "flex", alignItems: "center", gap: 8, padding: "0 12px",
          fontFamily: "inherit", transition: "background .12s, color .12s",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "var(--vw-hover)"; e.currentTarget.style.color = "var(--vw-t1)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--vw-t3)"; }}
      >
        {dark ? <SunIcon /> : <MoonIcon />}
        {dark ? "Modo claro" : "Modo escuro"}
      </button>

      <button
        onClick={() => showToast("Criar novo evento — em breve!")}
        style={{ height: 36, borderRadius: 10, border: "none", fontSize: 14, fontWeight: 500, color: "#fff", cursor: "pointer", background: "linear-gradient(135deg,#ff4d8d 0%,#b14eff 60%,#7a3aff 100%)", boxShadow: "0 4px 14px rgba(177,78,255,.3)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: "inherit", transition: "opacity .15s" }}
        onMouseEnter={e => (e.currentTarget.style.opacity = ".88")}
        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
      >
        <PlusIcon /> Novo evento
      </button>

      <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {navItems.map(({ key, label, icon, disabled }) => {
          const active = view === key;
          return (
            <button
              key={key}
              onClick={() => !disabled && setView(key)}
              disabled={disabled}
              title={disabled ? "Em breve" : undefined}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 12px", borderRadius: 8, fontSize: 14,
                background: active ? "var(--vw-nav-active)" : "transparent",
                color: disabled ? "#c4bfd4" : active ? "#7a3aff" : "var(--vw-t2)",
                fontWeight: active ? 600 : 500,
                cursor: disabled ? "not-allowed" : "pointer",
                border: "none", fontFamily: "inherit", textAlign: "left",
                transition: "background .12s, color .12s", width: "100%",
                opacity: disabled ? 0.55 : 1,
              }}
              onMouseEnter={e => { if (!active && !disabled) e.currentTarget.style.background = "var(--vw-hover)"; }}
              onMouseLeave={e => { if (!active && !disabled) e.currentTarget.style.background = "transparent"; }}
            >
              {icon}{label}
              {disabled && (
                <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 500, color: "#c4bfd4", background: "#f4f0fa", borderRadius: 4, padding: "2px 6px" }}>
                  Em breve
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--vw-t3)", padding: "0 12px 8px" }}>Meus eventos</div>
        {events.map(e => {
          const active = activeEventId === e.id;
          return (
            <button key={e.id} onClick={() => setActiveEventId(e.id)} style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 12px", borderRadius: 8, background: active ? "var(--vw-hover)" : "transparent", cursor: "pointer", borderWidth: 0, borderLeftWidth: 2, borderStyle: "solid", borderColor: "transparent", borderLeftColor: active ? "#b14eff" : "transparent", fontFamily: "inherit", marginBottom: 2, transition: "background .12s" }}
              onMouseEnter={e2 => { if (!active) (e2.currentTarget as HTMLButtonElement).style.background = "var(--vw-hover)"; }}
              onMouseLeave={e2 => { if (!active) (e2.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
            >
              <div style={{ fontSize: 13, fontWeight: active ? 600 : 500, color: "var(--vw-t2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.name}</div>
              <div style={{ fontSize: 11, color: "var(--vw-t3)", marginTop: 1 }}>{e.when}</div>
            </button>
          );
        })}
      </div>

      <UserMenu userName={userName} userEmail={userEmail} />
    </div>
  );

  return (
    <>
      {/* Desktop sidebar — fixed, shown via JS isDesktop */}
      {isDesktop && (
        <div style={{ position: "fixed", top: 0, left: 0, width: 240, height: "100vh", zIndex: 30 }}>
          {inner}
        </div>
      )}

      {/* Mobile drawer */}
      {!isDesktop && open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }}>
          <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(15,11,30,.4)", backdropFilter: "blur(4px)" }} />
          <div style={{ position: "relative", zIndex: 1 }}>{inner}</div>
        </div>
      )}
    </>
  );
}

// ── Dashboard View ─────────────────────────────────────────────────────────
function DashboardView({ event, counts, total, confirmedCount, companions, respondedPct, filter, setFilter, query, setQuery, filtered, guests, guestLimit, onDelete, eventName, eventInfo, organizerName }: {
  event: { id: string; name: string; when: string }; counts: Record<string,number>; total: number;
  confirmedCount: number; companions: number; respondedPct: number;
  filter: string; setFilter: (f: string) => void;
  query: string; setQuery: (q: string) => void;
  filtered: Guest[]; guests: Guest[]; guestLimit: number; onDelete: (name: string) => void; eventName: string;
  eventInfo: { date: string; time: string; location: string; address: string }; organizerName: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, minWidth: 0, width: "100%" }}>
      {/* Header — always column to avoid width conflicts */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 6 }}>
            <Pill bg="#e6f7ee" color="#0f6b32" border="rgba(22,163,74,.18)">
              <span style={{ width: 6, height: 6, borderRadius: 999, background: "#16a34a", display: "inline-block" }} /> Evento ativo
            </Pill>
            <span style={{ fontSize: 12, color: "var(--vw-t3)" }}>{eventInfo.date} · {eventInfo.time}</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.025em", color: "var(--vw-t1)", margin: 0 }}>{eventName}</h1>
        </div>
      </div>

      {/* Stats — flat 4-col grid: donut (col-span-2→1) + 3 tiles */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Donut — ocupa 2 cols no mobile/md, 1 col no xl */}
        <div className="col-span-2 xl:col-span-1">
          <Card>
            <EyebrowText>Visão geral</EyebrowText>
            <SectionTitle>Confirmações</SectionTitle>
            {(() => {
              const responded = (confirmedCount + companions) + (counts.declined || 0);
              const pending   = Math.max(0, guestLimit - responded);
              return (
                <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap", marginTop: 12 }}>
                  <Donut size={140} stroke={18} animate segments={[
                    { value: confirmedCount + companions, color: "#b14eff" },
                    { value: counts.declined || 0,        color: "#e1124e" },
                    { value: pending,                     color: "#f59e0b" },
                  ]}>
                    <span style={{ fontSize: 24, fontWeight: 700, color: "var(--vw-t1)" }}>{confirmedCount + companions}</span>
                    <span style={{ fontSize: 10, color: "var(--vw-t3)", marginTop: 2 }}>vão chegar</span>
                  </Donut>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, minWidth: 0 }}>
                    <LegendRow color="#b14eff" label="Confirmados" n={confirmedCount + companions} pct={Math.round(((confirmedCount + companions)/(guestLimit||1))*100)} />
                    <LegendRow color="#e1124e" label="Não vão"     n={counts.declined || 0}        pct={Math.round(((counts.declined||0)/(guestLimit||1))*100)} />
                    <LegendRow color="#f59e0b" label="Pendentes"   n={pending}                     pct={Math.round((pending/(guestLimit||1))*100)} />
                  </div>
                </div>
              );
            })()}
          </Card>
        </div>

        {/* 3 stat tiles — 1 col each */}
        <StatTile eyebrow="Respostas" value={total} suffix={`de ${guestLimit} convidados`}
          note={<><GreenText>+4</GreenText> nas últimas 24h</>}
          bars={[3,5,9,7,12,15,9,18,21]} barColor="#b14eff" pct={respondedPct}
        />
        <StatTile eyebrow="Acompanhantes" value={companions} suffix="confirmados"
          note={`${confirmedCount + companions} pessoas no total`}
          bars={[1,1,2,1,3,2,3,4]} barColor="#ff4d8d"
        />
        <StatTile eyebrow="Não vão" value={counts.declined || 0} suffix="convidados"
          note={`${Math.round(((counts.declined||0)/(guestLimit||1))*100)}% do total`}
          bars={[1,0,1,2,1,1,2,1]} barColor="#e1124e"
        />
      </div>

      {/* Table + Timeline */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.7fr_1fr] gap-5">
        <GuestTable filter={filter} setFilter={setFilter} query={query} setQuery={setQuery} filtered={filtered} counts={counts} total={total} guestLimit={guestLimit} onDelete={onDelete} />
        <Timeline guests={guests} />
      </div>
    </div>
  );
}

// ── Guest Table (shared between Dashboard + Guests views) ─────────────────
function GuestTable({ filter, setFilter, query, setQuery, filtered, counts, total, guestLimit, onDelete }: {
  filter: string; setFilter: (f: string) => void;
  query: string; setQuery: (q: string) => void;
  filtered: Guest[]; counts: Record<string,number>; total: number; guestLimit: number; onDelete: (name: string) => void;
}) {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 640);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <Card padding={0}>
      {/* Header */}
      <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--vw-border)", flexWrap: "wrap", gap: 10 }}>
        <SectionTitle>Convidados</SectionTitle>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--vw-t4)", pointerEvents: "none" }}><SearchIcon /></span>
            <input placeholder="Buscar nome…" value={query} onChange={e => setQuery(e.target.value)}
              style={{ height: 34, paddingLeft: 32, paddingRight: 12, borderRadius: 8, border: "1px solid var(--vw-border)", fontSize: 13, fontFamily: "inherit", outline: "none", background: "var(--vw-input)", width: isDesktop ? 200 : 140, color: "var(--vw-t1)", transition: "border .15s" }}
              onFocus={e  => (e.currentTarget.style.border = "1px solid #b14eff")}
              onBlur={e   => (e.currentTarget.style.border = "1px solid var(--vw-border)")}
            />
          </div>
        </div>
      </div>

      {/* Filter chips */}
      <div style={{ padding: "10px 20px", display: "flex", gap: 6, borderBottom: "1px solid var(--vw-border)", flexWrap: "wrap" }}>
        {[
          { k: "all",       l: "Todos",      n: total },
          { k: "confirmed", l: "Confirmados", n: counts.confirmed || 0 },
          { k: "declined",  l: "Não vão",     n: counts.declined  || 0 },
        ].map(({ k, l, n }) => (
          <button key={k} onClick={() => setFilter(k)} style={{ padding: "5px 12px", borderRadius: 999, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", transition: "all .15s", background: filter === k ? "var(--vw-t1)" : "transparent", color: filter === k ? "var(--vw-card)" : "var(--vw-t2)", border: `1px solid ${filter === k ? "var(--vw-t1)" : "var(--vw-border)"}` }}>
            {l} <span style={{ opacity: .55, marginLeft: 3 }}>{n}</span>
          </button>
        ))}
      </div>

      {/* Desktop: grid table */}
      {isDesktop && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: COL, padding: "9px 20px", fontSize: 11, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--vw-t4)", background: "var(--vw-bg)", borderBottom: "1px solid var(--vw-border)" }}>
            <span>Nome</span>
            <span>WhatsApp</span>
            <span>Status</span>
            <span>Restrição</span>
            <span style={{ textAlign: "center" }}>Acomp.</span>
            <span />
          </div>
          <div>
            {filtered.length === 0 && (
              <div style={{ padding: "36px 20px", textAlign: "center", color: "var(--vw-t3)", fontSize: 14 }}>Nenhum convidado encontrado.</div>
            )}
            {filtered.map((g, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: COL, padding: "12px 20px", alignItems: "center", borderBottom: i < filtered.length - 1 ? "1px solid var(--vw-border2)" : "none", transition: "background .1s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--vw-hover)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                  <Avatar name={g.name} size={32} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: 13, color: "var(--vw-t1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{g.name}</div>
                    <div style={{ fontSize: 11, color: "var(--vw-t4)" }}>{g.at}</div>
                  </div>
                </div>
                <span style={{ fontSize: 12, color: "var(--vw-t3)", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{g.phone}</span>
                <span><Pill bg={STATUS_META[g.status].bg} color={STATUS_META[g.status].color} border={STATUS_META[g.status].border}>{STATUS_META[g.status].label}</Pill></span>
                <span style={{ fontSize: 12, color: g.restriction ? "#2a2440" : "#c4bfd4", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {g.restriction || "—"}
                </span>
                <span style={{ display: "flex", justifyContent: "center" }}>
                  {g.plus
                    ? <span style={{ width: 20, height: 20, borderRadius: 999, background: "#e6f7ee", display: "inline-flex", alignItems: "center", justifyContent: "center" }}><svg viewBox="0 0 16 16" width="10" height="10" fill="none"><path d="M3 8.5l3 3 7-7" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                    : <span style={{ fontSize: 13, color: "#c4bfd4" }}>—</span>
                  }
                </span>
                <button onClick={() => onDelete(g.id ?? g.name)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#c4bfd4", padding: 4, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6, transition: "color .15s, background .15s" }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#e1124e"; e.currentTarget.style.background = "#fde7ee"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "#c4bfd4"; e.currentTarget.style.background = "transparent"; }}
                ><TrashIcon /></button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Mobile: card list */}
      {!isDesktop && (
        <div>
          {filtered.length === 0 && (
            <div style={{ padding: "36px 20px", textAlign: "center", color: "var(--vw-t3)", fontSize: 14 }}>Nenhum convidado encontrado.</div>
          )}
          {filtered.map((g, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: i < filtered.length - 1 ? "1px solid var(--vw-border2)" : "none" }}>
              <Avatar name={g.name} size={36} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 500, fontSize: 13, color: "var(--vw-t1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 140 }}>{g.name}</span>
                  <Pill bg={STATUS_META[g.status].bg} color={STATUS_META[g.status].color} border={STATUS_META[g.status].border}>{STATUS_META[g.status].label}</Pill>
                  {g.plus > 0 && <span style={{ fontSize: 11, color: "#16a34a", fontWeight: 500 }}>+1</span>}
                </div>
                <div style={{ fontSize: 11, color: "var(--vw-t4)", marginTop: 2 }}>{g.phone} · {g.at}</div>
                {g.restriction && <div style={{ fontSize: 11, color: "#b14eff", marginTop: 1 }}>⚠ {g.restriction}</div>}
              </div>
              <button onClick={() => onDelete(g.id ?? g.name)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#c4bfd4", padding: 6, display: "flex", alignItems: "center", borderRadius: 6, flexShrink: 0 }}
                onMouseEnter={e => { e.currentTarget.style.color = "#e1124e"; e.currentTarget.style.background = "#fde7ee"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#c4bfd4"; e.currentTarget.style.background = "transparent"; }}
              ><TrashIcon /></button>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{ padding: "10px 20px", borderTop: "1px solid var(--vw-border)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "var(--vw-t3)" }}>
        <span>Mostrando {filtered.length} de {total}</span>
        <div style={{ display: "flex", gap: 4 }}>
          {["‹", "1", "›"].map((l, i) => (
            <button key={i} style={{ width: 28, height: 28, borderRadius: 6, border: l === "1" ? "1px solid #b14eff" : `1px solid var(--vw-border)`, fontSize: 12, background: l === "1" ? "#b14eff" : "transparent", color: l === "1" ? "#fff" : "var(--vw-t3)", cursor: "pointer", fontFamily: "inherit" }}>{l}</button>
          ))}
        </div>
      </div>
    </Card>
  );
}

// ── Timeline ───────────────────────────────────────────────────────────────
function timeAgo(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return "agora mesmo";
  if (diff < 3600) return `há ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `há ${Math.floor(diff / 3600)} h`;
  if (diff < 2 * 86400) return "ontem";
  return `há ${Math.floor(diff / 86400)} dias`;
}

function Timeline({ guests }: { guests: Guest[] }) {
  const items = [...guests].reverse().slice(0, 8);
  return (
    <Card>
      <div style={{ marginBottom: 20 }}>
        <EyebrowText>Atividade</EyebrowText>
        <SectionTitle>Linha do tempo</SectionTitle>
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "24px 0", color: "var(--vw-t4)", fontSize: 13 }}>
          Nenhuma atividade ainda.<br />As confirmações aparecerão aqui em tempo real.
        </div>
      ) : (
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 15, top: 16, bottom: 16, width: 2, background: "var(--vw-border)" }} />
          {items.map((g, i) => {
            const confirmed = g.status === "confirmed";
            const dotColor  = confirmed ? "#b14eff" : "#e1124e";
            const action    = confirmed ? "confirmou presença" : "não vai ao evento";
            const when      = g.id ? timeAgo(g.at.includes("há") || g.at === "—" ? new Date().toISOString() : g.at) : g.at;
            return (
              <div key={g.id ?? i} style={{ display: "flex", gap: 12, marginBottom: i < items.length - 1 ? 18 : 0, position: "relative" }}>
                <div style={{ width: 32, height: 32, borderRadius: 999, flexShrink: 0, background: "var(--vw-card)", display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${dotColor}`, zIndex: 1 }}>
                  <Avatar name={g.name} size={28} />
                </div>
                <div style={{ flex: 1, paddingTop: 4 }}>
                  <div style={{ fontSize: 13, color: "var(--vw-t1)", lineHeight: 1.4 }}>
                    <strong style={{ fontWeight: 600 }}>{g.name}</strong>
                    {" "}<span style={{ color: "var(--vw-t3)" }}>{action}</span>
                  </div>
                  {g.plus > 0 && <div style={{ fontSize: 11, color: "var(--vw-t3)", marginTop: 2 }}>+1 acompanhante</div>}
                  {g.restriction && <div style={{ fontSize: 11, color: "var(--vw-t4)", marginTop: 2 }}>Restrição: {g.restriction}</div>}
                  <div style={{ fontSize: 11, color: "var(--vw-t4)", marginTop: 2 }}>{when}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}


// ── Messages View ──────────────────────────────────────────────────────────
function MessagesView() {
  const [sent, setSent] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 640 }}>
      <div>
        <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.025em", color: "var(--vw-t1)", margin: 0 }}>Mensagens</h1>
        <p style={{ fontSize: 14, color: "var(--vw-t3)", margin: "4px 0 0" }}>Envie lembretes e comunicados para os convidados.</p>
      </div>

      {/* Lembrete automático */}
      <Card>
        <EyebrowText>Lembrete automático</EyebrowText>
        <SectionTitle>48h antes do evento</SectionTitle>
        <p style={{ fontSize: 14, color: "var(--vw-t3)", margin: "8px 0 16px", lineHeight: 1.6 }}>
          A Vowify dispara automaticamente uma mensagem para os convidados que ainda não responderam 48 horas antes do evento.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, background: "var(--vw-bg)", borderRadius: 10, border: "1px solid var(--vw-border)", marginBottom: 16 }}>
          <div style={{ width: 8, height: 8, borderRadius: 999, background: "#16a34a", flexShrink: 0 }} />
          <span style={{ fontSize: 13, color: "var(--vw-t1)" }}>Ativo — será enviado em <strong>3 dias</strong></span>
        </div>
      </Card>

      {/* Lembrete manual */}
      <Card>
        <EyebrowText>Mensagem manual</EyebrowText>
        <SectionTitle>Enviar agora para pendentes</SectionTitle>
        <p style={{ fontSize: 14, color: "var(--vw-t3)", margin: "8px 0 16px", lineHeight: 1.6 }}>
          Escreva uma mensagem personalizada para os <strong style={{ color: "var(--vw-t1)" }}>3 convidados</strong> que ainda não responderam.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <textarea
            defaultValue={"Oi! 👋 Só passando para lembrar que o evento está chegando. Você vai poder vir? Confirme sua presença pelo link: vowify.app/i/..."}
            style={{ padding: 14, borderRadius: 10, border: "1px solid var(--vw-border)", fontSize: 14, fontFamily: "inherit", outline: "none", resize: "vertical", minHeight: 100, color: "var(--vw-t1)", lineHeight: 1.6, transition: "border .15s", background: "var(--vw-input)" }}
            onFocus={e  => (e.currentTarget.style.border = "1px solid #b14eff")}
            onBlur={e   => (e.currentTarget.style.border = "1px solid var(--vw-border)")}
          />
          {sent
            ? <div style={{ padding: "10px 16px", borderRadius: 10, background: "#e6f7ee", color: "#0f6b32", fontSize: 14, fontWeight: 500, border: "1px solid rgba(22,163,74,.18)" }}>✓ Mensagem enviada para 3 convidados!</div>
            : <PrimaryBtn icon={<SendIcon />} onClick={() => setSent(true)}>Enviar para pendentes</PrimaryBtn>
          }
        </div>
      </Card>

      {/* Histórico */}
      <Card>
        <EyebrowText>Histórico</EyebrowText>
        <SectionTitle>Mensagens enviadas</SectionTitle>
        {[
          { text: "Lembrete automático enviado", to: "4 pendentes", time: "há 1 hora", type: "auto" },
          { text: "Evento publicado e convites enviados", to: "10 convidados", time: "3 dias atrás", type: "event" },
        ].map((m, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderTop: i > 0 ? "1px solid var(--vw-border2)" : "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#ffe5ee 0%,#f1e1ff 60%,#e8dcff 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Image src="/logo.png" alt="" width={18} height={18} style={{ borderRadius: 4 }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--vw-t1)" }}>{m.text}</div>
              <div style={{ fontSize: 12, color: "var(--vw-t3)" }}>Para {m.to} · {m.time}</div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ── Invite customisation data ──────────────────────────────────────────────
const COLOR_THEMES = [
  { id: "violet",  label: "Padrão",    gradient: "linear-gradient(135deg,#ff4d8d 0%,#b14eff 60%,#7a3aff 100%)" },
  { id: "ocean",   label: "Oceano",    gradient: "linear-gradient(135deg,#0ea5e9 0%,#6366f1 60%,#8b5cf6 100%)" },
  { id: "sunset",  label: "Pôr do sol",gradient: "linear-gradient(135deg,#f97316 0%,#ec4899 60%,#a855f7 100%)" },
  { id: "forest",  label: "Floresta",  gradient: "linear-gradient(135deg,#10b981 0%,#0891b2 60%,#6366f1 100%)" },
  { id: "midnight",label: "Midnight",  gradient: "linear-gradient(135deg,#1e1b4b 0%,#4c1d95 60%,#6d28d9 100%)" },
  { id: "rose",    label: "Rosa",      gradient: "linear-gradient(135deg,#f43f5e 0%,#ec4899 60%,#a855f7 100%)" },
  { id: "gold",    label: "Dourado",   gradient: "linear-gradient(135deg,#f59e0b 0%,#ef4444 60%,#ec4899 100%)" },
  { id: "mint",    label: "Menta",     gradient: "linear-gradient(135deg,#34d399 0%,#06b6d4 60%,#3b82f6 100%)" },
  { id: "blue",    label: "Azul",      gradient: "linear-gradient(135deg,#60a5fa 0%,#2563eb 60%,#1e40af 100%)" },
  { id: "black",   label: "Preto",     gradient: "linear-gradient(135deg,#374151 0%,#1f2937 60%,#030712 100%)" },
  { id: "green",   label: "Verde",     gradient: "linear-gradient(135deg,#4ade80 0%,#16a34a 60%,#14532d 100%)" },
  { id: "white",   label: "Branco",    gradient: "linear-gradient(135deg,#e2e8f0 0%,#94a3b8 60%,#475569 100%)" },
];

const FONT_OPTIONS = [
  { id: "bricolage",      label: "Bricolage Grotesque", family: "var(--font-bricolage), system-ui, sans-serif", sample: "Festa dos 30 anos" },
  { id: "inter",          label: "Inter",               family: "'Inter', system-ui, sans-serif",               sample: "Festa dos 30 anos" },
  { id: "poppins",        label: "Poppins",             family: "'Poppins', system-ui, sans-serif",             sample: "Festa dos 30 anos" },
  { id: "league-spartan", label: "League Spartan",      family: "'League Spartan', system-ui, sans-serif",      sample: "Festa dos 30 anos" },
  { id: "playfair",       label: "Playfair Display",    family: "'Playfair Display', Georgia, serif",           sample: "Festa dos 30 anos" },
  { id: "cormorant",      label: "Cormorant Garamond",  family: "'Cormorant Garamond', Georgia, serif",         sample: "Festa dos 30 anos" },
  { id: "montserrat",     label: "Montserrat",          family: "'Montserrat', system-ui, sans-serif",          sample: "Festa dos 30 anos" },
  { id: "dancing",        label: "Dancing Script",      family: "'Dancing Script', Georgia, cursive",           sample: "Festa dos 30 anos" },
];

// ── Settings View ──────────────────────────────────────────────────────────
function SettingsView({ event, guestLimit, setGuestLimit, eventName, setEventName, eventInfo, setEventInfo, colorId, setColorId, fontId, setFontId, trajeOn, setTrajeOn, trajeText, setTrajeText, acompOn, setAcompOn, restricaoOn, setRestricaoOn, msgOn, setMsgOn, msgText, setMsgText, onPersistInfo, onPersistAppearance, organizerName, userName, sidebarEvents }: {
  event: { id: string; name: string; when: string }; guestLimit: number; setGuestLimit: (n: number) => void;
  eventName: string; setEventName: (n: string) => void; organizerName: string; userName: string;
  sidebarEvents: SidebarEvent[];
  eventInfo: { date: string; time: string; location: string; address: string };
  setEventInfo: (v: { date: string; time: string; location: string; address: string }) => void;
  colorId: string; setColorId: (v: string) => void;
  fontId: string; setFontId: (v: string) => void;
  trajeOn: boolean; setTrajeOn: (v: boolean) => void;
  trajeText: string; setTrajeText: (v: string) => void;
  acompOn: boolean; setAcompOn: (v: boolean) => void;
  restricaoOn: boolean; setRestricaoOn: (v: boolean) => void;
  msgOn: boolean; setMsgOn: (v: boolean) => void;
  msgText: string; setMsgText: (v: string) => void;
  onPersistInfo: (payload: InfoSavePayload) => Promise<void>;
  onPersistAppearance: (colorId: string, fontId: string) => Promise<void>;
}) {
  const [saved,         setSaved]         = useState(false);
  const [showDelete,    setShowDelete]    = useState(false);
  const [showAllThemes, setShowAllThemes] = useState(false);
  const [showAllFonts,  setShowAllFonts]  = useState(false);
  const [draftName,     setDraftName]     = useState(eventName);
  const [draftDate,     setDraftDate]     = useState(eventInfo.date);
  const [draftTime,     setDraftTime]     = useState(eventInfo.time);
  const [draftLocation, setDraftLocation] = useState(eventInfo.location);
  const [draftAddress,  setDraftAddress]  = useState(eventInfo.address);
  const [draftLimit,    setDraftLimit]    = useState(String(guestLimit));
  const [limitError,    setLimitError]    = useState("");

  const saveAll = () => {
    const n = parseInt(draftLimit, 10);
    if (!n || n < 1) { setLimitError("O mínimo de convidados é 1."); return; }
    setLimitError("");
    setGuestLimit(n);
    setEventName(draftName);
    setEventInfo({ date: draftDate, time: draftTime, location: draftLocation, address: draftAddress });
    onPersistInfo({ name: draftName, date: draftDate, time: draftTime, location: draftLocation, address: draftAddress, guestLimit: n, trajeOn, trajeText, acompOn, restricaoOn, msgOn, msgText });
    onPersistAppearance(colorId, fontId);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const theme = COLOR_THEMES.find(t => t.id === colorId)!;
  const font  = FONT_OPTIONS.find(f => f.id === fontId)!;

  return (
    <>
      {/* Load Google Fonts for preview */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Cormorant+Garamond:wght@600;700&family=Montserrat:wght@500;600;700&family=Dancing+Script:wght@600;700&family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=League+Spartan:wght@400;500;600;700&display=swap');`}</style>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.025em", color: "var(--vw-t1)", margin: 0 }}>Configurações</h1>
          <p style={{ fontSize: 14, color: "var(--vw-t3)", margin: "4px 0 0" }}>Gerencie os detalhes do seu evento.</p>
        </div>

        {/* ── Aparência do convite ── */}
        <Card>
          <EyebrowText>Convite</EyebrowText>
          <SectionTitle>Aparência</SectionTitle>
          <p style={{ fontSize: 14, color: "var(--vw-t3)", margin: "6px 0 20px", lineHeight: 1.5 }}>
            Escolha a paleta de cores e a tipografia do seu convite. O preview atualiza em tempo real.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-start">
            {/* Controls */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Color palette */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--vw-t3)", textTransform: "uppercase", letterSpacing: ".04em", display: "block", marginBottom: 10 }}>
                  Paleta de cores
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                  {(showAllThemes ? COLOR_THEMES : COLOR_THEMES.slice(0, 4)).map(t => (
                    <button
                      key={t.id}
                      onClick={() => setColorId(t.id)}
                      title={t.label}
                      style={{
                        height: 44, borderRadius: 10,
                        background: t.gradient,
                        border: colorId === t.id ? "3px solid #0f0b1e" : "2px solid transparent",
                        boxShadow: colorId === t.id ? "0 0 0 2px #fff inset" : "none",
                        cursor: "pointer",
                        position: "relative",
                        transition: "transform .15s, box-shadow .15s",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                      onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                    >
                      {colorId === t.id && (
                        <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg viewBox="0 0 16 16" width="16" height="16" fill="none">
                            <path d="M3 8.5l3 3 7-7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
                  <button onClick={() => setShowAllThemes(v => !v)} style={{ fontSize: 12, color: "#b14eff", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0, fontWeight: 500 }}>
                    {showAllThemes ? "Ver menos" : "Ver todos os temas"}
                  </button>
                  <p style={{ fontSize: 12, color: "var(--vw-t4)", margin: 0 }}>Selecionado: <strong style={{ color: "var(--vw-t2)" }}>{theme.label}</strong></p>
                </div>
              </div>

              {/* Font selector */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--vw-t3)", textTransform: "uppercase", letterSpacing: ".04em", display: "block", marginBottom: 10 }}>
                  Tipografia
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {(showAllFonts ? FONT_OPTIONS : FONT_OPTIONS.slice(0, 3)).map(f => (
                    <button
                      key={f.id}
                      onClick={() => setFontId(f.id)}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "10px 14px", borderRadius: 10, cursor: "pointer",
                        border: fontId === f.id ? "2px solid #b14eff" : "1px solid var(--vw-border)",
                        background: fontId === f.id ? "var(--vw-hover)" : "var(--vw-card)",
                        fontFamily: "inherit", textAlign: "left", width: "100%",
                        transition: "border .15s, background .15s",
                      }}
                    >
                      <div>
                        <span style={{ fontSize: 13, fontWeight: 500, color: "var(--vw-t1)", display: "block" }}>{f.label}</span>
                        <span style={{ fontSize: 16, fontFamily: f.family, color: "var(--vw-t2)", display: "block", lineHeight: 1.3 }}>{f.sample}</span>
                      </div>
                      {fontId === f.id && (
                        <span style={{ width: 18, height: 18, borderRadius: 999, background: "#b14eff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <svg viewBox="0 0 16 16" width="10" height="10" fill="none">
                            <path d="M3 8.5l3 3 7-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={() => setShowAllFonts(v => !v)} style={{ fontSize: 12, color: "#b14eff", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0, fontWeight: 500, textAlign: "left" }}>
                {showAllFonts ? "Ver menos" : "Ver todas as opções de fontes"}
              </button>
            </div>

            {/* Live preview */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, position: "sticky", top: 20 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "var(--vw-t4)", textTransform: "uppercase", letterSpacing: ".06em" }}>Preview</span>
              <InvitePreview gradient={theme.gradient} fontFamily={font.family} eventName={eventName} eventWhen={`${eventInfo.date} · ${eventInfo.time}`} eventLocation={eventInfo.location} />
            </div>
          </div>
          <div style={{ height: 1, background: "var(--vw-border)", margin: "24px 0" }} />

          <SectionTitle>Informações do evento</SectionTitle>
          <EventInfoCard event={event} guestLimit={guestLimit} trajeOn={trajeOn} setTrajeOn={setTrajeOn} acompOn={acompOn} setAcompOn={setAcompOn} restricaoOn={restricaoOn} setRestricaoOn={setRestricaoOn} trajeText={trajeText} setTrajeText={setTrajeText} msgOn={msgOn} setMsgOn={setMsgOn} msgText={msgText} setMsgText={setMsgText} draftName={draftName} setDraftName={setDraftName} draftDate={draftDate} setDraftDate={setDraftDate} draftTime={draftTime} setDraftTime={setDraftTime} draftLocation={draftLocation} setDraftLocation={setDraftLocation} draftAddress={draftAddress} setDraftAddress={setDraftAddress} draftLimit={draftLimit} setDraftLimit={setDraftLimit} limitError={limitError} setLimitError={setLimitError} />
        </Card>

        {/* ── Botão único de salvar ── */}
        <div>
          <PrimaryBtn onClick={saveAll} disabled={saved}>Salvar configurações</PrimaryBtn>
          <SavedToast visible={saved} message="Configurações salvas!" />
        </div>

        {/* ── Link & QR Code ── */}
        {(() => {
          const origin = process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.NEXT_PUBLIC_SITE_URL ?? (typeof window !== "undefined" ? window.location.origin : ""));
          const inviteUrl = `${origin}/convite/${event.id}`;
          const shortDisplay = inviteUrl;
          const [copied, setCopied] = React.useState(false);
          const handleCopy = () => {
            navigator.clipboard.writeText(inviteUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          };

          return (
            <Card>
              <SectionTitle>Link e QR Code</SectionTitle>
              <p style={{ fontSize: 14, color: "var(--vw-t3)", margin: "8px 0 16px" }}>Compartilhe o link do convite com os convidados.</p>
              <div style={{ display: "flex", gap: 8, alignItems: "center", padding: 12, background: "var(--vw-bg)", borderRadius: 10, border: "1px solid var(--vw-border)", marginBottom: 12, maxWidth: 500 }}>
                <span style={{ fontSize: 13, color: "var(--vw-t2)", flex: 1, fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{shortDisplay}</span>
                <button onClick={handleCopy} style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${copied ? "rgba(22,163,74,.3)" : "var(--vw-border)"}`, fontSize: 12, fontWeight: 500, background: copied ? "#e6f7ee" : "var(--vw-card)", cursor: "pointer", fontFamily: "inherit", color: copied ? "#0f6b32" : "var(--vw-t2)", flexShrink: 0, transition: "all .2s" }}>
                  {copied ? "✓ Copiado!" : "Copiar"}
                </button>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                <a
                  href={`/convite/${event.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 36, padding: "0 14px", borderRadius: 9, border: "none", fontSize: 13, fontWeight: 500, color: "#fff", cursor: "pointer", background: "linear-gradient(135deg,#ff4d8d 0%,#b14eff 60%,#7a3aff 100%)", textDecoration: "none", fontFamily: "inherit" }}
                >
                  <EyeIcon /> Visualizar seu convite
                </a>
                <GhostBtn icon={<DownloadIcon />} onClick={() => showToast("Baixar QR Code — em breve!")}>Baixar QR Code</GhostBtn>
              </div>

              {/* Mensagem para WhatsApp */}
              <div style={{ borderTop: "1px solid var(--vw-border)", paddingTop: 16 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: "var(--vw-t3)", textTransform: "uppercase", letterSpacing: ".04em", display: "block", marginBottom: 8 }}>
                  Mensagem para WhatsApp
                </label>
                {(() => {
                  const whatsappMsg = `${organizerName ? `${organizerName} está te convidando para ${eventName}` : `Você foi convidado para ${eventName}`}! 🎉\n\nConfirme sua presença em menos de 10 segundos:\n${inviteUrl}`;
                  const waLink = `https://wa.me/?text=${encodeURIComponent(whatsappMsg)}`;
                  const [copiedMsg,  setCopiedMsg]  = React.useState(false);
                  const [copiedLink, setCopiedLink] = React.useState(false);
                  return (
                    <>
                      <div style={{ background: "var(--vw-bg)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "var(--vw-t2)", lineHeight: 1.6, whiteSpace: "pre-wrap", border: "1px solid var(--vw-border)", marginBottom: 8 }}>
                        {whatsappMsg}
                      </div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <button
                          onClick={() => { navigator.clipboard.writeText(whatsappMsg); setCopiedMsg(true); setTimeout(() => setCopiedMsg(false), 2000); }}
                          style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${copiedMsg ? "rgba(22,163,74,.3)" : "var(--vw-border)"}`, fontSize: 12, fontWeight: 500, background: copiedMsg ? "#e6f7ee" : "var(--vw-card)", cursor: "pointer", fontFamily: "inherit", color: copiedMsg ? "#0f6b32" : "var(--vw-t2)", transition: "all .2s" }}
                        >
                          {copiedMsg ? "✓ Mensagem copiada!" : "Copiar mensagem"}
                        </button>
                        <button
                          onClick={() => { navigator.clipboard.writeText(whatsappMsg); setCopiedLink(true); setTimeout(() => setCopiedLink(false), 2000); }}
                          style={{ padding: "7px 14px", borderRadius: 8, border: "none", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", transition: "all .2s", background: copiedLink ? "#1da851" : "#25D366", color: "#fff", display: "flex", alignItems: "center", gap: 6 }}
                        >
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.99 0C5.375 0 0 5.373 0 11.987c0 2.11.554 4.093 1.523 5.815L0 24l6.335-1.489A11.953 11.953 0 0011.99 24C18.605 24 24 18.627 24 12.013 24 5.373 18.605 0 11.99 0zm.01 21.785a9.783 9.783 0 01-4.999-1.37l-.358-.213-3.759.884.899-3.653-.234-.376a9.77 9.77 0 01-1.499-5.247c0-5.404 4.397-9.8 9.8-9.8 2.618 0 5.078 1.021 6.927 2.873a9.745 9.745 0 012.872 6.924c.001 5.405-4.396 9.978-9.649 9.978z"/></svg>
                          {copiedLink ? "✓ Link copiado!" : "Copiar link de WhatsApp"}
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>
            </Card>
          );
        })()}

        {/* ── Zona de perigo ── */}
        <Card>
          <SectionTitle style={{ color: "#e1124e" }}>Zona de perigo</SectionTitle>
          <p style={{ fontSize: 14, color: "var(--vw-t3)", margin: "8px 0 16px" }}>Ações irreversíveis para este evento.</p>
          <button
            onClick={() => setShowDelete(true)}
            style={{ padding: "8px 16px", borderRadius: 10, border: "1px solid rgba(225,17,78,.25)", fontSize: 14, fontWeight: 500, color: "#e1124e", background: "#fde7ee", cursor: "pointer", fontFamily: "inherit" }}
          >
            Encerrar evento
          </button>
        </Card>
      </div>

      {/* ── Modal de confirmação de exclusão ── */}
      {showDelete && (
        <DeleteEventModal
          eventName={eventName}
          eventId={event.id}
          organizerName={organizerName}
          userName={userName}
          sidebarEvents={sidebarEvents}
          onClose={() => setShowDelete(false)}
        />
      )}
    </>
  );
}

// ── Invite preview ─────────────────────────────────────────────────────────
function InvitePreview({ gradient, fontFamily, eventName, eventWhen, eventLocation = "" }: {
  gradient: string; fontFamily: string; eventName: string; eventWhen: string; eventLocation?: string;
}) {
  return (
    <div className="vw-preview-reset" style={{ width: 220, borderRadius: 32, background: "#0f0b1e", padding: 5, boxShadow: "0 24px 48px rgba(15,11,30,.25)", flexShrink: 0 }}>
      <div style={{ borderRadius: 27, overflow: "hidden", background: "#fff" }}>
        {/* Dynamic island */}
        <div style={{ position: "relative", height: 0 }}>
          <div style={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", width: 80, height: 24, background: "#000", borderRadius: 12, zIndex: 10 }} />
        </div>

        {/* Invite header */}
        <div style={{
          height: 220, background: gradient,
          padding: "36px 18px 18px",
          display: "flex", flexDirection: "column", justifyContent: "flex-end",
          position: "relative", transition: "background .3s",
        }}>
          {/* Decorative orbs */}
          <div style={{ position: "absolute", width: 120, height: 120, borderRadius: 999, background: "rgba(255,255,255,.1)", top: -30, right: -30, filter: "blur(20px)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", width: 100, height: 100, borderRadius: 999, background: "rgba(255,255,255,.08)", bottom: 0, left: -20, filter: "blur(20px)", pointerEvents: "none" }} />
          <span style={{ fontSize: 9, fontWeight: 500, letterSpacing: ".15em", textTransform: "uppercase", opacity: .8, color: "#fff", fontFamily, display: "block" }}>
            Você foi convidado
          </span>
          <span style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.1, color: "#fff", fontFamily, display: "block", marginTop: 4, transition: "font-family .2s" }}>
            {eventName}
          </span>
          <span style={{ fontSize: 11, opacity: .85, color: "#fff", fontFamily, display: "block", marginTop: 8 }}>
            {eventWhen}{eventLocation ? ` · ${eventLocation}` : ""}
          </span>
        </div>

        {/* RSVP form — fonte padrão, não muda com a seleção */}
        <div style={{ padding: "14px 14px 18px" }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: "#6e6880", marginBottom: 10 }}>Confirme sua presença</div>
          <div style={{ height: 32, borderRadius: 8, border: "1px solid #ece7f5", display: "flex", alignItems: "center", padding: "0 10px", fontSize: 11, color: "#9994ac", marginBottom: 8 }}>Seu nome</div>
          <div style={{ height: 32, borderRadius: 8, border: "1px solid #ece7f5", display: "flex", alignItems: "center", padding: "0 10px", fontSize: 11, color: "#9994ac", marginBottom: 10 }}>WhatsApp</div>
          <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
            <div style={{ flex: 1, height: 30, borderRadius: 8, border: "1.5px solid #b14eff", color: "#b14eff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600 }}>Vou! 🎉</div>
            <div style={{ flex: 1, height: 30, borderRadius: 8, border: "1px solid #ece7f5", color: "#6e6880", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>Não vou</div>
          </div>
          <div style={{ height: 30, borderRadius: 8, background: gradient, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, transition: "background .3s" }}>
            Confirmar presença
          </div>
        </div>

        {/* Home indicator */}
        <div style={{ display: "flex", justifyContent: "center", paddingBottom: 8 }}>
          <div style={{ width: 80, height: 4, borderRadius: 999, background: "rgba(0,0,0,.2)" }} />
        </div>
      </div>
    </div>
  );
}

// ── Event info card ────────────────────────────────────────────────────────
function EventInfoCard({ event, guestLimit, trajeOn, setTrajeOn, acompOn, setAcompOn, restricaoOn, setRestricaoOn, trajeText, setTrajeText, msgOn, setMsgOn, msgText, setMsgText, draftName, setDraftName, draftDate, setDraftDate, draftTime, setDraftTime, draftLocation, setDraftLocation, draftAddress, setDraftAddress, draftLimit, setDraftLimit, limitError, setLimitError }: {
  event: { id: string; name: string; when: string };
  guestLimit: number;
  trajeOn: boolean; setTrajeOn: (v: boolean) => void;
  acompOn: boolean; setAcompOn: (v: boolean) => void;
  restricaoOn: boolean; setRestricaoOn: (v: boolean) => void;
  trajeText: string; setTrajeText: (v: string) => void;
  msgOn: boolean; setMsgOn: (v: boolean) => void;
  msgText: string; setMsgText: (v: string) => void;
  draftName: string; setDraftName: (v: string) => void;
  draftDate: string; setDraftDate: (v: string) => void;
  draftTime: string; setDraftTime: (v: string) => void;
  draftLocation: string; setDraftLocation: (v: string) => void;
  draftAddress: string; setDraftAddress: (v: string) => void;
  draftLimit: string; setDraftLimit: (v: string) => void;
  limitError: string; setLimitError: (v: string) => void;
}) {

  const inputStyle: React.CSSProperties = {
    height: 40, padding: "0 12px", borderRadius: 10,
    border: "1px solid var(--vw-border)", fontSize: 14, fontFamily: "inherit",
    outline: "none", color: "var(--vw-t1)", background: "var(--vw-input)",
    transition: "border .15s, box-shadow .15s", boxSizing: "border-box",
  };
  const focus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.border = "1px solid #b14eff";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(177,78,255,.12)";
  };
  const blur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.border = "1px solid var(--vw-border)";
    e.currentTarget.style.boxShadow = "none";
  };

  return (
    <div style={{ maxWidth: 500 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Nome do evento — controlado */}
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--vw-t3)", textTransform: "uppercase", letterSpacing: ".04em" }}>Nome do evento</label>
          <input type="text" value={draftName} onChange={e => setDraftName(e.target.value)} style={inputStyle} onFocus={focus} onBlur={blur} />
        </div>

        {/* Demais campos controlados */}
        {([
          { label: "Data",     value: draftDate,     set: setDraftDate,     type: "text" },
          { label: "Horário",  value: draftTime,     set: setDraftTime,     type: "text" },
          { label: "Local",    value: draftLocation, set: setDraftLocation, type: "text" },
          { label: "Endereço", value: draftAddress,  set: setDraftAddress,  type: "text" },
        ] as { label: string; value: string; set: (v: string) => void; type: string }[]).map(({ label, value, set, type }) => (
          <div key={label} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "var(--vw-t3)", textTransform: "uppercase", letterSpacing: ".04em" }}>{label}</label>
            <input type={type} value={value} onChange={e => set(e.target.value)} style={inputStyle} onFocus={focus} onBlur={blur} />
          </div>
        ))}

        {/* Número de convidados */}
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "var(--vw-t3)", textTransform: "uppercase", letterSpacing: ".04em" }}>
              Número de Convidados
            </label>
            <span style={{ fontSize: 10, color: "var(--vw-t4)", fontWeight: 500 }}>(Visível apenas para você)</span>
          </div>
          <input
            type="number"
            value={draftLimit}
            min={1}
            onChange={e => { setDraftLimit(e.target.value); setLimitError(""); }}
            style={{ ...inputStyle, borderColor: limitError ? "#e1124e" : undefined }}
            onFocus={focus}
            onBlur={blur}
          />
          {limitError && (
            <p style={{ fontSize: 12, color: "#e1124e", margin: "4px 0 0" }}>{limitError}</p>
          )}
        </div>

        {/* Traje do evento */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "var(--vw-t3)", textTransform: "uppercase", letterSpacing: ".04em" }}>
              Traje do Evento
            </label>
            {/* Toggle */}
            <button
              onClick={() => setTrajeOn(!trajeOn)}
              role="switch"
              aria-checked={trajeOn}
              style={{
                width: 40, height: 22, borderRadius: 999, border: "none",
                background: trajeOn ? "linear-gradient(135deg,#ff4d8d 0%,#b14eff 60%,#7a3aff 100%)" : "#e2e8f0",
                cursor: "pointer", position: "relative",
                transition: "background .2s",
                flexShrink: 0,
              }}
            >
              <span style={{
                position: "absolute", top: 3, left: trajeOn ? 21 : 3,
                width: 16, height: 16, borderRadius: 999,
                background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,.2)",
                transition: "left .2s",
                display: "block",
              }} />
            </button>
          </div>
          <input
            type="text"
            value={trajeText}
            onChange={e => setTrajeText(e.target.value)}
            disabled={!trajeOn}
            style={{
              ...inputStyle,
              background: trajeOn ? "var(--vw-input)" : "var(--vw-bg)",
              color: trajeOn ? "var(--vw-t1)" : "var(--vw-t4)",
              cursor: trajeOn ? "text" : "not-allowed",
            }}
            onFocus={trajeOn ? focus : undefined}
            onBlur={trajeOn ? blur : undefined}
          />
          {!trajeOn && (
            <p style={{ fontSize: 12, color: "var(--vw-t4)", margin: 0 }}>
              Traje desativado — não aparecerá no convite.
            </p>
          )}
        </div>

        {/* Acompanhante */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: "var(--vw-t3)", textTransform: "uppercase", letterSpacing: ".04em", display: "block" }}>
              Acompanhante
            </label>
            <span style={{ fontSize: 12, color: "var(--vw-t4)" }}>
              {acompOn ? "Convidados podem trazer +1" : "Acompanhantes não permitidos"}
            </span>
          </div>
          <button onClick={() => setAcompOn(!acompOn)} role="switch" aria-checked={acompOn}
            style={{ width: 40, height: 22, borderRadius: 999, border: "none", background: acompOn ? "linear-gradient(135deg,#ff4d8d 0%,#b14eff 60%,#7a3aff 100%)" : "#e2e8f0", cursor: "pointer", position: "relative", transition: "background .2s", flexShrink: 0 }}
          >
            <span style={{ position: "absolute", top: 3, left: acompOn ? 21 : 3, width: 16, height: 16, borderRadius: 999, background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,.2)", transition: "left .2s", display: "block" }} />
          </button>
        </div>

        {/* Restrição alimentar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "var(--vw-t3)", textTransform: "uppercase", letterSpacing: ".04em", display: "block" }}>
                Restrição alimentar
              </label>
              <span style={{ fontSize: 12, color: "var(--vw-t4)" }}>
                {restricaoOn ? "Campo exibido no convite" : "Campo oculto no convite"}
              </span>
            </div>
            <button onClick={() => setRestricaoOn(!restricaoOn)} role="switch" aria-checked={restricaoOn}
              style={{ width: 40, height: 22, borderRadius: 999, border: "none", background: restricaoOn ? "linear-gradient(135deg,#ff4d8d 0%,#b14eff 60%,#7a3aff 100%)" : "#e2e8f0", cursor: "pointer", position: "relative", transition: "background .2s", flexShrink: 0 }}
            >
              <span style={{ position: "absolute", top: 3, left: restricaoOn ? 21 : 3, width: 16, height: 16, borderRadius: 999, background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,.2)", transition: "left .2s", display: "block" }} />
            </button>
          </div>
          <p style={{ fontSize: 12, color: "var(--vw-t4)", margin: 0, lineHeight: 1.5 }}>
            Quando ativado, um campo opcional aparece no convite para que convidados com restrições alimentares — como vegetarianismo, intolerância ao glúten ou alergia — possam informar o organizador antes do evento.
          </p>
        </div>

        {/* Mensagem para os convidados */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "var(--vw-t3)", textTransform: "uppercase", letterSpacing: ".04em", display: "block" }}>
                Mensagem para os convidados
              </label>
              <span style={{ fontSize: 12, color: "var(--vw-t4)" }}>
                {msgOn ? "Aparece no convite" : "Desativada — não aparecerá no convite"}
              </span>
            </div>
            <button
              onClick={() => setMsgOn(!msgOn)}
              role="switch" aria-checked={msgOn}
              style={{ width: 40, height: 22, borderRadius: 999, border: "none", background: msgOn ? "linear-gradient(135deg,#ff4d8d 0%,#b14eff 60%,#7a3aff 100%)" : "#e2e8f0", cursor: "pointer", position: "relative", transition: "background .2s", flexShrink: 0 }}
            >
              <span style={{ position: "absolute", top: 3, left: msgOn ? 21 : 3, width: 16, height: 16, borderRadius: 999, background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,.2)", transition: "left .2s", display: "block" }} />
            </button>
          </div>
          {msgOn && (
            <textarea
              value={msgText}
              onChange={e => setMsgText(e.target.value)}
              placeholder="Ex: Bora celebrar! Quem é da casa não pode faltar 🎉"
              rows={3}
              style={{ ...inputStyle, height: "auto", padding: "10px 12px", resize: "vertical", lineHeight: 1.5 }}
              onFocus={e => { e.currentTarget.style.border = "1px solid #b14eff"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(177,78,255,.12)"; }}
              onBlur={e  => { e.currentTarget.style.border = "1px solid var(--vw-border)"; e.currentTarget.style.boxShadow = "none"; }}
            />
          )}
        </div>

      </div>
    </div>
  );
}

// ── Delete event modal ────────────────────────────────────────────────────
function DeleteEventModal({ eventName, eventId, organizerName, userName, sidebarEvents, onClose }: {
  eventName: string; eventId: string; organizerName: string; userName: string;
  sidebarEvents: SidebarEvent[]; onClose: () => void;
}) {
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const match = input.trim() === eventName.trim();
  const hasOtherEvents = sidebarEvents.some(e => e.id !== eventId);

  const handleDelete = async () => {
    if (!match) return;
    setLoading(true);
    try {
      await supabase.from("guests").delete().eq("event_id", eventId);
      await supabase.from("events").delete().eq("id", eventId);
      if (!hasOtherEvents) {
        const { data: session } = await supabase.auth.getSession();
        const userId = session.session?.user?.id;
        if (userId) {
          await supabase.from("events").insert({
            ...DEFAULT_EVENT,
            user_id: userId,
            organizer_name: organizerName || userName,
          });
        }
      }
      window.location.reload();
    } catch {
      setError("Erro ao excluir o evento. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(15,11,30,.5)", backdropFilter: "blur(4px)" }} />

      {/* Modal */}
      <div style={{ position: "relative", background: "var(--vw-card)", borderRadius: 20, padding: 32, maxWidth: 440, width: "100%", boxShadow: "0 24px 64px rgba(15,11,30,.2)" }}>
        {/* Icon */}
        <div style={{ width: 52, height: 52, borderRadius: 14, background: "#fde7ee", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#e1124e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--vw-t1)", margin: "0 0 8px", letterSpacing: "-0.02em" }}>
          Encerrar evento?
        </h2>
        <p style={{ fontSize: 14, color: "var(--vw-t3)", margin: "0 0 20px", lineHeight: 1.6 }}>
          Esta ação é <strong style={{ color: "var(--vw-t1)" }}>irreversível</strong>. Todos os dados do evento e a lista de convidados serão excluídos permanentemente.{" "}
          {hasOtherEvents
            ? "Você será redirecionado para outro evento."
            : "Um novo evento em branco será criado para você."}
        </p>

        <div style={{ background: "#fde7ee", borderRadius: 10, padding: "10px 14px", marginBottom: 20, fontSize: 13, color: "#9a0a37" }}>
          Para confirmar, digite o nome do evento exatamente como está: <strong>{eventName}</strong>
        </div>

        <input
          value={input}
          onChange={e => { setInput(e.target.value); setError(""); }}
          placeholder={eventName}
          style={{ width: "100%", height: 44, padding: "0 14px", borderRadius: 10, border: `1.5px solid ${match && input ? "#e1124e" : "var(--vw-border)"}`, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box", color: "var(--vw-t1)", marginBottom: error ? 8 : 16, background: match && input ? "#fff5f7" : "var(--vw-input)" }}
        />
        {error && <p style={{ fontSize: 12, color: "#e1124e", margin: "0 0 12px" }}>{error}</p>}

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{ flex: 1, height: 44, borderRadius: 10, border: "1px solid var(--vw-border)", fontSize: 14, fontWeight: 500, color: "var(--vw-t3)", background: "var(--vw-card)", cursor: "pointer", fontFamily: "inherit" }}
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={!match || loading}
            style={{ flex: 1, height: 44, borderRadius: 10, border: "none", fontSize: 14, fontWeight: 600, color: "#fff", background: match ? "#e1124e" : "#f9a8a8", cursor: match ? "pointer" : "not-allowed", fontFamily: "inherit", transition: "background .15s" }}
          >
            {loading ? "Excluindo…" : "Confirmar exclusão"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Primitive components ───────────────────────────────────────────────────
function Card({ children, padding = 24 }: { children: React.ReactNode; padding?: number }) {
  return <div style={{ background: "var(--vw-card)", borderRadius: 16, border: "1px solid var(--vw-border)", padding, boxShadow: "var(--vw-shadow)" }}>{children}</div>;
}
function EyebrowText({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase" as const, color: "var(--vw-t3)" }}>{children}</div>;
}
function SectionTitle({ children, style: s }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ fontSize: 17, fontWeight: 600, color: "var(--vw-t1)", marginTop: 2, ...s }}>{children}</div>;
}
function Pill({ children, bg, color, border }: { children: React.ReactNode; bg: string; color: string; border: string }) {
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 500, background: bg, color, border: `1px solid ${border}` }}>{children}</span>;
}
function GreenText({ children }: { children: React.ReactNode }) {
  return <span style={{ color: "#16a34a" }}>{children}</span>;
}
function GhostBtn({ children, icon, onClick }: { children?: React.ReactNode; icon?: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} style={{ height: 36, padding: "0 14px", borderRadius: 10, border: "1px solid var(--vw-border)", fontSize: 13, fontWeight: 500, color: "var(--vw-t2)", background: "var(--vw-card)", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "inherit", transition: "background .12s" }}
      onMouseEnter={e => (e.currentTarget.style.background = "var(--vw-hover)")}
      onMouseLeave={e => (e.currentTarget.style.background = "var(--vw-card)")}
    >{icon}{children}</button>
  );
}
function PrimaryBtn({ children, icon, onClick, disabled }: { children?: React.ReactNode; icon?: React.ReactNode; onClick?: () => void; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ height: 36, padding: "0 16px", borderRadius: 10, border: "none", fontSize: 13, fontWeight: 500, color: "#fff", cursor: disabled ? "not-allowed" : "pointer", background: "linear-gradient(135deg,#ff4d8d 0%,#b14eff 60%,#7a3aff 100%)", boxShadow: "0 4px 14px rgba(177,78,255,.3)", display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "inherit", transition: "opacity .15s", opacity: disabled ? 0.55 : 1 }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = ".88"; }}
      onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
    >{icon}{children}</button>
  );
}
function showToast(msg: string) {
  if (typeof window !== "undefined")
    window.dispatchEvent(new CustomEvent("vowify:toast", { detail: msg }));
}

function AppToast() {
  const [msg, setMsg] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      setMsg(detail);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setMsg(null), 3000);
    };
    window.addEventListener("vowify:toast", handler);
    return () => {
      window.removeEventListener("vowify:toast", handler);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  if (!msg) return null;
  return (
    <div style={{
      position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
      zIndex: 300, background: "#0f0b1e", color: "#fff",
      padding: "12px 22px", borderRadius: 999, fontSize: 14, fontWeight: 500,
      boxShadow: "0 8px 32px rgba(15,11,30,.3)", whiteSpace: "nowrap",
      pointerEvents: "none", fontFamily: "var(--font-bricolage), system-ui, sans-serif",
      animation: "vw-toast-in .18s cubic-bezier(0.22,1,0.36,1)",
    }}>
      {msg}
    </div>
  );
}

function SavedToast({ visible, message = "Alterações salvas!" }: { visible: boolean; message?: string }) {
  if (!visible) return null;
  return (
    <div className="saved-toast" style={{
      position: "fixed", bottom: 28, right: 28, zIndex: 200,
      padding: "12px 18px", borderRadius: 12,
      background: "#0f0b1e", color: "#fff",
      fontSize: 14, fontWeight: 500,
      display: "flex", alignItems: "center", gap: 8,
      boxShadow: "0 8px 32px rgba(15,11,30,.3)",
      pointerEvents: "none",
      fontFamily: "var(--font-bricolage), system-ui, sans-serif",
    }}>
      <span style={{ width: 20, height: 20, borderRadius: 999, background: "#16a34a", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <svg viewBox="0 0 16 16" width="11" height="11" fill="none">
          <path d="M3 8.5l3 3 7-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
      {message}
    </div>
  );
}

function LegendRow({ color, label, n, pct }: { color: string; label: string; n: number; pct: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
      <span style={{ width: 8, height: 8, borderRadius: 999, background: color, flexShrink: 0 }} />
      <span style={{ color: "var(--vw-t2)", flex: 1 }}>{label}</span>
      <span style={{ fontWeight: 600, fontFamily: "monospace", color: "var(--vw-t1)" }}>{n}</span>
      <span style={{ fontSize: 11, color: "var(--vw-t3)", minWidth: 32, textAlign: "right", fontFamily: "monospace" }}>{pct}%</span>
    </div>
  );
}
function StatTile({ eyebrow, value, suffix, note, bars, barColor, pct }: {
  eyebrow: string; value: number; suffix: string; note: React.ReactNode;
  bars?: number[]; barColor?: string; pct?: number;
}) {
  return (
    <Card>
      <EyebrowText>{eyebrow}</EyebrowText>
      <div style={{ marginTop: 8 }}>
        <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1, color: "var(--vw-t1)" }}>{value}</div>
        <div style={{ fontSize: 12, color: "var(--vw-t3)", marginTop: 4 }}>{suffix}</div>
      </div>
      {bars && (
        <div style={{ marginTop: 10, width: "100%" }}>
          <MiniBars values={bars} color={barColor ?? "#b14eff"} fullWidth />
        </div>
      )}
      {pct !== undefined && !bars && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10 }}>
          <div style={{ flex: 1, height: 6, borderRadius: 999, background: "var(--vw-border)", overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg,#ff4d8d,#b14eff)" }} />
          </div>
          <span style={{ fontSize: 11, color: "var(--vw-t3)", fontFamily: "monospace", flexShrink: 0 }}>{pct}%</span>
        </div>
      )}
      <div style={{ fontSize: 12, color: "var(--vw-t3)", paddingTop: 8, marginTop: 8, borderTop: "1px solid var(--vw-border2)" }}>{note}</div>
    </Card>
  );
}
function MiniBars({ values, color = "#b14eff", fullWidth = false }: { values: number[]; color?: string; fullWidth?: boolean }) {
  const max = Math.max(...values, 1);
  const w = 7, gap = 3, h = 28;
  const n = values.length;
  const totalW = n * w + (n - 1) * gap;
  return (
    <svg
      width={fullWidth ? "100%" : totalW}
      height={h}
      viewBox={`0 0 ${totalW} ${h}`}
      preserveAspectRatio="none"
    >
      {values.map((v, i) => {
        const bh = Math.max(3, (v / max) * h);
        return <rect key={i} x={i * (w + gap)} y={h - bh} width={w} height={bh} rx={2} fill={color} opacity={0.5 + (i / n) * 0.5} />;
      })}
    </svg>
  );
}

// ── Icons ──────────────────────────────────────────────────────────────────
const ic = (d: string) => <svg viewBox="0 0 16 16" width="15" height="15" fill="none"><path d={d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const CalendarIcon = () => ic("M2 3h12v11H2V3zm0 3h12M5 2v2M11 2v2");
const UsersIcon    = () => ic("M2 13c0-2.2 1.8-4 4-4s4 1.8 4 4M6 6a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm5-1a1.9 1.9 0 110-3.8A1.9 1.9 0 0111 5zm3.5 8c0-2-.9-3.5-2.5-3.5");
const InboxIcon    = () => ic("M2 9l1.5-5.5h9L14 9M2 9v3.5a1 1 0 001 1h10a1 1 0 001-1V9M2 9h4l1 2h2l1-2h4");
const SettingsIcon = () => (
  <svg viewBox="0 0 16 16" width="15" height="15" fill="none">
    <path d="M8 10a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M13.3 8c0-.3 0-.5-.1-.8l1.2-.9-1.2-2-1.5.4a5 5 0 00-1.4-.8L10 2.5H6.2l-.3 1.4a5 5 0 00-1.4.8l-1.5-.4-1.2 2 1.2.9c0 .3-.1.5-.1.8s0 .5.1.8l-1.2.9 1.2 2 1.5-.4c.4.3.9.6 1.4.8l.3 1.4H10l.3-1.4a5 5 0 001.4-.8l1.5.4 1.2-2-1.2-.9c.1-.3.1-.5.1-.8z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
  </svg>
);
const PlusIcon     = () => ic("M8 3v10M3 8h10");
const ShareIcon    = () => ic("M12 3.5a1.8 1.8 0 110 3.6 1.8 1.8 0 010-3.6zM4 8a1.8 1.8 0 110 3.6A1.8 1.8 0 014 8zm8 4.5a1.8 1.8 0 110 3.6 1.8 1.8 0 010-3.6zM5.5 9.2l5.1 2.4M10.6 6.4L5.5 8.8");
const DownloadIcon = () => ic("M8 2v8m0 0l-3-3m3 3l3-3M3 13h10");
const SendIcon     = () => ic("M2 8l12-5-5 12-2-5-5-2z");
const SearchIcon   = () => ic("M7 12.5a5.5 5.5 0 100-11 5.5 5.5 0 000 11zM13 13l-2.5-2.5");
const MenuIcon     = () => ic("M2 4h12M2 8h12M2 12h12");
const DotsIcon     = () => <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><circle cx="3.5" cy="8" r="1.3"/><circle cx="8" cy="8" r="1.3"/><circle cx="12.5" cy="8" r="1.3"/></svg>;
const EyeIcon      = () => ic("M1.5 8S4 3 8 3s6.5 5 6.5 5S14 13 8 13 1.5 8 1.5 8zM8 10a2 2 0 100-4 2 2 0 000 4z");
const TrashIcon    = () => ic("M3 4h10M6 4V2.5h4V4M5 4l.5 9.5h5L11 4");
