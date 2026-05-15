"use client";

export function Footer() {
  return (
    <footer className="px-6 sm:px-8 lg:px-14 pt-8 pb-10 max-w-[1280px] mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#ece7f5]">
      {/* Logo */}
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <span style={{ width: 22, height: 22, borderRadius: 6, background: "linear-gradient(135deg,#ff4d8d 0%,#b14eff 60%,#7a3aff 100%)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 11 }}>V</span>
        <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.02em", color: "#0f0b1e" }}>Vowify</span>
      </span>

      <div style={{ fontSize: 13, color: "#6e6880" }}>
        © 2026 Vowify · Feito com 💜 no Brasil
      </div>

      <div className="flex gap-5" style={{ fontSize: 13, color: "#6e6880" }}>
        {[
          { label: "Termos",      href: "/termos" },
          { label: "Privacidade", href: "/privacidade" },
          { label: "Contato",     href: "mailto:contato@vowify.app" },
        ].map(({ label, href }) => (
          <a
            key={label}
            href={href}
            style={{ color: "#6e6880", textDecoration: "none", cursor: "pointer" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#0f0b1e")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#6e6880")}
          >
            {label}
          </a>
        ))}
      </div>
    </footer>
  );
}
