"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default function RedefinirSenhaPage() {
  const router = useRouter();
  const [password, setPassword]   = useState("");
  const [confirm,  setConfirm]    = useState("");
  const [showPw,   setShowPw]     = useState(false);
  const [showCfm,  setShowCfm]    = useState(false);
  const [loading,  setLoading]    = useState(false);
  const [done,     setDone]       = useState(false);
  const [error,    setError]      = useState("");
  const [ready,    setReady]      = useState(false);

  useEffect(() => {
    // Supabase dispara PASSWORD_RECOVERY quando o link do e-mail é aberto
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    // Também checa se já há sessão ativa de recovery
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("A senha deve ter no mínimo 6 caracteres."); return; }
    if (password !== confirm) { setError("As senhas não coincidem."); return; }
    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) { setError("Não foi possível redefinir a senha. O link pode ter expirado."); return; }
    setDone(true);
    setTimeout(() => router.push("/meuevento"), 2500);
  };

  const inputStyle = (hasError?: boolean): React.CSSProperties => ({
    height: 44, padding: "0 44px 0 14px", borderRadius: 10,
    border: `1.5px solid ${hasError ? "#e1124e" : "#ece7f5"}`,
    fontSize: 14, fontFamily: "inherit", outline: "none",
    color: "#0f0b1e", background: "#fff",
    transition: "border .15s", boxSizing: "border-box", width: "100%",
  });

  return (
    <div style={{ minHeight: "100dvh", background: "#faf7ff", display: "flex", flexDirection: "column", fontFamily: "var(--font-bricolage), system-ui, sans-serif" }}>

      {/* Header */}
      <header style={{ padding: "16px 24px", borderBottom: "1px solid #ece7f5", background: "#fff" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <Image src="/logo.png" alt="Vowify" width={28} height={28} style={{ borderRadius: 8 }} />
          <span style={{ fontSize: 17, fontWeight: 700, color: "#0f0b1e", letterSpacing: "-0.02em" }}>Vowify</span>
        </Link>
      </header>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ width: "100%", maxWidth: 420 }}>

          {done ? (
            <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #ece7f5", padding: 40, boxShadow: "0 4px 24px rgba(15,11,30,.06)", textAlign: "center" }}>
              <div style={{ width: 64, height: 64, borderRadius: 20, background: "#e6f7ee", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 20px" }}>✅</div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f0b1e", margin: "0 0 10px", letterSpacing: "-0.02em" }}>Senha redefinida!</h1>
              <p style={{ fontSize: 14, color: "#6e6880", margin: 0, lineHeight: 1.6 }}>
                Sua senha foi alterada com sucesso. Redirecionando para o painel…
              </p>
            </div>
          ) : !ready ? (
            <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #ece7f5", padding: 40, boxShadow: "0 4px 24px rgba(15,11,30,.06)", textAlign: "center" }}>
              <div style={{ width: 64, height: 64, borderRadius: 20, background: "#fde7ee", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 20px" }}>⚠️</div>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: "#0f0b1e", margin: "0 0 10px", letterSpacing: "-0.02em" }}>Link inválido ou expirado</h1>
              <p style={{ fontSize: 14, color: "#6e6880", margin: "0 0 24px", lineHeight: 1.6 }}>
                Este link de redefinição não é válido ou já expirou. Solicite um novo link.
              </p>
              <Link
                href="/esqueci-senha"
                style={{ display: "inline-flex", height: 42, padding: "0 20px", borderRadius: 10, fontSize: 14, fontWeight: 600, color: "#fff", background: "linear-gradient(135deg,#ff4d8d 0%,#b14eff 60%,#7a3aff 100%)", textDecoration: "none", alignItems: "center" }}
              >
                Solicitar novo link
              </Link>
            </div>
          ) : (
            <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #ece7f5", padding: 40, boxShadow: "0 4px 24px rgba(15,11,30,.06)" }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg,#ffe5ee 0%,#f1e1ff 60%,#e8dcff 100%)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#b14eff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>

              <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0f0b1e", margin: "0 0 8px", letterSpacing: "-0.025em" }}>Nova senha</h1>
              <p style={{ fontSize: 14, color: "#6e6880", margin: "0 0 28px", lineHeight: 1.6 }}>
                Escolha uma senha forte com pelo menos 6 caracteres.
              </p>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Senha */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: "#6e6880", textTransform: "uppercase", letterSpacing: ".04em" }}>Nova senha</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={e => { setPassword(e.target.value); setError(""); }}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      autoFocus
                      style={inputStyle(!!error)}
                      onFocus={e => { if (!error) e.currentTarget.style.border = "1.5px solid #b14eff"; }}
                      onBlur={e => { if (!error) e.currentTarget.style.border = "1.5px solid #ece7f5"; }}
                    />
                    <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9994ac", display: "flex" }}>
                      {showPw ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                {/* Confirmar */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: "#6e6880", textTransform: "uppercase", letterSpacing: ".04em" }}>Confirmar senha</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showCfm ? "text" : "password"}
                      value={confirm}
                      onChange={e => { setConfirm(e.target.value); setError(""); }}
                      placeholder="Repita a senha"
                      autoComplete="new-password"
                      style={inputStyle(!!error)}
                      onFocus={e => { if (!error) e.currentTarget.style.border = "1.5px solid #b14eff"; }}
                      onBlur={e => { if (!error) e.currentTarget.style.border = "1.5px solid #ece7f5"; }}
                    />
                    <button type="button" onClick={() => setShowCfm(v => !v)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9994ac", display: "flex" }}>
                      {showCfm ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                {error && <p style={{ fontSize: 12, color: "#e1124e", margin: 0 }}>{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  style={{ height: 46, borderRadius: 12, border: "none", fontSize: 15, fontWeight: 600, color: "#fff", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, background: "linear-gradient(135deg,#ff4d8d 0%,#b14eff 60%,#7a3aff 100%)", boxShadow: "0 4px 14px rgba(177,78,255,.35)", fontFamily: "inherit", transition: "transform .12s, box-shadow .12s" }}
                  onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 22px rgba(177,78,255,.45)"; } }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 14px rgba(177,78,255,.35)"; }}
                >
                  {loading ? "Salvando…" : "Salvar nova senha"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EyeIcon() {
  return <svg viewBox="0 0 16 16" width="15" height="15" fill="none"><path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.4"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/></svg>;
}
function EyeOffIcon() {
  return <svg viewBox="0 0 16 16" width="15" height="15" fill="none"><path d="M2 2l12 12M6.5 6.6A2 2 0 0010 10M4.5 4.6C2.9 5.7 1.5 7.5 1.5 8s2 4.5 6.5 4.5c1.2 0 2.2-.3 3.1-.7M7 3.6C7.3 3.5 7.7 3.5 8 3.5c4.5 0 6.5 4 6.5 4.5 0 .3-.4 1-1.1 1.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>;
}
