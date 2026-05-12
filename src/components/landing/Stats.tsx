"use client";

import { useInView } from "@/hooks/use-in-view";

const stats = [
  ["12.4k", "eventos criados"],
  ["98%", "taxa de entrega WhatsApp"],
  ["4,9★", "avaliação média"],
  ["R$ 19,90", "plano único · sem letras miúdas"],
];

export function Stats() {
  const [ref, inView] = useInView();

  return (
    <section className="px-6 sm:px-8 lg:px-14 pb-20 max-w-[1280px] mx-auto w-full">
      <div
        ref={ref}
        className={`vw-card vw-card-interactive ${inView ? "vw-anim-scale" : "vw-hidden"}`}
        style={{ padding: "28px 24px" }}
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-0 gap-y-0">
          {stats.map(([n, l], i) => (
            <div
              key={i}
              className={`${inView ? `vw-anim-up d-${i * 80 + 80}` : "vw-hidden"} flex flex-col items-center text-center`}
              style={{
                padding: "16px 20px",
                borderRight: i % 2 === 0 ? "1px solid #ece7f5" : "none",
                borderBottom: i < 2 ? "1px solid #ece7f5" : "none",
              }}
            >
              <div style={{ fontSize: 26, lineHeight: 1.1, letterSpacing: "-0.025em", fontWeight: 600, marginBottom: 4, color: "#0f0b1e" }}>{n}</div>
              <div style={{ fontSize: 12, color: "#6e6880" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
