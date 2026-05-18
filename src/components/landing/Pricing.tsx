"use client";

import { useInView } from "@/hooks/use-in-view";

export function Pricing() {
  const [ref, inView] = useInView();

  const features = [
    "Convidados ilimitados",
    "Convite por WhatsApp + QR Code",
    "CRM com filtros e timeline",
    "Exportar CSV/PDF",
    "Página do convite responsiva",
  ];

  return (
    <section id="preco" className="px-6 sm:px-8 lg:px-14 pb-24 text-center max-w-[1280px] mx-auto w-full">
      <div ref={ref} className={inView ? "vw-anim-up" : "vw-hidden"}>
        <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase" as const, color: "#b14eff" }}>
          Preço
        </span>
        <h2 style={{ fontSize: 44, lineHeight: 1.1, letterSpacing: "-0.025em", fontWeight: 600, margin: "12px 0 12px", color: "var(--lp-t1)" }}>
          Um plano. Uma festa. Um preço.
        </h2>
        <p style={{ fontSize: 16, color: "var(--lp-t3)", maxWidth: 560, margin: "0 auto 36px", lineHeight: 1.55 }}>
          Sem mensalidade, sem upgrade escondido. Você paga uma vez e o evento fica ativo até o dia seguinte da festa.
        </p>
      </div>

      <div
        style={{
          maxWidth: 460,
          margin: "0 auto",
          borderRadius: 18,
          boxShadow: "0 20px 60px rgba(122,58,255,.18), 0 6px 18px rgba(15,11,30,.08)",
          transition: "transform 0.25s cubic-bezier(0.22,1,0.36,1), box-shadow 0.25s cubic-bezier(0.22,1,0.36,1)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-6px)";
          e.currentTarget.style.boxShadow = "0 0 0 1.5px rgba(177,78,255,.40), 0 24px 60px rgba(177,78,255,.30), 0 8px 24px rgba(15,11,30,.20)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "";
          e.currentTarget.style.boxShadow = "0 20px 60px rgba(122,58,255,.18), 0 6px 18px rgba(15,11,30,.08)";
        }}
      >
        <div
          className={inView ? "vw-anim-scale d-160" : "vw-hidden"}
          style={{
            padding: 32,
            textAlign: "left",
            background: "#0f0b1e",
            color: "#fff",
            borderRadius: 18,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 100% 0%, rgba(177,78,255,.4), transparent 60%)", pointerEvents: "none" }} />
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)", textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 500 }}>Vowify · Evento</div>
                <div style={{ fontSize: 48, fontWeight: 600, letterSpacing: "-0.03em", marginTop: 6, color: "#fff", lineHeight: 1 }}>
                  R$ 19<span style={{ fontSize: 24, color: "rgba(255,255,255,.6)" }}>,90</span>
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)", marginTop: 4 }}>por evento · pagamento único</div>
              </div>
              <span style={{ display: "inline-flex", alignItems: "center", padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 500, background: "linear-gradient(135deg,#ff4d8d 0%,#b14eff 60%,#7a3aff 100%)", color: "#fff" }}>
                Mais escolhido
              </span>
            </div>

            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: 10 }}>
              {features.map((f) => (
                <li key={f} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14, color: "rgba(255,255,255,.85)" }}>
                  <span style={{ width: 18, height: 18, borderRadius: 999, background: "linear-gradient(135deg,#ff4d8d 0%,#b14eff 60%,#7a3aff 100%)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}>
                    <svg viewBox="0 0 16 16" width="10" height="10" fill="none">
                      <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <button
              style={{ width: "100%", height: 48, borderRadius: 12, border: "none", fontSize: 15, fontWeight: 500, color: "#fff", cursor: "pointer", background: "linear-gradient(135deg,#ff4d8d 0%,#b14eff 60%,#7a3aff 100%)", boxShadow: "0 4px 14px rgba(177,78,255,.35)", transition: "transform .12s, box-shadow .12s" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 22px rgba(177,78,255,.45)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 14px rgba(177,78,255,.35)"; }}
              onClick={() => window.dispatchEvent(new CustomEvent("vowify:openRegister"))}
            >
              Criar meu evento
            </button>
            <div style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,.5)", marginTop: 12 }}>
              Pix, cartão ou boleto · garantia de 7 dias
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
