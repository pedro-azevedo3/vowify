"use client";

import { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

function SucessoContent() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => router.replace("/meuevento"), 4000);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div style={{ minHeight: "100dvh", background: "#faf7ff", display: "flex", flexDirection: "column", fontFamily: "var(--font-bricolage), system-ui, sans-serif" }}>
      <header style={{ padding: "16px 24px", borderBottom: "1px solid #ece7f5", background: "#fff" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <Image src="/logo.png" alt="Vowify" width={28} height={28} style={{ borderRadius: 8 }} />
          <span style={{ fontSize: 17, fontWeight: 700, color: "#0f0b1e", letterSpacing: "-0.02em" }}>Vowify</span>
        </Link>
      </header>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #ece7f5", padding: 48, maxWidth: 420, width: "100%", boxShadow: "0 4px 24px rgba(15,11,30,.06)", textAlign: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: 22, background: "linear-gradient(135deg,#e6f7ee,#dcfce7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 24px" }}>🎉</div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#0f0b1e", margin: "0 0 12px", letterSpacing: "-0.025em" }}>Pagamento confirmado!</h1>
          <p style={{ fontSize: 15, color: "#6e6880", margin: "0 0 8px", lineHeight: 1.6 }}>
            Seu evento foi ativado por 90 dias. Redirecionando para o painel…
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 6, margin: "24px 0 28px" }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{ width: 8, height: 8, borderRadius: 999, background: "#b14eff", opacity: 0.3 + i * 0.2, animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
            ))}
          </div>
          <style>{`@keyframes pulse{0%,100%{transform:scale(1);opacity:.3}50%{transform:scale(1.3);opacity:.9}}`}</style>
          <Link href="/meuevento" style={{ fontSize: 14, color: "#b14eff", textDecoration: "none", fontWeight: 500 }}>
            Ir para o painel agora →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SucessoPage() {
  return (
    <Suspense>
      <SucessoContent />
    </Suspense>
  );
}
