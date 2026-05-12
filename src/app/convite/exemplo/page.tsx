"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

type Going = "yes" | "no" | null;

interface FormState {
  name: string;
  phone: string;
  restriction: string;
}

interface FormErrors {
  going?: string;
  name?: string;
  phone?: string;
}

// ── Validation helpers ────────────────────────────────────────────────────
function validateName(v: string): string | undefined {
  const t = v.trim();
  if (!t) return "Informe seu nome completo.";
  if (t.split(/\s+/).filter(Boolean).length < 2) return "Informe nome e sobrenome.";
  if (t.length < 4) return "Nome muito curto.";
}

function validatePhone(v: string): string | undefined {
  const digits = v.replace(/\D/g, "");
  if (!digits) return "Informe seu número de WhatsApp.";
  if (digits.length < 10) return "Número incompleto. Inclua o DDD.";
  if (digits.length > 11) return "Número inválido.";
  if (digits.length === 11 && digits[2] !== "9") return "Celular deve começar com 9 após o DDD.";
}

// Mask: (99) 99999-9999 or (99) 9999-9999
function maskPhone(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

// ── Main page ─────────────────────────────────────────────────────────────
export default function ExemploConvitePage() {
  const [going, setGoing] = useState<Going>(null);
  const [plusOne, setPlusOne] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormState>({ name: "", phone: "", restriction: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const setField = useCallback((field: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    // Clear error as user types
    setErrors((e) => ({ ...e, [field]: undefined }));
  }, []);

  const handlePhoneChange = useCallback((raw: string) => {
    setField("phone", maskPhone(raw));
  }, [setField]);

  const handleBlur = useCallback((field: keyof FormErrors) => {
    setTouched((t) => ({ ...t, [field]: true }));
    if (field === "name") setErrors((e) => ({ ...e, name: validateName(form.name) }));
    if (field === "phone") setErrors((e) => ({ ...e, phone: validatePhone(form.phone) }));
  }, [form]);

  const handleSubmit = useCallback(() => {
    const newErrors: FormErrors = {
      going: !going ? "Selecione se você vai ou não." : undefined,
      name: validateName(form.name),
      phone: validatePhone(form.phone),
    };
    setErrors(newErrors);
    setTouched({ going: true, name: true, phone: true });
    if (Object.values(newErrors).some(Boolean)) return;
    setSubmitted(true);
  }, [going, form]);

  if (submitted) return <SuccessState going={going} plusOne={plusOne} onReset={() => { setSubmitted(false); setGoing(null); }} />;

  return (
    <div style={{ background: "#fbf8ff", minHeight: "100dvh", fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}>
      <div style={{ maxWidth: 480, margin: "0 auto", paddingBottom: 40 }}>

        {/* ── Invite card ── */}
        <div style={{ padding: "14px 14px 0" }}>
          <div style={{ aspectRatio: "3/4", borderRadius: 18, overflow: "hidden", position: "relative", background: "linear-gradient(135deg, #ff4d8d 0%, #b14eff 60%, #7a3aff 100%)", boxShadow: "0 20px 40px rgba(177,78,255,.30)" }}>
            <div style={{ position: "absolute", width: 180, height: 180, borderRadius: 999, background: "#ffe5ee", filter: "blur(40px)", opacity: .4, top: -40, right: -40, pointerEvents: "none" }} />
            <div style={{ position: "absolute", width: 200, height: 200, borderRadius: 999, background: "#a78bfa", filter: "blur(50px)", opacity: .4, bottom: -60, left: -40, pointerEvents: "none" }} />
            <div style={{ position: "absolute", inset: 0, padding: 28, color: "#fff", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: ".2em", textTransform: "uppercase", padding: "5px 10px", borderRadius: 999, background: "rgba(255,255,255,.18)", backdropFilter: "blur(6px)" }}>RSVP</span>
                <span style={{ fontSize: 11, opacity: .85 }}>vowify.app/i/marina-30</span>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".2em", textTransform: "uppercase", opacity: .8, marginBottom: 8 }}>Você foi convidado para os</div>
                <div style={{ fontSize: 54, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: .95 }}>30 anos<br />da Marina</div>
                <div style={{ marginTop: 14, fontSize: 13, opacity: .9, lineHeight: 1.45 }}>22 de junho · 21h<br />Casa Solar · Vila Madá</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Event details ── */}
        <div style={{ padding: "20px 24px 8px" }}>
          <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "#b14eff", marginBottom: 8 }}>Você foi convidado</div>
          <h1 style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em", margin: "0 0 16px", lineHeight: 1.1, color: "#0f0b1e" }}>30 anos da Marina</h1>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
            <DetailItem icon={<CalendarIcon />} title="Segunda, 22 de junho" subtitle="A partir das 21h" />
            <DetailItem icon={<PinIcon />} title="Casa de festas Solar" subtitle="Rua das Acácias, 220 — Vila Madá" />
            <DetailItem icon={<UsersIcon />} title="80 convidados" subtitle="Traje esporte fino" />
          </div>
          <div style={{ padding: 14, background: "#fff", borderRadius: 12, border: "1px solid #ece7f5", marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <AvatarComp name="Marina Castro" />
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#0f0b1e" }}>Marina te chamou</div>
                <div style={{ fontSize: 11, color: "#6e6880" }}>recado da anfitriã</div>
              </div>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.5, color: "#2a2440", margin: 0 }}>
              &ldquo;Bora celebrar três décadas com a galera que importa. Quem é da casa, não pode faltar!&rdquo;
            </p>
          </div>
        </div>

        {/* ── RSVP form ── */}
        <div style={{ padding: "0 24px 32px" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 20, border: "1px solid #ece7f5" }}>
            <h2 style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em", margin: "0 0 4px", color: "#0f0b1e" }}>Confirme sua presença</h2>
            <p style={{ fontSize: 13, color: "#6e6880", margin: "0 0 18px" }}>Leva 10 segundos. Marina já vai saber 🥰</p>

            {/* Going buttons */}
            <div style={{ marginBottom: 4 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 6 }}>
                <RsvpButton label="Vou!" emoji="🎉" active={going === "yes"} variant="yes" onClick={() => { setGoing("yes"); setErrors((e) => ({ ...e, going: undefined })); }} />
                <RsvpButton label="Não vou" emoji="😔" active={going === "no"} variant="no" onClick={() => { setGoing("no"); setErrors((e) => ({ ...e, going: undefined })); }} />
              </div>
              {errors.going && <ErrorMsg>{errors.going}</ErrorMsg>}
            </div>

            {/* Fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
              <Field label="Nome completo *" error={errors.name} touched={touched.name}>
                <input
                  style={inputStyle(!!errors.name && touched.name)}
                  placeholder="Seu nome completo"
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  onBlur={() => handleBlur("name")}
                  autoComplete="name"
                />
              </Field>

              <Field label="Número de WhatsApp *" error={errors.phone} touched={touched.phone}>
                <input
                  style={inputStyle(!!errors.phone && touched.phone)}
                  placeholder="(11) 99999-9999"
                  value={form.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  onBlur={() => handleBlur("phone")}
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={15}
                />
              </Field>

              {going === "yes" && (
                <>
                  <button
                    onClick={() => setPlusOne(!plusOne)}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: 14, background: "#faf7ff", borderRadius: 10, cursor: "pointer", border: "1px solid #ece7f5", textAlign: "left", fontFamily: "inherit", width: "100%" }}
                  >
                    <span style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, background: plusOne ? "linear-gradient(135deg,#ff4d8d 0%,#b14eff 60%,#7a3aff 100%)" : "#fff", border: plusOne ? "none" : "1.5px solid #ece7f5", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                      {plusOne && <CheckSmallIcon />}
                    </span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: "#0f0b1e" }}>Vou levar +1 acompanhante</div>
                      <div style={{ fontSize: 11, color: "#6e6880" }}>Marina permitiu acompanhantes</div>
                    </div>
                  </button>

                  <Field label="Restrição alimentar (opcional)">
                    <input
                      style={inputStyle(false)}
                      placeholder="Vegetariana, sem glúten…"
                      value={form.restriction}
                      onChange={(e) => setField("restriction", e.target.value)}
                      autoComplete="off"
                    />
                  </Field>
                </>
              )}
            </div>

            <button
              onClick={handleSubmit}
              style={{ width: "100%", height: 48, borderRadius: 12, border: "none", fontSize: 15, fontWeight: 500, color: "#fff", cursor: "pointer", background: "linear-gradient(135deg,#ff4d8d 0%,#b14eff 60%,#7a3aff 100%)", boxShadow: "0 4px 14px rgba(177,78,255,.35)", marginTop: 18, transition: "opacity .15s, transform .15s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 22px rgba(177,78,255,.45)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 14px rgba(177,78,255,.35)"; }}
            >
              <CheckSmallIcon />
              {going === "yes" ? "Confirmar presença" : going === "no" ? "Enviar resposta" : "Confirmar presença"}
            </button>

            <p style={{ marginTop: 12, fontSize: 11, color: "#9994ac", textAlign: "center" }}>Seus dados ficam só com Marina e a Vowify. Sem spam.</p>
          </div>

          {/* Footer */}
          <div style={{ marginTop: 20, display: "flex", justifyContent: "center", alignItems: "center", gap: 6, fontSize: 11, color: "#9994ac" }}>
            enviado por
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 5, textDecoration: "none" }}>
              <span style={{ width: 16, height: 16, borderRadius: 5, background: "linear-gradient(135deg,#ff4d8d 0%,#b14eff 60%,#7a3aff 100%)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 9 }}>V</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#0f0b1e", letterSpacing: "-0.01em" }}>Vowify</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Success state ─────────────────────────────────────────────────────────
function SuccessState({ going, plusOne, onReset }: { going: Going; plusOne: boolean; onReset: () => void }) {
  return (
    <div style={{ background: "#fff", minHeight: "100dvh", fontFamily: "var(--font-geist-sans), system-ui, sans-serif", display: "flex", flexDirection: "column", padding: "60px 24px 40px", position: "relative", overflow: "hidden", maxWidth: 480, margin: "0 auto" }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(circle at 50% 0%, #ffe5ee 0%, transparent 50%), radial-gradient(circle at 80% 100%, #e8dcff 0%, transparent 60%)", opacity: .7 }} />
      <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <div style={{ width: 88, height: 88, borderRadius: "50%", marginBottom: 24, background: "linear-gradient(135deg,#ff4d8d 0%,#b14eff 60%,#7a3aff 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 30px rgba(177,78,255,.40)" }}>
          <svg viewBox="0 0 24 24" width="40" height="40" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <h1 style={{ fontSize: 30, fontWeight: 600, letterSpacing: "-0.02em", margin: "0 0 10px", color: "#0f0b1e" }}>
          {going === "no" ? "Resposta enviada!" : "Presença confirmada!"}
        </h1>
        <p style={{ fontSize: 15, color: "#6e6880", maxWidth: 280, lineHeight: 1.5, margin: "0 0 28px" }}>
          {going === "yes" ? "A Marina já recebeu sua confirmação. Mal podemos esperar 🎉" : "A Marina foi avisada que você não vai poder ir. Que pena! 😔"}
        </p>
        <div style={{ width: "100%", background: "#fff", border: "1px solid #ece7f5", borderRadius: 18, padding: 18, textAlign: "left", marginBottom: 18, boxShadow: "0 1px 2px rgba(15,11,30,.04), 0 6px 24px rgba(15,11,30,.04)" }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "#b14eff", marginBottom: 12 }}>30 anos da Marina</div>
          <div style={{ display: "flex", gap: 0, marginBottom: 14 }}>
            {[{ label: "Data", value: "22 jun · 21h" }, { label: "Local", value: "Casa Solar" }, ...(going === "yes" && plusOne ? [{ label: "Com", value: "+1" }] : [])].map((item, i, arr) => (
              <div key={item.label} style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
                <div style={{ paddingRight: 16 }}>
                  <div style={{ fontSize: 11, color: "#6e6880" }}>{item.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "#0f0b1e" }}>{item.value}</div>
                </div>
                {i < arr.length - 1 && <div style={{ width: 1, background: "#ece7f5", marginRight: 16 }} />}
              </div>
            ))}
          </div>
          <button style={{ width: "100%", height: 36, borderRadius: 10, border: "1px solid #ece7f5", fontSize: 13, fontWeight: 500, color: "#0f0b1e", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: "inherit" }}>
            <CalendarIcon /> Adicionar à agenda
          </button>
        </div>
        {going !== "no" && (
          <button style={{ width: "100%", height: 48, borderRadius: 12, border: "none", fontSize: 15, fontWeight: 500, color: "#fff", cursor: "pointer", background: "linear-gradient(135deg,#ff4d8d 0%,#b14eff 60%,#7a3aff 100%)", boxShadow: "0 4px 14px rgba(177,78,255,.35)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit", marginBottom: 8 }}>
            <ShareIcon /> Compartilhar com quem vai
          </button>
        )}
        <button onClick={onReset} style={{ width: "100%", height: 40, borderRadius: 10, border: "1px solid #ece7f5", fontSize: 14, fontWeight: 500, color: "#6e6880", background: "transparent", cursor: "pointer", fontFamily: "inherit" }}>
          Mudar minha resposta
        </button>
      </div>
      <div style={{ position: "relative", textAlign: "center", fontSize: 11, color: "#9994ac", display: "flex", justifyContent: "center", alignItems: "center", gap: 6 }}>
        enviado por
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 5, textDecoration: "none" }}>
          <span style={{ width: 16, height: 16, borderRadius: 5, background: "linear-gradient(135deg,#ff4d8d 0%,#b14eff 60%,#7a3aff 100%)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 9 }}>V</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#0f0b1e", letterSpacing: "-0.01em" }}>Vowify</span>
        </Link>
      </div>
    </div>
  );
}

// ── UI helpers ────────────────────────────────────────────────────────────
function inputStyle(hasError: boolean): React.CSSProperties {
  return {
    height: 44, padding: "0 14px",
    border: `1px solid ${hasError ? "#e1124e" : "#ece7f5"}`,
    borderRadius: 10,
    background: hasError ? "#fff5f7" : "#fff",
    fontSize: 15, color: "#0f0b1e",
    fontFamily: "inherit", outline: "none", width: "100%",
    boxSizing: "border-box",
    transition: "border .15s, background .15s, box-shadow .15s",
  };
}

function ErrorMsg({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ margin: "4px 0 0", fontSize: 12, color: "#e1124e", display: "flex", alignItems: "center", gap: 4 }}>
      <svg viewBox="0 0 16 16" width="12" height="12" fill="none" style={{ flexShrink: 0 }}>
        <circle cx="8" cy="8" r="6.5" stroke="#e1124e" strokeWidth="1.5" />
        <path d="M8 5v3.5M8 11h.01" stroke="#e1124e" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      {children}
    </p>
  );
}

function Field({ label, error, touched, children }: { label: string; error?: string; touched?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: "#6e6880", letterSpacing: ".02em", textTransform: "uppercase" }}>
        {label}
      </label>
      {children}
      {error && touched && <ErrorMsg>{error}</ErrorMsg>}
    </div>
  );
}

function RsvpButton({ label, emoji, active, variant, onClick }: { label: string; emoji: string; active: boolean; variant: "yes" | "no"; onClick: () => void }) {
  const bg = { yes: "linear-gradient(135deg,#ff4d8d 0%,#b14eff 60%,#7a3aff 100%)", no: "#0f0b1e" }[variant];
  const shadow = { yes: "0 6px 14px rgba(177,78,255,.35)", no: "0 6px 14px rgba(15,11,30,.25)" }[variant];
  return (
    <button onClick={onClick} style={{ padding: "14px 6px", borderRadius: 12, cursor: "pointer", fontFamily: "inherit", background: active ? bg : "#fff", color: active ? "#fff" : "#0f0b1e", border: active ? "none" : "1px solid #ece7f5", boxShadow: active ? shadow : "none", transition: "all .15s", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <span style={{ fontSize: 22 }}>{emoji}</span>
      <span style={{ fontSize: 13, fontWeight: 500 }}>{label}</span>
    </button>
  );
}

function DetailItem({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#fff", borderRadius: 12, border: "1px solid #ece7f5" }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#ffe5ee 0%,#f1e1ff 60%,#e8dcff 100%)", color: "#b14eff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 500, color: "#0f0b1e" }}>{title}</div>
        <div style={{ fontSize: 12, color: "#6e6880" }}>{subtitle}</div>
      </div>
    </div>
  );
}

function AvatarComp({ name }: { name: string }) {
  const colors = ["#ff4d8d", "#b14eff", "#7a3aff", "#2f6bff", "#16a34a"];
  const idx = Math.abs([...name].reduce((a, c) => a + c.charCodeAt(0), 0)) % colors.length;
  return (
    <span style={{ width: 32, height: 32, borderRadius: 999, background: colors[idx], display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: "#fff", flexShrink: 0 }}>
      {name.split(" ").slice(0, 2).map(w => w[0]).join("")}
    </span>
  );
}

function CalendarIcon() { return <svg viewBox="0 0 16 16" width="15" height="15" fill="none"><rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M2 6h12M5 2v2M11 2v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>; }
function PinIcon() { return <svg viewBox="0 0 16 16" width="15" height="15" fill="none"><path d="M8 14s5-4 5-8a5 5 0 10-10 0c0 4 5 8 5 8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><circle cx="8" cy="6" r="1.7" stroke="currentColor" strokeWidth="1.5" /></svg>; }
function UsersIcon() { return <svg viewBox="0 0 16 16" width="15" height="15" fill="none"><circle cx="6" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.5" /><path d="M2 13c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><circle cx="11" cy="5" r="1.9" stroke="currentColor" strokeWidth="1.5" /><path d="M10.5 9c2.2 0 3.8 1.5 3.8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>; }
function CheckSmallIcon() { return <svg viewBox="0 0 16 16" width="14" height="14" fill="none"><path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function ShareIcon() { return <svg viewBox="0 0 16 16" width="14" height="14" fill="none"><circle cx="12" cy="3.5" r="1.8" stroke="currentColor" strokeWidth="1.4" /><circle cx="4" cy="8" r="1.8" stroke="currentColor" strokeWidth="1.4" /><circle cx="12" cy="12.5" r="1.8" stroke="currentColor" strokeWidth="1.4" /><path d="M5.5 7l5-2.5M5.5 9l5 2.5" stroke="currentColor" strokeWidth="1.4" /></svg>; }
