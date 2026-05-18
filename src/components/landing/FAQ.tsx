"use client";

import { useState } from "react";
import { useInView } from "@/hooks/use-in-view";

const faqs = [
  { q: "O que é RSVP?", a: "RSVP vem do francês \"Répondez s'il vous plaît\" — ou seja, \"responda, por favor\". É o sistema pelo qual os convidados confirmam ou recusam a presença em um evento. Na Vowify, o RSVP é feito diretamente pelo link do convite: o convidado clica, responde em segundos e o organizador vê a confirmação em tempo real no painel." },
  { q: "Preciso ter um número de WhatsApp Business?", a: "Não. A Vowify gera um link único para o seu evento. Você copia esse link e envia pelo seu próprio WhatsApp — pessoal, Business ou qualquer outro — sem precisar de integração nem configuração especial." },
{ q: "Os convidados precisam baixar algum aplicativo?", a: "Nada. O convidado recebe o link, clica, vê o convite no navegador e confirma a presença em menos de 10 segundos. Zero instalação, zero cadastro." },
  { q: "Qual é o limite de convidados?", a: "Sem limite. Você pode enviar o link para quantas pessoas quiser. O plano único de R$ 19,90 cobre convidados ilimitados para o evento." },
  { q: "Posso editar as informações do evento depois de criar?", a: "Sim. Data, horário, local, mensagem e imagem do convite são editáveis a qualquer momento antes da festa. As confirmações já recebidas são mantidas." },
{ q: "Quanto tempo dura um evento?", a: "Eventos duram 90 dias desde o pagamento, e podem ser reativados por mais 30 dias." },
  { q: "Como recebo o pagamento e qual a garantia?", a: "Aceitamos Pix, cartão de crédito e boleto. Se por qualquer motivo você não ficar satisfeito, devolvemos 100% do valor em até 7 dias após a compra — sem burocracia." },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const [ref, inView] = useInView();

  return (
    <section id="faq" className="px-6 sm:px-8 lg:px-14 pb-20 max-w-[1280px] mx-auto w-full">
      <div ref={ref} className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-10 lg:gap-14">

        {/* Left: title */}
        <div className={inView ? "vw-anim-left" : "vw-hidden"}>
          <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase" as const, color: "#b14eff" }}>FAQ</span>
          <h2
            className="text-[24px] sm:text-[28px] lg:text-[32px]"
            style={{ lineHeight: 1.1, letterSpacing: "-0.025em", fontWeight: 600, marginTop: 12, color: "var(--lp-t1)" }}
          >
            Perguntas que aparecem antes da festa.
          </h2>
          <p style={{ fontSize: 15, color: "var(--lp-t3)", lineHeight: 1.6, marginTop: 16 }}>
            Ainda tem dúvidas? Fale com a gente pelo WhatsApp — respondemos na hora.
          </p>
        </div>

        {/* Right: accordion */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {faqs.map(({ q, a }, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className={inView ? `vw-anim-up d-${Math.min(i * 60, 400)}` : "vw-hidden"}
                style={{ borderTop: "1px solid var(--lp-border)" }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24, padding: "20px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
                >
                  <span style={{ fontSize: 16, fontWeight: 500, color: "var(--lp-t1)", lineHeight: 1.4 }}>{q}</span>
                  <span style={{ flexShrink: 0, marginTop: 2, width: 22, height: 22, borderRadius: 999, background: isOpen ? "linear-gradient(135deg,#ff4d8d 0%,#b14eff 60%,#7a3aff 100%)" : "var(--lp-border2)", display: "inline-flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s", color: isOpen ? "#fff" : "var(--lp-t3)" }}>
                    <svg viewBox="0 0 16 16" width="12" height="12" fill="none">
                      {isOpen ? <path d="M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /> : <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />}
                    </svg>
                  </span>
                </button>
                <div style={{ overflow: "hidden", maxHeight: isOpen ? 300 : 0, transition: "max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)" }}>
                  <p style={{ fontSize: 14, color: "var(--lp-t3)", lineHeight: 1.65, paddingBottom: 20, margin: 0 }}>{a}</p>
                </div>
              </div>
            );
          })}
          <div style={{ borderTop: "1px solid var(--lp-border)" }} />
        </div>
      </div>
    </section>
  );
}
