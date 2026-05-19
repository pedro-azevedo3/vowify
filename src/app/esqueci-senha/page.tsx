"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { LandingProvider } from "@/components/landing/LandingProvider";

const PROD_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vowify.app";

export default function EsqueciSenhaPage() {
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [error,   setError]   = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError("Informe seu e-mail."); return; }
    setLoading(true);
    setError("");
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${PROD_URL}/redefinir-senha`,
    });
    setLoading(false);
    if (err) { setError("Não foi possível enviar o e-mail. Verifique o endereço e tente novamente."); return; }
    setDone(true);
  };

  return (
    <LandingProvider>
      <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", fontFamily: "var(--font-bricolage), system-ui, sans-serif" }}>

        {/* Header */}
        <header style={{ padding: "16px 24px", borderBottom: "1px solid var(--lp-border)", background: "var(--lp-card)" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <Image src="/logo.png" alt="Vowify" width={28} height={28} style={{ borderRadius: 8 }} />
            <span style={{ fontSize: 17, fontWeight: 700, color: "var(--lp-t1)", letterSpacing: "-0.02em" }}>Vowify</span>
          </Link>
        </header>

        {/* Content */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ width: "100%", maxWidth: 420 }}>

            {done ? (
              <div style={{ background: "var(--lp-card)", borderRadius: 20, border: "1px solid var(--lp-border)", padding: 40, boxShadow: "0 4px 24px rgba(15,11,30,.06)", textAlign: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: 20, background: "#e6f7ee", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 20px" }}>📬</div>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--lp-t1)", margin: "0 0 10px", letterSpacing: "-0.02em" }}>Verifique seu e-mail</h1>
                <p style={{ fontSize: 14, color: "var(--lp-t3)", margin: "0 0 24px", lineHeight: 1.6 }}>
                  Enviamos um link de redefinição para <strong style={{ color: "var(--lp-t1)" }}>{email}</strong>. Clique no link para criar uma nova senha.
                </p>
                <p style={{ fontSize: 12, color: "var(--lp-t4)", margin: "0 0 24px" }}>
                  Não recebeu? Verifique a caixa de spam ou tente novamente.
                </p>
                <button
                  onClick={() => { setDone(false); setEmail(""); }}
                  style={{ fontSize: 13, color: "#b14eff", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 500 }}
                >
                  Tentar com outro e-mail
                </button>
              </div>
            ) : (
              <div style={{ background: "var(--lp-card)", borderRadius: 20, border: "1px solid var(--lp-border)", padding: 40, boxShadow: "0 4px 24px rgba(15,11,30,.06)" }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: "var(--lp-step-vis)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#b14eff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>

                <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--lp-t1)", margin: "0 0 8px", letterSpacing: "-0.025em" }}>Esqueceu a senha?</h1>
                <p style={{ fontSize: 14, color: "var(--lp-t3)", margin: "0 0 28px", lineHeight: 1.6 }}>
                  Sem problema. Informe seu e-mail e enviamos um link para você criar uma nova senha.
                </p>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "var(--lp-t3)", textTransform: "uppercase", letterSpacing: ".04em" }}>E-mail</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setError(""); }}
                      placeholder="voce@exemplo.com"
                      autoComplete="email"
                      autoFocus
                      style={{ height: 44, padding: "0 14px", borderRadius: 10, border: `1.5px solid ${error ? "#e1124e" : "var(--lp-border)"}`, fontSize: 14, fontFamily: "inherit", outline: "none", color: "var(--lp-t1)", background: "var(--lp-input-bg)", transition: "border .15s", boxSizing: "border-box", width: "100%" }}
                      onFocus={e => { if (!error) e.currentTarget.style.border = "1.5px solid #b14eff"; }}
                      onBlur={e => { if (!error) e.currentTarget.style.border = `1.5px solid var(--lp-border)`; }}
                    />
                    {error && <p style={{ fontSize: 12, color: "#e1124e", margin: 0 }}>{error}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{ height: 46, borderRadius: 12, border: "none", fontSize: 15, fontWeight: 600, color: "#fff", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, background: "linear-gradient(135deg,#ff4d8d 0%,#b14eff 60%,#7a3aff 100%)", boxShadow: "0 4px 14px rgba(177,78,255,.35)", fontFamily: "inherit", transition: "transform .12s, box-shadow .12s" }}
                    onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 22px rgba(177,78,255,.45)"; } }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 14px rgba(177,78,255,.35)"; }}
                  >
                    {loading ? "Enviando…" : "Enviar link de redefinição"}
                  </button>
                </form>

                <div style={{ textAlign: "center", marginTop: 20 }}>
                  <Link href="/" style={{ fontSize: 13, color: "var(--lp-t3)", textDecoration: "none" }}>
                    ← Voltar para o início
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </LandingProvider>
  );
}
