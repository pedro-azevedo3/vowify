"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Donut, Avatar } from "@/components/landing/shared";

// ── Data ──────────────────────────────────────────────────────────────────
const GUESTS = [
  { name: "Marina Castro",        phone: "+55 11 9 8845-2210", status: "confirmed", plus: 1, group: "Família",   at: "há 2 min" },
  { name: "Pedro Augusto Lima",   phone: "+55 11 9 9712-0388", status: "confirmed", plus: 1, group: "Trabalho",  at: "há 8 min" },
  { name: "Ana Beatriz Souza",    phone: "+55 21 9 8101-4456", status: "declined",  plus: 0, group: "Amigos",    at: "há 14 min" },
  { name: "Lucas Tavares",        phone: "+55 11 9 8845-2210", status: "confirmed", plus: 0, group: "Faculdade", at: "há 22 min" },
  { name: "Rafaela Pires",        phone: "+55 11 9 7763-9920", status: "confirmed", plus: 0, group: "Família",   at: "há 31 min" },
  { name: "Henrique Bittencourt", phone: "+55 11 9 8200-1144", status: "pending",  plus: 0, group: "Trabalho",  at: "—" },
  { name: "Camila Veloso",        phone: "+55 11 9 8123-7766", status: "confirmed", plus: 1, group: "Amigos",    at: "há 1 h" },
  { name: "João Pedro Maia",      phone: "+55 11 9 9001-3344", status: "pending",  plus: 0, group: "Faculdade", at: "—" },
  { name: "Tiago Rezende",        phone: "+55 11 9 7710-2298", status: "confirmed", plus: 0, group: "Trabalho",  at: "há 5 h" },
  { name: "Larissa Pacheco",      phone: "+55 11 9 8845-6633", status: "pending",  plus: 0, group: "Amigos",    at: "—" },
];

const EVENTS = [
  { name: "30 anos da Marina", when: "22 jun", active: true },
  { name: "Casamento J&L",     when: "12 set", active: false },
  { name: "Confra Velkro",     when: "14 dez", active: false },
];

const TIMELINE = [
  { name: "Marina Castro",    action: "confirmou presença",             time: "há 2 min",    type: "confirmed", extra: "+1 acompanhante" },
  { name: "Pedro Augusto",    action: "confirmou presença",             time: "há 8 min",    type: "confirmed", extra: "+1 acompanhante" },
  { name: "Ana Beatriz",      action: "não vai à festa",                time: "há 14 min",   type: "declined" },
  { name: "Lucas Tavares",    action: "confirmou presença",             time: "há 22 min",   type: "confirmed" },
  { name: "Sistema",          action: "enviou lembretes para 3 pendentes", time: "há 1 h",   type: "system" },
  { name: "Rafaela Pires",    action: "confirmou presença",             time: "há 1 h",      type: "confirmed" },
  { name: "Sistema",          action: "evento publicado",               time: "3 dias atrás", type: "event" },
];

const STATUS = {
  confirmed: { label: "Confirmado", bg: "#e6f7ee", color: "#0f6b32", border: "rgba(22,163,74,.18)" },
  pending:   { label: "Pendente",   bg: "#fef4e2", color: "#8a5a05", border: "rgba(245,158,11,.20)" },
  declined:  { label: "Não vai",   bg: "#fde7ee", color: "#9a0a37", border: "rgba(225,17,78,.18)" },
};

// ── Page ──────────────────────────────────────────────────────────────────
export default function MinhaFestaPage() {
  const [filter, setFilter]   = useState("all");
  const [query, setQuery]     = useState("");
  const [sideOpen, setSideOpen] = useState(false);

  const counts = GUESTS.reduce<Record<string, number>>((a, g) => {
    a[g.status] = (a[g.status] || 0) + 1;
    return a;
  }, {});
  const total          = GUESTS.length;
  const confirmedCount = counts.confirmed || 0;
  const companions     = GUESTS.filter(g => g.status === "confirmed").reduce((a, g) => a + g.plus, 0);
  const pendingCount   = counts.pending || 0;
  const respondedPct   = Math.round(((confirmedCount + (counts.declined || 0)) / total) * 100);

  const filtered = GUESTS.filter(g => {
    if (filter !== "all" && g.status !== filter) return false;
    if (query && !g.name.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ display: "flex", minHeight: "100dvh", background: "#faf7ff", fontFamily: "var(--font-bricolage), system-ui, sans-serif" }}>

      {/* ── Sidebar (desktop) ── */}
      <aside className="hidden lg:flex" style={{ width: 240, background: "#fff", borderRight: "1px solid #ece7f5", padding: 24, flexDirection: "column", gap: 24, position: "sticky", top: 0, height: "100dvh", flexShrink: 0 }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <Image src="/logo.png" alt="Vowify" width={28} height={28} style={{ borderRadius: 8 }} />
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", color: "#0f0b1e" }}>Vowify</span>
        </Link>

        <button style={{ height: 36, borderRadius: 10, border: "none", fontSize: 14, fontWeight: 500, color: "#fff", cursor: "pointer", background: "linear-gradient(135deg,#ff4d8d 0%,#b14eff 60%,#7a3aff 100%)", boxShadow: "0 4px 14px rgba(177,78,255,.3)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <PlusIcon /> Novo evento
        </button>

        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {[
            { label: "Início",       icon: <HomeIcon />,     active: false },
            { label: "Meus eventos", icon: <CalendarIcon />, active: true  },
            { label: "Convidados",   icon: <UsersIcon />,    active: false },
            { label: "Mensagens",    icon: <InboxIcon />,    active: false },
            { label: "Configurações",icon: <SettingsIcon />, active: false },
          ].map(({ label, icon, active }) => (
            <a key={label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8, fontSize: 14, background: active ? "linear-gradient(135deg,#ffe5ee 0%,#f1e1ff 60%,#e8dcff 100%)" : "transparent", color: active ? "#7a3aff" : "#2a2440", fontWeight: active ? 600 : 500, cursor: "pointer", textDecoration: "none" }}>
              {icon}{label}
            </a>
          ))}
        </nav>

        {/* Event list */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "#6e6880", padding: "0 12px 8px" }}>Eventos ativos</div>
          {EVENTS.map((e) => (
            <a key={e.name} style={{ display: "block", padding: "8px 12px", borderRadius: 8, background: e.active ? "#faf7ff" : "transparent", borderLeft: e.active ? "2px solid #b14eff" : "2px solid transparent", cursor: "pointer", textDecoration: "none", marginBottom: 2 }}>
              <div style={{ fontSize: 13, fontWeight: e.active ? 600 : 500, color: "#2a2440" }}>{e.name}</div>
              <div style={{ fontSize: 11, color: "#6e6880" }}>{e.when}</div>
            </a>
          ))}
        </div>

        {/* User */}
        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 10, padding: 10, borderRadius: 10, background: "#faf7ff" }}>
          <Avatar name="Marina Castro" size={32} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#0f0b1e", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Marina Castro</div>
            <div style={{ fontSize: 11, color: "#6e6880" }}>marina@gmail.com</div>
          </div>
        </div>
      </aside>

      {/* ── Mobile header ── */}
      <div className="lg:hidden" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 40, background: "#fff", borderBottom: "1px solid #ece7f5", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none" }}>
          <Image src="/logo.png" alt="Vowify" width={24} height={24} style={{ borderRadius: 6 }} />
          <span style={{ fontSize: 16, fontWeight: 700, color: "#0f0b1e" }}>Vowify</span>
        </Link>
        <button onClick={() => setSideOpen(!sideOpen)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6e6880", display: "flex" }}>
          <MenuIcon />
        </button>
      </div>

      {/* Mobile drawer */}
      {sideOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }}>
          <div onClick={() => setSideOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(15,11,30,.4)", backdropFilter: "blur(4px)" }} />
          <div style={{ position: "relative", width: 260, background: "#fff", padding: 24, display: "flex", flexDirection: "column", gap: 20, height: "100%", zIndex: 1 }}>
            <button onClick={() => setSideOpen(false)} style={{ alignSelf: "flex-end", background: "none", border: "none", cursor: "pointer", color: "#6e6880" }}><CloseIcon /></button>
            <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {[{ label: "Início", icon: <HomeIcon />, active: false }, { label: "Meus eventos", icon: <CalendarIcon />, active: true }, { label: "Convidados", icon: <UsersIcon />, active: false }].map(({ label, icon, active }) => (
                <a key={label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, fontSize: 14, background: active ? "linear-gradient(135deg,#ffe5ee 0%,#f1e1ff 60%,#e8dcff 100%)" : "transparent", color: active ? "#7a3aff" : "#2a2440", fontWeight: active ? 600 : 500, cursor: "pointer" }}>
                  {icon}{label}
                </a>
              ))}
            </nav>
            {EVENTS.map((e) => (
              <a key={e.name} style={{ display: "block", padding: "8px 12px", borderRadius: 8, borderLeft: e.active ? "2px solid #b14eff" : "2px solid transparent", cursor: "pointer" }}>
                <div style={{ fontSize: 13, fontWeight: e.active ? 600 : 400, color: "#2a2440" }}>{e.name}</div>
                <div style={{ fontSize: 11, color: "#6e6880" }}>{e.when}</div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <main style={{ flex: 1, padding: "28px 24px 64px", overflowX: "hidden" }} className="pt-[72px] lg:pt-0 lg:px-10 lg:py-7">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-7">
          <div>
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 6 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 500, background: "#e6f7ee", color: "#0f6b32", border: "1px solid rgba(22,163,74,.18)" }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: "#16a34a" }} />
                Evento ativo
              </span>
              <span style={{ fontSize: 12, color: "#6e6880" }}>Publicado há 3 dias · 22/06/2026 · 21h</span>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.025em", color: "#0f0b1e", margin: 0 }}>30 anos da Marina</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <ActionBtn icon={<ShareIcon />}>Compartilhar</ActionBtn>
            <ActionBtn icon={<DownloadIcon />}>Exportar CSV</ActionBtn>
            <button style={{ height: 36, padding: "0 14px", borderRadius: 10, border: "none", fontSize: 13, fontWeight: 500, color: "#fff", cursor: "pointer", background: "linear-gradient(135deg,#ff4d8d 0%,#b14eff 60%,#7a3aff 100%)", boxShadow: "0 4px 14px rgba(177,78,255,.3)", display: "inline-flex", alignItems: "center", gap: 6 }}>
              <SendIcon /> Lembrar pendentes
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_2fr] gap-5 mb-5">

          {/* Donut card */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #ece7f5", padding: 24, boxShadow: "0 1px 2px rgba(15,11,30,.04), 0 6px 24px rgba(15,11,30,.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "#6e6880" }}>Visão geral</div>
                <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em", color: "#0f0b1e", marginTop: 2 }}>Confirmações</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
              <Donut size={160} stroke={20} animate segments={[
                { value: confirmedCount, color: "#b14eff" },
                { value: pendingCount,   color: "#f59e0b" },
                { value: counts.declined || 0, color: "#e1124e" },
              ]}>
                <span style={{ fontSize: 28, fontWeight: 700, color: "#0f0b1e", letterSpacing: "-0.02em" }}>{confirmedCount + companions}</span>
                <span style={{ fontSize: 10, color: "#6e6880", marginTop: 2 }}>vão chegar</span>
              </Donut>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1, minWidth: 120 }}>
                <LegendRow color="#b14eff" label="Confirmados" n={confirmedCount} pct={Math.round((confirmedCount/total)*100)} />
                <LegendRow color="#f59e0b" label="Pendentes"   n={pendingCount}   pct={Math.round((pendingCount/total)*100)} />
                <LegendRow color="#e1124e" label="Não vão"     n={counts.declined || 0} pct={Math.round(((counts.declined||0)/total)*100)} />
              </div>
            </div>
          </div>

          {/* Stat tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatTile
              eyebrow="Convidados"
              value={total}
              suffix="de 80 vagas"
              note={<><span style={{ color: "#16a34a" }}>+4</span> nas últimas 24h</>}
              bar={<MiniBars values={[3,5,9,7,12,15,9,18,21]} color="#b14eff" />}
            />
            <StatTile
              eyebrow="Acompanhantes"
              value={companions}
              suffix="confirmados"
              note={`${confirmedCount + companions} pessoas no total`}
              bar={<MiniBars values={[1,1,2,1,3,2,3,4]} color="#ff4d8d" />}
            />
            <StatTile
              eyebrow="Faltam responder"
              value={pendingCount}
              suffix="convidados"
              note={<>Lembrete em <strong style={{ color: "#0f0b1e" }}>3 dias</strong></>}
              bar={
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                  <div style={{ flex: 1, height: 8, borderRadius: 999, background: "#ece7f5", overflow: "hidden" }}>
                    <div style={{ width: `${respondedPct}%`, height: "100%", background: "linear-gradient(90deg,#ff4d8d,#b14eff)" }} />
                  </div>
                  <span style={{ fontSize: 11, color: "#6e6880", fontFamily: "monospace" }}>{respondedPct}%</span>
                </div>
              }
            />
          </div>
        </div>

        {/* Guest table + timeline */}
        <div className="grid grid-cols-1 xl:grid-cols-[1.7fr_1fr] gap-5">

          {/* Guest table */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #ece7f5", overflow: "hidden", boxShadow: "0 1px 2px rgba(15,11,30,.04), 0 6px 24px rgba(15,11,30,.04)" }}>
            {/* Table header */}
            <div style={{ padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #ece7f5", flexWrap: "wrap", gap: 10 }}>
              <span style={{ fontSize: 17, fontWeight: 600, color: "#0f0b1e" }}>Convidados</span>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#6e6880" }}><SearchIcon /></span>
                  <input
                    placeholder="Buscar nome"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{ height: 34, paddingLeft: 32, paddingRight: 12, borderRadius: 8, border: "1px solid #ece7f5", fontSize: 13, fontFamily: "inherit", outline: "none", background: "#fff", width: 180, color: "#0f0b1e" }}
                    onFocus={(e) => (e.currentTarget.style.border = "1px solid #b14eff")}
                    onBlur={(e) => (e.currentTarget.style.border = "1px solid #ece7f5")}
                  />
                </div>
              </div>
            </div>

            {/* Filter chips */}
            <div style={{ padding: "10px 24px", display: "flex", gap: 6, borderBottom: "1px solid #ece7f5", flexWrap: "wrap" }}>
              {[
                { k: "all",       l: "Todos",       n: total },
                { k: "confirmed", l: "Confirmados",  n: confirmedCount },
                { k: "pending",   l: "Pendentes",    n: pendingCount },
                { k: "declined",  l: "Não vão",      n: counts.declined || 0 },
              ].map(({ k, l, n }) => (
                <button key={k} onClick={() => setFilter(k)} style={{ padding: "5px 12px", borderRadius: 999, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", transition: "all .15s", background: filter === k ? "#0f0b1e" : "transparent", color: filter === k ? "#fff" : "#2a2440", border: filter === k ? "1px solid #0f0b1e" : "1px solid #ece7f5" }}>
                  {l} <span style={{ opacity: .6, marginLeft: 4 }}>{n}</span>
                </button>
              ))}
            </div>

            {/* Column headers */}
            <div className="hidden sm:grid" style={{ gridTemplateColumns: "1.5fr 1fr .7fr .5fr .3fr", padding: "10px 24px", fontSize: 11, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: "#6e6880", background: "#faf7ff" }}>
              <span>Nome</span><span>WhatsApp</span><span>Status</span><span>+1</span><span />
            </div>

            {/* Rows */}
            <div>
              {filtered.length === 0 && (
                <div style={{ padding: "40px 24px", textAlign: "center", color: "#6e6880", fontSize: 14 }}>Nenhum convidado encontrado.</div>
              )}
              {filtered.map((g, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 24px", borderBottom: i < filtered.length - 1 ? "1px solid #f4f0fa" : "none", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 2, minWidth: 140 }}>
                    <Avatar name={g.name} size={32} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 500, fontSize: 13, color: "#0f0b1e", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{g.name}</div>
                      <div style={{ fontSize: 11, color: "#6e6880" }}>{g.at}</div>
                    </div>
                  </div>
                  <div className="hidden sm:block" style={{ fontSize: 12, color: "#6e6880", fontFamily: "monospace", flex: 1 }}>{g.phone}</div>
                  <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 500, background: STATUS[g.status as keyof typeof STATUS].bg, color: STATUS[g.status as keyof typeof STATUS].color, border: `1px solid ${STATUS[g.status as keyof typeof STATUS].border}` }}>
                    {STATUS[g.status as keyof typeof STATUS].label}
                  </span>
                  <span style={{ fontSize: 12, color: g.plus ? "#0f0b1e" : "#9994ac", fontFamily: "monospace", minWidth: 28, textAlign: "center" }}>{g.plus ? `+${g.plus}` : "—"}</span>
                  <button style={{ background: "transparent", border: "none", cursor: "pointer", color: "#6e6880", padding: 4 }}><DotsIcon /></button>
                </div>
              ))}
            </div>

            <div style={{ padding: "12px 24px", borderTop: "1px solid #ece7f5", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "#6e6880" }}>
              <span>Mostrando {filtered.length} de {total} convidados</span>
              <div style={{ display: "flex", gap: 4 }}>
                <PageBtn>‹</PageBtn>
                <PageBtn active>1</PageBtn>
                <PageBtn>›</PageBtn>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #ece7f5", padding: 24, boxShadow: "0 1px 2px rgba(15,11,30,.04), 0 6px 24px rgba(15,11,30,.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "#6e6880" }}>Atividade</div>
                <div style={{ fontSize: 17, fontWeight: 600, color: "#0f0b1e", marginTop: 2 }}>Linha do tempo</div>
              </div>
              <button style={{ padding: "4px 10px", borderRadius: 8, border: "1px solid #ece7f5", fontSize: 12, fontWeight: 500, color: "#2a2440", background: "transparent", cursor: "pointer", fontFamily: "inherit" }}>Hoje</button>
            </div>

            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: 15, top: 16, bottom: 16, width: 2, background: "#ece7f5" }} />
              {TIMELINE.map((e, i) => {
                const isSystem = e.type === "system" || e.type === "event";
                const dotColor = e.type === "confirmed" ? "#b14eff" : e.type === "declined" ? "#e1124e" : "#ece7f5";
                return (
                  <div key={i} style={{ display: "flex", gap: 12, marginBottom: 18, position: "relative" }}>
                    <div style={{ width: 32, height: 32, borderRadius: 999, flexShrink: 0, background: isSystem ? "linear-gradient(135deg,#ffe5ee 0%,#f1e1ff 60%,#e8dcff 100%)" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${dotColor}`, zIndex: 1 }}>
                      {isSystem
                        ? <Image src="/logo.png" alt="" width={18} height={18} style={{ borderRadius: 4 }} />
                        : <Avatar name={e.name} size={28} />
                      }
                    </div>
                    <div style={{ flex: 1, paddingTop: 4 }}>
                      <div style={{ fontSize: 13, color: "#0f0b1e" }}>
                        <span style={{ fontWeight: 500 }}>{e.name}</span>
                        {" "}<span style={{ color: "#6e6880" }}>{e.action}</span>
                      </div>
                      {e.extra && <div style={{ fontSize: 11, color: "#6e6880", marginTop: 2 }}>{e.extra}</div>}
                      <div style={{ fontSize: 11, color: "#9994ac", marginTop: 2 }}>{e.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────
function LegendRow({ color, label, n, pct }: { color: string; label: string; n: number; pct: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
      <span style={{ width: 8, height: 8, borderRadius: 999, background: color, flexShrink: 0 }} />
      <span style={{ color: "#2a2440", flex: 1 }}>{label}</span>
      <span style={{ fontWeight: 600, fontFamily: "monospace", color: "#0f0b1e" }}>{n}</span>
      <span style={{ fontSize: 11, color: "#6e6880", minWidth: 32, textAlign: "right", fontFamily: "monospace" }}>{pct}%</span>
    </div>
  );
}

function StatTile({ eyebrow, value, suffix, note, bar }: { eyebrow: string; value: number; suffix: string; note: React.ReactNode; bar: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #ece7f5", padding: 20, display: "flex", flexDirection: "column", gap: 12, boxShadow: "0 1px 2px rgba(15,11,30,.04), 0 6px 24px rgba(15,11,30,.04)" }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "#6e6880" }}>{eyebrow}</div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 8 }}>
        <div>
          <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1, color: "#0f0b1e" }}>{value}</div>
          <div style={{ fontSize: 12, color: "#6e6880", marginTop: 4 }}>{suffix}</div>
        </div>
        <div style={{ flexShrink: 0 }}>{bar}</div>
      </div>
      <div style={{ fontSize: 12, color: "#6e6880", paddingTop: 8, borderTop: "1px solid #f4f0fa" }}>{note}</div>
    </div>
  );
}

function MiniBars({ values, color = "#b14eff" }: { values: number[]; color?: string }) {
  const max = Math.max(...values, 1);
  const w = 8, gap = 3, h = 36;
  const total = values.length * w + (values.length - 1) * gap;
  return (
    <svg width={total} height={h} viewBox={`0 0 ${total} ${h}`}>
      {values.map((v, i) => {
        const barH = Math.max(4, (v / max) * h);
        return <rect key={i} x={i * (w + gap)} y={h - barH} width={w} height={barH} rx={3} fill={color} opacity={0.7 + (i / values.length) * 0.3} />;
      })}
    </svg>
  );
}

function ActionBtn({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button style={{ height: 36, padding: "0 14px", borderRadius: 10, border: "1px solid #ece7f5", fontSize: 13, fontWeight: 500, color: "#2a2440", background: "#fff", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "inherit", transition: "background .12s" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#faf7ff")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
    >
      {icon}{children}
    </button>
  );
}

function PageBtn({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <button style={{ width: 28, height: 28, borderRadius: 6, border: active ? "1px solid #b14eff" : "1px solid #ece7f5", fontSize: 12, fontWeight: 500, background: active ? "#b14eff" : "transparent", color: active ? "#fff" : "#6e6880", cursor: "pointer", fontFamily: "inherit" }}>{children}</button>
  );
}

// ── Icons ──────────────────────────────────────────────────────────────────
const ic = (d: string, s = 16) => <svg viewBox={`0 0 ${s} ${s}`} width={s} height={s} fill="none"><path d={d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const HomeIcon     = () => ic("M2.5 7.5L8 3l5.5 4.5V13a1 1 0 01-1 1h-2.5v-4h-4v4H3.5a1 1 0 01-1-1V7.5z");
const CalendarIcon = () => ic("M2 3h12v11H2V3zm0 3h12M5 2v2M11 2v2");
const UsersIcon    = () => ic("M2 13c0-2.2 1.8-4 4-4s4 1.8 4 4M6 6a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm5-1a1.9 1.9 0 110-3.8A1.9 1.9 0 0111 5zm3.5 8c0-2-.9-3.5-2.5-3.5");
const InboxIcon    = () => ic("M2 9l1.5-5.5h9L14 9M2 9v3.5a1 1 0 001 1h10a1 1 0 001-1V9M2 9h4l1 2h2l1-2h4");
const SettingsIcon = () => ic("M8 10a2 2 0 100-4 2 2 0 000 4zM8 1.5v2M8 12.5v2M14.5 8h-2M3.5 8h-2");
const PlusIcon     = () => ic("M8 3v10M3 8h10");
const ShareIcon    = () => ic("M12 3.5a1.8 1.8 0 110 3.6 1.8 1.8 0 010-3.6zM4 8a1.8 1.8 0 110 3.6A1.8 1.8 0 014 8zm8 4.5a1.8 1.8 0 110 3.6 1.8 1.8 0 010-3.6zM5.5 9.2l5.1 2.4M10.6 6.4L5.5 8.8");
const DownloadIcon = () => ic("M8 2v8m0 0l-3-3m3 3l3-3M3 13h10");
const SendIcon     = () => ic("M2 8l12-5-5 12-2-5-5-2z");
const SearchIcon   = () => ic("M7 12.5a5.5 5.5 0 100-11 5.5 5.5 0 000 11zM13 13l-2.5-2.5", 16);
const DotsIcon     = () => <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><circle cx="3" cy="8" r="1.3"/><circle cx="8" cy="8" r="1.3"/><circle cx="13" cy="8" r="1.3"/></svg>;
const MenuIcon     = () => ic("M2 4h12M2 8h12M2 12h12");
const CloseIcon    = () => ic("M4 4l8 8M12 4l-8 8");
