"use client";

import { useInView } from "@/hooks/use-in-view";
import { VowQR, Donut } from "./shared";

export function HowItWorks() {
  const [ref, inView] = useInView();

  const steps = [
    {
      n: "01", t: "Suba o convite",
      d: "Faça upload do seu PDF ou imagem (Canva, designer, sua tia que ama Photoshop — tanto faz).",
      vis: <UploadVis animate={inView} />,
    },
    {
      n: "02", t: "Envie pelo WhatsApp",
      d: "A Vowify gera um link e um QR Code com o convite + formulário de confirmação no mesmo lugar.",
      vis: <ShareVis animate={inView} />,
    },
    {
      n: "03", t: "Acompanhe no painel",
      d: "Veja em tempo real quem confirmou, quem falta responder e exporte a lista quando precisar.",
      vis: <DonutVis animate={inView} />,
    },
  ];

  return (
    <section id="como-funciona" className="px-6 sm:px-8 lg:px-14 pb-24 max-w-[1280px] mx-auto w-full">
      <div
        className={`text-center ${inView ? "vw-anim-up" : "vw-hidden"}`}
        style={{ marginBottom: 48 }}
      >
        <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase" as const, color: "#b14eff" }}>
          Como funciona
        </span>
        <h2 className="text-[30px] sm:text-[38px] lg:text-[44px]" style={{ lineHeight: 1.1, letterSpacing: "-0.025em", fontWeight: 600, marginTop: 12, color: "#0f0b1e" }}>
          Três passos do convite ao &ldquo;quem chega&rdquo;.
        </h2>
      </div>

      <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((s, i) => (
          <div
            key={s.n}
            className={`vw-card vw-card-interactive ${inView ? `vw-anim-up d-${i * 120}` : "vw-hidden"}`}
            style={{ padding: 28, display: "flex", flexDirection: "column" }}
          >
            <div style={{ height: 200, marginBottom: 20, background: "linear-gradient(135deg,#ffe5ee 0%,#f1e1ff 60%,#e8dcff 100%)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              {s.vis}
            </div>
            <div style={{ fontSize: 12, color: "#b14eff", marginBottom: 8, fontFamily: "var(--font-geist-mono), monospace", fontWeight: 500 }}>{s.n}</div>
            <h3 style={{ fontSize: 22, lineHeight: 1.2, letterSpacing: "-0.02em", fontWeight: 600, margin: "0 0 8px", color: "#0f0b1e" }}>{s.t}</h3>
            <p style={{ fontSize: 14, color: "#6e6880", lineHeight: 1.55, margin: 0 }}>{s.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function UploadVis({ animate }: { animate: boolean }) {
  return (
    <div style={{ position: "relative", width: 160, height: 160 }}>
      <div style={{ position: "absolute", inset: 0, border: "2px dashed rgba(177,78,255,.5)", borderRadius: 16, background: "rgba(255,255,255,.6)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" as const, gap: 8, color: "#b14eff" }}>
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none"><path d="M12 16V4m0 0l-4 4m4-4l4 4M4 20h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <span style={{ fontSize: 12, fontWeight: 500 }}>convite.pdf</span>
      </div>
      <div
        className={animate ? "vw-float" : ""}
        style={{ position: "absolute", right: -20, bottom: -20, width: 90, height: 110, background: "#fff", padding: 8, display: "flex", flexDirection: "column" as const, gap: 4, transform: "rotate(6deg)", borderRadius: 10, border: "1px solid #ece7f5", boxShadow: "0 20px 60px rgba(122,58,255,.18), 0 6px 18px rgba(15,11,30,.08)", opacity: animate ? 1 : 0, transition: "opacity 0.5s ease 0.35s" }}
      >
        <div style={{ height: 32, background: "linear-gradient(135deg,#ff4d8d 0%,#b14eff 60%,#7a3aff 100%)", borderRadius: 4 }} />
        <div style={{ height: 4, background: "#ece7f5", borderRadius: 2, width: "80%" }} />
        <div style={{ height: 4, background: "#ece7f5", borderRadius: 2, width: "60%" }} />
        <div style={{ height: 4, background: "#ece7f5", borderRadius: 2, width: "70%" }} />
      </div>
    </div>
  );
}

function ShareVis({ animate }: { animate: boolean }) {
  return (
    <div style={{ position: "relative", width: 200, height: 160 }}>
      <div style={{ opacity: animate ? 1 : 0, transition: "opacity 0.5s ease 0.15s" }}>
        <VowQR size={130} />
      </div>
      <div
        className={animate ? "vw-pulse" : ""}
        style={{ position: "absolute", right: -24, top: 8, padding: "8px 12px", display: "flex", alignItems: "center", gap: 8, background: "#25d366", color: "#fff", borderRadius: 18, border: "none", boxShadow: "0 20px 60px rgba(122,58,255,.18), 0 6px 18px rgba(15,11,30,.08)", opacity: animate ? 1 : 0, transform: animate ? "translateX(0)" : "translateX(12px)", transition: "opacity 0.45s ease 0.3s, transform 0.45s cubic-bezier(0.22,1,0.36,1) 0.3s" }}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19.05 4.91A10 10 0 0 0 4.6 18.16L3 22l4-1.5A10 10 0 0 0 22 12a9.93 9.93 0 0 0-2.95-7.09zM12 20a8 8 0 0 1-4.07-1.11l-.29-.17-2.43.91.81-2.38-.19-.31A8 8 0 1 1 12 20zm4.55-5.92c-.25-.13-1.48-.73-1.71-.81s-.4-.13-.56.12-.64.81-.79.97-.29.17-.54.04a6.6 6.6 0 0 1-1.94-1.2 7.3 7.3 0 0 1-1.35-1.67c-.14-.25 0-.37.11-.49s.25-.29.38-.43.16-.25.25-.41.04-.31 0-.43-.56-1.35-.77-1.85-.4-.42-.55-.42h-.47a.9.9 0 0 0-.66.31 2.75 2.75 0 0 0-.85 2c0 1.18.86 2.32.98 2.49s1.7 2.59 4.11 3.63a13.8 13.8 0 0 0 1.37.51 3.3 3.3 0 0 0 1.51.09 2.46 2.46 0 0 0 1.62-1.14 2 2 0 0 0 .14-1.14c-.04-.13-.21-.21-.46-.34z" /></svg>
        <span style={{ fontSize: 12, fontWeight: 500 }}>Compartilhar</span>
      </div>
    </div>
  );
}

function DonutVis({ animate }: { animate: boolean }) {
  return (
    <Donut size={140} stroke={18} animate={animate} segments={[{ value: 42, color: "#b14eff" }, { value: 18, color: "#f59e0b" }, { value: 6, color: "#e1124e" }]}>
      <span style={{ fontSize: 22, fontWeight: 600, color: "#0f0b1e", opacity: animate ? 1 : 0, transition: "opacity 0.4s ease 0.65s" }}>64%</span>
      <span style={{ fontSize: 10, color: "#6e6880", opacity: animate ? 1 : 0, transition: "opacity 0.4s ease 0.75s" }}>confirmados</span>
    </Donut>
  );
}
