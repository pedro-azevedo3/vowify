"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

const navLinks = [
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#recursos", label: "Recursos" },
  { href: "#preco", label: "Preço" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [mobileForm, setMobileForm] = useState<"login" | "register" | null>(null);

  const loginRef    = useRef<HTMLDivElement>(null);
  const registerRef = useRef<HTMLDivElement>(null);
  const navRef      = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Open register dropdown from any CTA on the page
  useEffect(() => {
    const handler = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (window.innerWidth >= 768) {
        setRegisterOpen(true);
        setLoginOpen(false);
      } else {
        setMobileOpen(true);
        setMobileForm("register");
      }
    };
    window.addEventListener("vowify:openRegister", handler);
    return () => window.removeEventListener("vowify:openRegister", handler);
  }, []);

  // Close dropdowns/menu on outside click or Escape
  useEffect(() => {
    if (!loginOpen && !registerOpen && !mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLoginOpen(false); setRegisterOpen(false);
        setMobileOpen(false); setMobileForm(null);
      }
    };
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      const outsideNav = navRef.current && !navRef.current.contains(target);
      const outsideLogin = loginRef.current && !loginRef.current.contains(target);
      const outsideRegister = registerRef.current && !registerRef.current.contains(target);
      if (outsideLogin && outsideRegister) {
        setLoginOpen(false);
        setRegisterOpen(false);
      }
      if (outsideNav) {
        setMobileOpen(false);
        setMobileForm(null);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [loginOpen, registerOpen, mobileOpen]);

  return (
    <header ref={navRef}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-[#ece7f5] shadow-sm"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-14">
        <div className="flex items-center justify-between h-[68px]">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="Vowify" width={28} height={28} style={{ borderRadius: 8 }} priority />
            <span className="font-extrabold text-xl tracking-tight text-[#0f0b1e]">Vowify</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-sm font-medium text-[#2a2440] hover:text-[#0f0b1e] transition-colors cursor-pointer">
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-2">

            {/* ── Login dropdown ── */}
            <div ref={loginRef} style={{ position: "relative" }}>
              <button
                onClick={() => { setLoginOpen((o) => !o); setRegisterOpen(false); }}
                className="h-8 px-3 rounded-lg border text-sm font-medium transition-all cursor-pointer"
                style={{
                  border: loginOpen ? "1px solid #b14eff" : "1px solid #ece7f5",
                  color: loginOpen ? "#b14eff" : "#0f0b1e",
                  background: loginOpen ? "#faf7ff" : "transparent",
                  boxShadow: loginOpen ? "0 0 0 3px rgba(177,78,255,.12)" : "none",
                }}
              >
                Entrar
              </button>

              {loginOpen && (
                <AuthDropdown
                  mode="login"
                  onSwitch={() => { setLoginOpen(false); setRegisterOpen(true); }}
                />
              )}
            </div>

            {/* ── Register dropdown ── */}
            <div ref={registerRef} style={{ position: "relative" }}>
              <button
                onClick={() => { setRegisterOpen((o) => !o); setLoginOpen(false); }}
                className="h-8 px-3 rounded-lg text-sm font-medium text-white cursor-pointer transition-all hover:-translate-y-px"
                style={{
                  background: "linear-gradient(135deg,#ff4d8d 0%,#b14eff 60%,#7a3aff 100%)",
                  boxShadow: registerOpen
                    ? "0 0 0 3px rgba(177,78,255,.25), 0 4px 14px rgba(177,78,255,.35)"
                    : "0 4px 14px rgba(177,78,255,.35)",
                }}
              >
                Registre-se
              </button>

              {registerOpen && (
                <AuthDropdown
                  mode="register"
                  onSwitch={() => { setRegisterOpen(false); setLoginOpen(true); }}
                />
              )}
            </div>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-[#f4f0fa] transition-colors cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-[#ece7f5] bg-white rounded-b-2xl -mx-6 sm:-mx-8 px-6 sm:px-8">
            <div className="flex flex-col gap-4 pt-4">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="text-sm font-medium text-[#2a2440] hover:text-[#0f0b1e] transition-colors cursor-pointer" onClick={() => setMobileOpen(false)}>
                  {link.label}
                </a>
              ))}

              <div className="flex flex-col gap-2 pt-2 border-t border-[#ece7f5]">
                {/* Entrar */}
                <button
                  onClick={() => setMobileForm((f) => f === "login" ? null : "login")}
                  className="h-9 px-4 rounded-lg text-sm font-medium cursor-pointer transition-all"
                  style={{ border: mobileForm === "login" ? "1px solid #b14eff" : "1px solid #ece7f5", color: mobileForm === "login" ? "#b14eff" : "#0f0b1e", background: mobileForm === "login" ? "#faf7ff" : "transparent" }}
                >
                  {mobileForm === "login" ? "Fechar" : "Entrar"}
                </button>

                {mobileForm === "login" && (
                  <MobileAuthForm mode="login" onSwitch={() => setMobileForm("register")} />
                )}

                {/* Criar evento */}
                <button
                  onClick={() => setMobileForm((f) => f === "register" ? null : "register")}
                  className="h-9 px-4 rounded-lg text-sm font-medium cursor-pointer transition-all"
                  style={{ color: "#fff", background: "linear-gradient(135deg,#ff4d8d 0%,#b14eff 60%,#7a3aff 100%)", boxShadow: mobileForm === "register" ? "0 0 0 3px rgba(177,78,255,.25)" : "none", opacity: mobileForm === "login" ? 0.6 : 1 }}
                >
                  {mobileForm === "register" ? "Fechar" : "Registre-se"}
                </button>

                {mobileForm === "register" && (
                  <MobileAuthForm mode="register" onSwitch={() => setMobileForm("login")} />
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

// ── Shared input style ─────────────────────────────────────────────────────
const inputCss: React.CSSProperties = {
  height: 40, padding: "0 12px", borderRadius: 10,
  border: "1px solid #ece7f5", fontSize: 14, color: "#0f0b1e",
  fontFamily: "inherit", outline: "none", background: "#fff",
  transition: "border .15s, box-shadow .15s", width: "100%", boxSizing: "border-box",
};

const inputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
  e.currentTarget.style.border = "1px solid #b14eff";
  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(177,78,255,.12)";
};
const inputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
  e.currentTarget.style.border = "1px solid #ece7f5";
  e.currentTarget.style.boxShadow = "none";
};

// ── Shared auth form logic ─────────────────────────────────────────────────
function useAuthForm(mode: "login" | "register") {
  const router = useRouter();
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [done,     setDone]     = useState(false);

  const submit = async () => {
    setError("");
    if (mode === "register" && password !== confirm) {
      setError("As senhas não coincidem."); return;
    }
    setLoading(true);
    if (mode === "register") {
      const { error: e } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name } },
      });
      if (e) { setError(e.message); setLoading(false); return; }
      setDone(true);
    } else {
      const { error: e } = await supabase.auth.signInWithPassword({ email, password });
      if (e) { setError(e.message); setLoading(false); return; }
      router.push("/meuevento");
    }
    setLoading(false);
  };

  return { name, setName, email, setEmail, password, setPassword, confirm, setConfirm, loading, error, done, submit };
}

// ── Desktop dropdown ───────────────────────────────────────────────────────
function AuthDropdown({ mode, onSwitch }: { mode: "login" | "register"; onSwitch: () => void }) {
  const isRegister = mode === "register";
  const [showPw,  setShowPw]  = useState(false);
  const [showCfm, setShowCfm] = useState(false);
  const { name, setName, email, setEmail, password, setPassword, confirm, setConfirm, loading, error, done, submit } = useAuthForm(mode);

  if (done) return (
    <div style={{ position: "absolute", top: "calc(100% + 10px)", right: 0, width: 320, background: "#fff", borderRadius: 16, border: "1px solid #ece7f5", boxShadow: "0 4px 6px rgba(15,11,30,.04), 0 20px 50px rgba(122,58,255,.12)", padding: 24, textAlign: "center" }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>🎉</div>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: "#0f0b1e", margin: "0 0 8px" }}>Verifique seu e-mail</h3>
      <p style={{ fontSize: 13, color: "#6e6880", margin: 0 }}>Enviamos um link de confirmação para <strong>{email}</strong>. Confirme para acessar sua conta.</p>
    </div>
  );

  return (
    <div style={{ position: "absolute", top: "calc(100% + 10px)", right: 0, width: 320, background: "#fff", borderRadius: 16, border: "1px solid #ece7f5", boxShadow: "0 4px 6px rgba(15,11,30,.04), 0 20px 50px rgba(122,58,255,.12)", padding: 24, animation: "vwDropdown 0.2s cubic-bezier(0.22,1,0.36,1)", zIndex: 100 }}>
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em", color: "#0f0b1e", margin: "0 0 4px" }}>
          {isRegister ? "Criar sua conta" : "Bem-vindo de volta"}
        </h3>
        <p style={{ fontSize: 13, color: "#6e6880", margin: 0 }}>
          {isRegister ? "Crie eventos e gerencie confirmações." : "Entre para gerenciar seus eventos."}
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {isRegister && (
          <Field label="Nome completo">
            <input type="text" placeholder="Seu nome completo" autoComplete="name" value={name} onChange={e => setName(e.target.value)} style={inputCss} onFocus={inputFocus} onBlur={inputBlur} />
          </Field>
        )}
        <Field label="E-mail">
          <input type="email" placeholder="voce@exemplo.com" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} style={inputCss} onFocus={inputFocus} onBlur={inputBlur} />
        </Field>
        <Field label="Senha" right={!isRegister ? <ForgotLink email={email} /> : undefined}>
          <PasswordInput show={showPw} onToggle={() => setShowPw(v => !v)} value={password} onChange={setPassword} autoComplete={isRegister ? "new-password" : "current-password"} />
        </Field>
        {isRegister && (
          <Field label="Confirmar senha">
            <PasswordInput show={showCfm} onToggle={() => setShowCfm(v => !v)} value={confirm} onChange={setConfirm} autoComplete="new-password" placeholder="Repita a senha" />
          </Field>
        )}
        {error && <p style={{ fontSize: 12, color: "#e1124e", margin: 0 }}>{error}</p>}
        <button
          onClick={submit} disabled={loading}
          style={{ height: 40, borderRadius: 10, border: "none", fontSize: 14, fontWeight: 500, color: "#fff", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, background: "linear-gradient(135deg,#ff4d8d 0%,#b14eff 60%,#7a3aff 100%)", boxShadow: "0 4px 14px rgba(177,78,255,.35)", marginTop: 4, transition: "transform .12s, box-shadow .12s", fontFamily: "inherit" }}
          onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 22px rgba(177,78,255,.45)"; } }}
          onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 14px rgba(177,78,255,.35)"; }}
        >
          {loading ? "Aguarde…" : isRegister ? "Criar minha conta" : "Entrar na Vowify"}
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "18px 0" }}>
        <div style={{ flex: 1, height: 1, background: "#ece7f5" }} />
        <span style={{ fontSize: 12, color: "#9994ac" }}>ou</span>
        <div style={{ flex: 1, height: 1, background: "#ece7f5" }} />
      </div>

      <GoogleButton />

      <p style={{ fontSize: 13, color: "#6e6880", textAlign: "center", margin: "16px 0 0" }}>
        {isRegister ? "Já tem conta? " : "Ainda não tem conta? "}
        <button onClick={onSwitch} style={{ color: "#b14eff", fontWeight: 500, background: "none", border: "none", cursor: "pointer", fontSize: 13, fontFamily: "inherit", padding: 0 }}>
          {isRegister ? "Entrar →" : "Criar conta grátis →"}
        </button>
      </p>
    </div>
  );
}

// ── Mobile inline form ─────────────────────────────────────────────────────
function MobileAuthForm({ mode, onSwitch }: { mode: "login" | "register"; onSwitch: () => void }) {
  const isRegister = mode === "register";
  const [showPw,  setShowPw]  = useState(false);
  const [showCfm, setShowCfm] = useState(false);
  const { name, setName, email, setEmail, password, setPassword, confirm, setConfirm, loading, error, done, submit } = useAuthForm(mode);

  if (done) return (
    <div style={{ background: "#e6f7ee", borderRadius: 12, border: "1px solid rgba(22,163,74,.2)", padding: 16, fontSize: 13, color: "#0f6b32" }}>
      🎉 Verifique seu e-mail <strong>{email}</strong> para confirmar o cadastro.
    </div>
  );

  return (
    <div style={{ background: "#faf7ff", borderRadius: 12, border: "1px solid #ece7f5", padding: 16, display: "flex", flexDirection: "column", gap: 10, animation: "vwDropdown 0.2s cubic-bezier(0.22,1,0.36,1)" }}>
      {isRegister && (
        <Field label="Nome completo">
          <input type="text" placeholder="Seu nome completo" autoComplete="name" value={name} onChange={e => setName(e.target.value)} style={inputCss} onFocus={inputFocus} onBlur={inputBlur} />
        </Field>
      )}
      <Field label="E-mail">
        <input type="email" placeholder="voce@exemplo.com" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} style={inputCss} onFocus={inputFocus} onBlur={inputBlur} />
      </Field>
      <Field label="Senha" right={!isRegister ? <ForgotLink email={email} /> : undefined}>
        <PasswordInput show={showPw} onToggle={() => setShowPw(v => !v)} value={password} onChange={setPassword} autoComplete={isRegister ? "new-password" : "current-password"} />
      </Field>
      {isRegister && (
        <Field label="Confirmar senha">
          <PasswordInput show={showCfm} onToggle={() => setShowCfm(v => !v)} value={confirm} onChange={setConfirm} autoComplete="new-password" placeholder="Repita a senha" />
        </Field>
      )}
      {error && <p style={{ fontSize: 12, color: "#e1124e", margin: 0 }}>{error}</p>}
      <button
        onClick={submit} disabled={loading}
        style={{ height: 40, borderRadius: 10, border: "none", fontSize: 14, fontWeight: 500, color: "#fff", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, background: "linear-gradient(135deg,#ff4d8d 0%,#b14eff 60%,#7a3aff 100%)", boxShadow: "0 4px 14px rgba(177,78,255,.35)", fontFamily: "inherit" }}
      >
        {loading ? "Aguarde…" : isRegister ? "Criar minha conta" : "Entrar na Vowify"}
      </button>

      <GoogleButton />

      <p style={{ fontSize: 12, color: "#6e6880", textAlign: "center", margin: 0 }}>
        {isRegister ? "Já tem conta? " : "Sem conta? "}
        <button onClick={onSwitch} style={{ color: "#b14eff", fontWeight: 500, background: "none", border: "none", cursor: "pointer", fontSize: 12, fontFamily: "inherit", padding: 0 }}>
          {isRegister ? "Entrar →" : "Criar grátis →"}
        </button>
      </p>
    </div>
  );
}

// ── Google button ──────────────────────────────────────────────────────────
function GoogleButton() {
  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/meuevento` },
    });
  };
  return (
    <button
      onClick={handleGoogle}
      style={{ height: 40, borderRadius: 10, border: "1px solid #ece7f5", fontSize: 14, fontWeight: 500, color: "#0f0b1e", cursor: "pointer", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit", width: "100%", transition: "background .12s" }}
      onMouseEnter={e => (e.currentTarget.style.background = "#faf7ff")}
      onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
    >
      <svg width="18" height="18" viewBox="0 0 18 18">
        <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
        <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/>
        <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
        <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/>
      </svg>
      Continuar com Google
    </button>
  );
}

// ── Helper components ──────────────────────────────────────────────────────
function Field({ label, right, children }: { label: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <label style={{ fontSize: 11, fontWeight: 500, color: "#6e6880", textTransform: "uppercase", letterSpacing: ".04em" }}>{label}</label>
        {right}
      </div>
      {children}
    </div>
  );
}

function ForgotLink({ email }: { email: string }) {
  const handleReset = async () => {
    if (!email) { alert("Informe seu e-mail antes de redefinir a senha."); return; }
    await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/meuevento` });
    alert(`Link de redefinição enviado para ${email}.`);
  };
  return (
    <button type="button" onClick={handleReset} style={{ fontSize: 11, color: "#b14eff", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit" }}>
      Esqueci minha senha
    </button>
  );
}

function PasswordInput({ show, onToggle, value, onChange, autoComplete, placeholder = "••••••••" }: {
  show: boolean; onToggle: () => void;
  value: string; onChange: (v: string) => void;
  autoComplete?: string; placeholder?: string;
}) {
  return (
    <div style={{ position: "relative" }}>
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ ...inputCss, padding: "0 40px 0 12px" }}
        onFocus={inputFocus}
        onBlur={inputBlur}
      />
      <button type="button" onClick={onToggle} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9994ac", padding: 2, display: "flex", alignItems: "center" }}>
        {show ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );
}

function EyeIcon() {
  return <svg viewBox="0 0 16 16" width="15" height="15" fill="none"><path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.4" /><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4" /></svg>;
}
function EyeOffIcon() {
  return <svg viewBox="0 0 16 16" width="15" height="15" fill="none"><path d="M2 2l12 12M6.5 6.6A2 2 0 0010 10M4.5 4.6C2.9 5.7 1.5 7.5 1.5 8s2 4.5 6.5 4.5c1.2 0 2.2-.3 3.1-.7M7 3.6C7.3 3.5 7.7 3.5 8 3.5c4.5 0 6.5 4 6.5 4.5 0 .3-.4 1-1.1 1.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>;
}
