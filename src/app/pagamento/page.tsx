"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

function maskCPF(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0,3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6)}`;
  return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6,9)}-${d.slice(9)}`;
}

function maskPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 7) return `(${d.slice(0,2)}) ${d.slice(2)}`;
  return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
}

function PagamentoContent() {
  const router      = useRouter();
  const params      = useSearchParams();
  const eventId     = params.get("event_id");
  const cancelled   = params.get("cancelled");

  const [loading,   setLoading]   = useState(true);
  const [submitting,setSubmitting]= useState(false);
  const [error,     setError]     = useState("");
  const [eventName, setEventName] = useState("Meu Evento");
  const [userId,    setUserId]    = useState("");
  const [activeId,  setActiveId]  = useState("");

  const [name,      setName]      = useState("");
  const [email,     setEmail]     = useState("");
  const [cpf,       setCpf]       = useState("");
  const [phone,     setPhone]     = useState("");

  const load = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.replace("/"); return; }

    setUserId(session.user.id);
    setEmail(session.user.email ?? "");
    setName(session.user.user_metadata?.full_name ?? "");

    // Busca evento pendente de pagamento
    const targetId = eventId ?? undefined;
    const query = supabase
      .from("events")
      .select("id, name, expires_at")
      .eq("user_id", session.user.id)
      .is("expires_at", null)
      .limit(1);

    const { data: events } = targetId
      ? await supabase.from("events").select("id, name, expires_at").eq("id", targetId).eq("user_id", session.user.id).limit(1)
      : await query;

    if (!events || events.length === 0) {
      router.replace("/meuevento");
      return;
    }

    setActiveId(events[0].id);
    setEventName(events[0].name || "Meu Evento");
    setLoading(false);
  }, [eventId, router]);

  useEffect(() => { load(); }, [load]);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const cpfClean = cpf.replace(/\D/g, "");
    if (!name.trim())              { setError("Informe seu nome completo."); return; }
    if (cpfClean.length !== 11)    { setError("CPF inválido."); return; }

    setSubmitting(true);

    const res = await fetch("/api/payment/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_id: activeId, user_id: userId, name: name.trim(), email, cpf: cpfClean, cellphone: phone }),
    });

    const json = await res.json();
    if (!res.ok) { setError(json.error ?? "Erro ao criar cobrança."); setSubmitting(false); return; }

    window.location.href = json.url;
  };

  const inp: React.CSSProperties = {
    height: 44, padding: "0 14px", borderRadius: 10, border: "1.5px solid #ece7f5",
    fontSize: 14, fontFamily: "inherit", outline: "none", color: "#0f0b1e",
    background: "#fff", transition: "border .15s", boxSizing: "border-box", width: "100%",
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100dvh" }}>
      <div style={{ width: 32, height: 32, borderRadius: 999, border: "3px solid #ece7f5", borderTopColor: "#b14eff", animation: "spin .8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: "100dvh", background: "#faf7ff", fontFamily: "var(--font-bricolage), system-ui, sans-serif" }}>
      <header style={{ padding: "16px 24px", borderBottom: "1px solid #ece7f5", background: "#fff" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <Image src="/logo.png" alt="Vowify" width={28} height={28} style={{ borderRadius: 8 }} />
          <span style={{ fontSize: 17, fontWeight: 700, color: "#0f0b1e", letterSpacing: "-0.02em" }}>Vowify</span>
        </Link>
      </header>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "40px 24px 80px" }}>

        {cancelled && (
          <div style={{ background: "#fde7ee", border: "1px solid rgba(225,17,78,.2)", borderRadius: 12, padding: "12px 16px", marginBottom: 24, fontSize: 13, color: "#9a0a37" }}>
            Pagamento cancelado. Tente novamente quando quiser.
          </div>
        )}

        {/* Resumo do pedido */}
        <div style={{ background: "#0f0b1e", borderRadius: 18, padding: 28, marginBottom: 24, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 100% 0%, rgba(177,78,255,.35), transparent 60%)", pointerEvents: "none" }} />
          <div style={{ position: "relative" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,.5)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 8 }}>Resumo do pedido</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 4 }}>{eventName}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)", marginBottom: 20 }}>Vowify · Evento · válido por 90 dias</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,.5)" }}>Total</span>
              <span style={{ fontSize: 32, fontWeight: 700, color: "#fff", letterSpacing: "-0.03em" }}>
                R$ 19<span style={{ fontSize: 18, color: "rgba(255,255,255,.6)" }}>,90</span>
              </span>
            </div>
          </div>
        </div>

        {/* Métodos aceitos */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
          {["PIX", "Cartão de crédito"].map(m => (
            <span key={m} style={{ padding: "4px 12px", borderRadius: 999, background: "#fff", border: "1px solid #ece7f5", fontSize: 12, fontWeight: 500, color: "#6e6880" }}>{m}</span>
          ))}
        </div>

        {/* Formulário */}
        <form onSubmit={handlePay} style={{ background: "#fff", borderRadius: 18, border: "1px solid #ece7f5", padding: 28, display: "flex", flexDirection: "column", gap: 16, boxShadow: "0 4px 24px rgba(15,11,30,.06)" }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0f0b1e", margin: 0, letterSpacing: "-0.02em" }}>Dados para cobrança</h2>

          <Field label="Nome completo">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome completo" style={inp}
              onFocus={e => (e.currentTarget.style.border = "1.5px solid #b14eff")}
              onBlur={e => (e.currentTarget.style.border = "1.5px solid #ece7f5")} />
          </Field>

          <Field label="E-mail">
            <input value={email} readOnly style={{ ...inp, background: "#faf7ff", color: "#9994ac" }} />
          </Field>

          <Field label="CPF">
            <input value={cpf} onChange={e => setCpf(maskCPF(e.target.value))} placeholder="000.000.000-00" inputMode="numeric" style={inp}
              onFocus={e => (e.currentTarget.style.border = "1.5px solid #b14eff")}
              onBlur={e => (e.currentTarget.style.border = "1.5px solid #ece7f5")} />
          </Field>

          <Field label="WhatsApp (opcional)">
            <input value={phone} onChange={e => setPhone(maskPhone(e.target.value))} placeholder="(11) 99999-9999" inputMode="tel" style={inp}
              onFocus={e => (e.currentTarget.style.border = "1.5px solid #b14eff")}
              onBlur={e => (e.currentTarget.style.border = "1.5px solid #ece7f5")} />
          </Field>

          {error && <p style={{ fontSize: 13, color: "#e1124e", margin: 0 }}>{error}</p>}

          <button type="submit" disabled={submitting}
            style={{ height: 48, borderRadius: 12, border: "none", fontSize: 15, fontWeight: 600, color: "#fff", cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1, background: "linear-gradient(135deg,#ff4d8d 0%,#b14eff 60%,#7a3aff 100%)", boxShadow: "0 4px 14px rgba(177,78,255,.35)", fontFamily: "inherit", transition: "transform .12s, box-shadow .12s" }}
            onMouseEnter={e => { if (!submitting) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 22px rgba(177,78,255,.45)"; } }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 14px rgba(177,78,255,.35)"; }}
          >
            {submitting ? "Redirecionando…" : "Ir para o pagamento →"}
          </button>

          <p style={{ fontSize: 11, color: "#9994ac", textAlign: "center", margin: 0 }}>
            Pix, cartão ou boleto · Garantia de 7 dias
          </p>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: "#6e6880", textTransform: "uppercase", letterSpacing: ".04em" }}>{label}</label>
      {children}
    </div>
  );
}

export default function PagamentoPage() {
  return (
    <Suspense>
      <PagamentoContent />
    </Suspense>
  );
}
