"use client";

import Link from "next/link";
import { Avatar, Donut } from "./shared";

export function Hero() {
  return (
    <section className="relative pt-[68px] overflow-hidden" style={{ background: "var(--lp-bg)" }}>
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-14 pt-10 pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-14 items-center">

          {/* ── Left: text ── */}
          <div>
            <span
              className="vw-anim-up"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 500,
                background: "var(--lp-card)", border: "1px solid var(--lp-border)", color: "var(--lp-t2)",
                marginBottom: 24, boxShadow: "0 1px 2px rgba(15,11,30,.04)",
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: 999, background: "#16a34a", display: "inline-block" }} />
              Lançado para festas de qualquer tamanho
            </span>

            <h1
              className="vw-anim-up d-80 text-[40px] sm:text-[52px] lg:text-[64px]"
              style={{
                lineHeight: 1.02, letterSpacing: "-0.035em", fontWeight: 600,
                margin: "0 0 24px", color: "var(--lp-t1)",
              }}
            >
              Convide, confirme,
              <br />
              <span className="vw-gradient-text">festeje sem dúvidas.</span>
            </h1>

            <p
              className="vw-anim-up d-160 text-base sm:text-lg lg:text-[19px]"
              style={{ lineHeight: 1.5, color: "var(--lp-t3)", margin: "0 0 32px", maxWidth: 520 }}
            >
              A Vowify envia convites por WhatsApp, coleta o RSVP
              automaticamente e mostra em um painel quem confirmou, quem falta e
              quanto cabe na festa. Um plano, um preço.
            </p>

            <div className="vw-anim-up d-240 flex flex-col sm:flex-row gap-3 mb-7">
              <button
                style={{
                  height: 48, padding: "0 22px", borderRadius: 12, border: "none",
                  fontSize: 15, fontWeight: 500, color: "#fff", cursor: "pointer",
                  background: "linear-gradient(135deg,#ff4d8d 0%,#b14eff 60%,#7a3aff 100%)",
                  boxShadow: "0 4px 14px rgba(177,78,255,.35)",
                  transition: "transform .12s, box-shadow .12s", whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 22px rgba(177,78,255,.45)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 14px rgba(177,78,255,.35)"; }}
                onClick={() => window.dispatchEvent(new CustomEvent("vowify:openRegister"))}
              >
                Criar meu evento — R$ 19,90
              </button>
              <Link
                href="/convite/exemplo"
                style={{
                  height: 48, padding: "0 22px", borderRadius: 12,
                  border: "1px solid var(--lp-border)", fontSize: 15, fontWeight: 500,
                  color: "var(--lp-t1)", background: "transparent", cursor: "pointer",
                  transition: "background .12s", display: "inline-flex",
                  alignItems: "center", textDecoration: "none",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--lp-bg2)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                Ver um exemplo
              </Link>
            </div>

            <div className="vw-anim-up d-320 flex flex-wrap gap-x-6 gap-y-2">
              {["Sem mensalidade", "Link e QR Code prontos", "CRM incluído"].map((item) => (
                <span key={item} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--lp-t3)" }}>
                  <CheckIcon />
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* ── Right: phone mockup (hidden on mobile) ── */}
          <div className="hidden lg:block">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none">
      <path d="M3 8.5l3 3 7-7" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HeroVisual() {
  return (
    <div
      className="vw-anim-fade d-160"
      style={{ position: "relative", height: 540, display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      {/* Floating notification — top left */}
      <div
        className="vw-card"
        style={{
          position: "absolute", top: 24, left: -24,
          padding: "12px 14px", display: "flex", alignItems: "center", gap: 10,
          width: 240, zIndex: 3,
          boxShadow: "0 4px 24px rgba(15, 11, 30, 0.08), 0 1px 4px rgba(15, 11, 30, 0.04)",
          animation: "vwFloat 7s ease-in-out infinite, vwFade 0.5s ease 500ms backwards",
        }}
      >
        <Avatar name="Marina Castro" size={32} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: "var(--lp-t1)" }}>Marina confirmou</div>
          <div style={{ fontSize: 11, color: "var(--lp-t3)" }}>há 2 minutos · + 1 acompanhante</div>
        </div>
        <span style={{ width: 22, height: 22, borderRadius: 999, background: "#e6f7ee", color: "#16a34a", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
            <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

      {/* Phone mockup */}
      <div
        className="vw-float"
        style={{ width: 280, height: 520, borderRadius: 36, background: "#0f0b1e", padding: 6, boxShadow: "0 30px 60px rgba(15,11,30,.25), 0 0 0 1px rgba(15,11,30,.06)", position: "relative", zIndex: 2 }}
      >
        <div style={{ width: "100%", height: "100%", borderRadius: 30, overflow: "hidden", background: "#fff", display: "flex", flexDirection: "column" }}>
          <div style={{ height: 240, background: "linear-gradient(135deg,#ff4d8d 0%,#b14eff 60%,#7a3aff 100%)", padding: "32px 24px", color: "#fff", position: "relative", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
            <div style={{ position: "absolute", top: 16, right: 16, fontSize: 11, fontWeight: 500, padding: "4px 8px", borderRadius: 999, background: "rgba(255,255,255,.18)", backdropFilter: "blur(6px)" }}>RSVP</div>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", opacity: 0.8 }}>Você foi convidado</div>
            <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em", marginTop: 6, lineHeight: 1.1 }}>30 anos da<br />Marina</div>
            <div style={{ fontSize: 13, marginTop: 12, opacity: 0.85 }}>22 jun · 21h · Casa Solar</div>
          </div>
          <div style={{ padding: 20, flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#6e6880" }}>Confirme sua presença</div>
            <div style={{ height: 38, borderRadius: 10, border: "1px solid #ece7f5", display: "flex", alignItems: "center", padding: "0 12px", fontSize: 12, color: "#9994ac" }}>Seu nome</div>
            <div style={{ height: 38, borderRadius: 10, border: "1px solid #ece7f5", display: "flex", alignItems: "center", padding: "0 12px", fontSize: 12, color: "#9994ac" }}>Número de WhatsApp</div>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1, height: 38, borderRadius: 10, border: "1px solid #b14eff", color: "#b14eff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600 }}>Vou!</div>
              <div style={{ flex: 1, height: 38, borderRadius: 10, border: "1px solid #ece7f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#6e6880" }}>Não vou</div>
            </div>
            <div style={{ height: 38, borderRadius: 10, background: "linear-gradient(135deg,#ff4d8d 0%,#b14eff 60%,#7a3aff 100%)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, marginTop: "auto" }}>Enviar confirmação</div>
          </div>
        </div>
      </div>

      {/* Floating donut card */}
      <div
        className="vw-card vw-anim-right d-600 vw-float-offset"
        style={{
          position: "absolute", bottom: 30, right: -36,
          padding: 16, display: "flex", alignItems: "center", gap: 14,
          width: 220, zIndex: 3,
          boxShadow: "0 4px 24px rgba(15, 11, 30, 0.08), 0 1px 4px rgba(15, 11, 30, 0.04)",
        }}
      >
        <Donut size={56} stroke={8} segments={[{ value: 38, color: "#b14eff" }, { value: 22, color: "#f59e0b" }, { value: 6, color: "#e1124e" }]}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--lp-t1)" }}>58%</span>
        </Donut>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: "var(--lp-t1)" }}>38 de 66 confirmados</div>
          <div style={{ fontSize: 11, color: "var(--lp-t3)" }}>22 pendentes · 6 ausentes</div>
        </div>
      </div>
    </div>
  );
}
