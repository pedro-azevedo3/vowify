"use client";

import { useInView } from "@/hooks/use-in-view";
import { Avatar, Donut } from "./shared";

export function Features() {
  const [ref, inView] = useInView(0.1);

  return (
    <section id="recursos" className="px-6 sm:px-8 lg:px-14 pb-24 max-w-[1280px] mx-auto w-full">
      <div ref={ref} className="vw-card" style={{ padding: 0, overflow: "hidden", background: "linear-gradient(180deg,#faf7ff,#fff)" }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] items-center">

          {/* Left: text */}
          <div
            className={`${inView ? "vw-anim-left" : "vw-hidden"} p-8 sm:p-10 lg:p-[56px_48px]`}
          >
            <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase" as const, color: "#b14eff" }}>CRM da festa</span>
            <h2
              className="text-[26px] sm:text-[32px] lg:text-[38px]"
              style={{ lineHeight: 1.1, letterSpacing: "-0.025em", fontWeight: 600, margin: "12px 0 16px", color: "#0f0b1e" }}
            >
              Saiba{" "}
              <em style={{ fontStyle: "normal" }} className="vw-gradient-text">exatamente</em>{" "}
              quantos vão chegar.
            </h2>
            <p style={{ fontSize: 16, color: "#6e6880", lineHeight: 1.55, margin: "0 0 24px" }}>
              Cada convidado entra no seu painel assim que abre o convite. Filtre por status, busque pelo nome, mande um lembrete e nunca mais conte na mão.
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 12 }}>
              {["Donut em tempo real (confirmados · pendentes · ausentes)", "Lista com filtro e busca", "Timeline das confirmações", "Exportar CSV ou PDF"].map((f) => (
                <li key={f} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14, color: "#2a2440" }}>
                  <span style={{ width: 20, height: 20, borderRadius: 999, background: "linear-gradient(135deg,#ffe5ee 0%,#f1e1ff 60%,#e8dcff 100%)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#b14eff", flexShrink: 0 }}>
                    <svg viewBox="0 0 16 16" width="12" height="12" fill="none"><path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 40, padding: "0 18px", borderRadius: 10, border: "none", fontSize: 14, fontWeight: 500, color: "#fff", background: "#0f0b1e", cursor: "pointer", transition: "transform 0.2s cubic-bezier(0.22,1,0.36,1), box-shadow 0.2s cubic-bezier(0.22,1,0.36,1), gap 0.2s ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(15,11,30,.25)"; e.currentTarget.style.gap = "12px"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; e.currentTarget.style.gap = "8px"; }}
            >
              Ver o CRM completo
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none"><path d="M3 8h10m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>

          {/* Right: dashboard */}
          <div className={`${inView ? "vw-anim-right d-160" : "vw-hidden"} p-6 lg:p-[40px_40px_40px_0]`}>
            <DashboardPreview animate={inView} />
          </div>
        </div>
      </div>
    </section>
  );
}

function DashboardPreview({ animate }: { animate: boolean }) {
  const activity = [
    ["Marina C.", "há 2 min", "confirmou"],
    ["Pedro Augusto", "há 8 min", "confirmou +1"],
    ["Ana Beatriz", "há 14 min", "não vai"],
    ["Lucas Tavares", "há 22 min", "confirmou"],
    ["Rafa Pires", "há 31 min", "confirmou"],
  ];
  return (
    <div className="vw-card vw-card-interactive" style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 20px 60px rgba(122,58,255,.18), 0 6px 18px rgba(15,11,30,.08)", background: "#fff" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #ece7f5", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ width: 10, height: 10, borderRadius: 999, background: "#ff5f57" }} />
        <span style={{ width: 10, height: 10, borderRadius: 999, background: "#febc2e" }} />
        <span style={{ width: 10, height: 10, borderRadius: 999, background: "#28c840" }} />
        <div style={{ marginLeft: 12, fontSize: 12, color: "#6e6880" }}>vowify.app/eventos/marina-30</div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.2fr] gap-5 p-6">
        <div>
          <div style={{ fontSize: 13, color: "#6e6880", marginBottom: 4 }}>30 anos da Marina</div>
          <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 16, color: "#0f0b1e" }}>Painel do evento</div>
          <Donut size={150} stroke={18} animate={animate} segments={[{ value: 38, color: "#b14eff" }, { value: 22, color: "#f59e0b" }, { value: 6, color: "#e1124e" }]}>
            <span style={{ fontSize: 28, fontWeight: 600, color: "#0f0b1e", opacity: animate ? 1 : 0, transition: "opacity 0.4s ease 0.65s" }}>58%</span>
            <span style={{ fontSize: 10, color: "#6e6880", opacity: animate ? 1 : 0, transition: "opacity 0.4s ease 0.75s" }}>confirmados</span>
          </Donut>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 14, fontSize: 12 }}>
            <DonutRow dot="#b14eff" label="Confirmados" value="38" />
            <DonutRow dot="#f59e0b" label="Pendentes" value="22" />
            <DonutRow dot="#e1124e" label="Ausentes" value="6" />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: "#6e6880", marginBottom: 4 }}>Últimas confirmações</div>
          {activity.map(([n, t, s]) => (
            <div key={n} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0" }}>
              <Avatar name={n} size={26} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: "#0f0b1e" }}>{n}</div>
                <div style={{ fontSize: 11, color: "#6e6880" }}>{t}</div>
              </div>
              <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 500, background: s.includes("não") ? "#fde7ee" : "#e6f7ee", color: s.includes("não") ? "#9a0a37" : "#0f6b32", border: `1px solid ${s.includes("não") ? "rgba(225,17,78,.18)" : "rgba(22,163,74,.16)"}` }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DonutRow({ dot, label, value }: { dot: string; label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ width: 8, height: 8, borderRadius: 999, background: dot, flexShrink: 0 }} />
      <span style={{ flex: 1, color: "#6e6880" }}>{label}</span>
      <span style={{ fontWeight: 600, fontFamily: "var(--font-geist-mono), monospace", color: "#0f0b1e" }}>{value}</span>
    </div>
  );
}
