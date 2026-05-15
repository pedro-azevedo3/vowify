import { ImageResponse } from "next/og";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COLORS: Record<string, [string, string, string]> = {
  violet:   ["#ff4d8d", "#b14eff", "#7a3aff"],
  ocean:    ["#0ea5e9", "#6366f1", "#8b5cf6"],
  sunset:   ["#f97316", "#ec4899", "#a855f7"],
  forest:   ["#10b981", "#0891b2", "#6366f1"],
  midnight: ["#1e1b4b", "#4c1d95", "#6d28d9"],
  rose:     ["#f43f5e", "#ec4899", "#a855f7"],
  gold:     ["#f59e0b", "#ef4444", "#ec4899"],
  mint:     ["#34d399", "#06b6d4", "#3b82f6"],
  blue:     ["#60a5fa", "#2563eb", "#1e40af"],
  black:    ["#374151", "#1f2937", "#030712"],
  green:    ["#4ade80", "#16a34a", "#14532d"],
  white:    ["#e2e8f0", "#94a3b8", "#475569"],
};

export default async function OGImage(
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data } = await supabase
    .from("events")
    .select("name,organizer_name,color_id,date,time,location")
    .eq("id", id)
    .single();

  const eventName  = data?.name           ?? "Convite";
  const organizer  = data?.organizer_name ?? "";
  const colorId    = data?.color_id       ?? "violet";
  const [c1, c2, c3] = COLORS[colorId] ?? COLORS.violet;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex",
          background: `linear-gradient(135deg, ${c1} 0%, ${c2} 60%, ${c3} 100%)`,
          position: "relative", overflow: "hidden",
        }}
      >
        {/* Decorative orbs */}
        <div style={{ position: "absolute", width: 500, height: 500, borderRadius: 9999, background: "rgba(255,255,255,0.08)", top: -150, right: -100, display: "flex" }} />
        <div style={{ position: "absolute", width: 400, height: 400, borderRadius: 9999, background: "rgba(255,255,255,0.06)", bottom: -100, left: -80, display: "flex" }} />

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px 96px", width: "100%", position: "relative" }}>
          {/* Top label */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ padding: "10px 24px", borderRadius: 9999, background: "rgba(255,255,255,0.2)", color: "#fff", fontSize: 22, fontWeight: 600, letterSpacing: "0.1em", display: "flex" }}>
              RSVP
            </div>
          </div>

          {/* Main content */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {organizer ? (
              <div style={{ fontSize: 32, color: "rgba(255,255,255,0.8)", display: "flex" }}>
                {organizer} está te convidando
              </div>
            ) : null}
            <div style={{ fontSize: 80, fontWeight: 800, color: "#fff", lineHeight: 1.05, display: "flex", flexWrap: "wrap" }}>
              {eventName}
            </div>
            {(data?.date || data?.location) ? (
              <div style={{ fontSize: 30, color: "rgba(255,255,255,0.85)", display: "flex", gap: 12 }}>
                {data?.date}{data?.time ? ` · ${data.time}` : ""}{data?.location ? ` · ${data.location}` : ""}
              </div>
            ) : null}
          </div>

          {/* Footer */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, color: "#fff" }}>
              V
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: "rgba(255,255,255,0.9)", display: "flex" }}>
              Vowify
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
