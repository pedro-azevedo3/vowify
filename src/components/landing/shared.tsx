// Shared Vowify primitives used across landing sections

// ─── Avatar ───────────────────────────────────────────────────────────────
const PALETTE = [
  "#ff4d8d", "#b14eff", "#7a3aff", "#2f6bff",
  "#16a34a", "#f59e0b", "#e1124e", "#06b6d4",
];

export function Avatar({
  name = "",
  size = 32,
  color,
}: {
  name?: string;
  size?: number;
  color?: string;
}) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "?";
  const idx = Math.abs([...name].reduce((a, c) => a + c.charCodeAt(0), 0)) % PALETTE.length;
  const bg = color ?? PALETTE[idx];
  return (
    <span
      style={{
        width: size,
        height: size,
        fontSize: size * 0.42,
        background: bg,
        borderRadius: 9999,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 600,
        color: "#fff",
        flexShrink: 0,
        fontFamily: "inherit",
      }}
    >
      {initials}
    </span>
  );
}

// ─── Donut chart ──────────────────────────────────────────────────────────
export function Donut({
  size = 140,
  stroke = 18,
  segments = [] as { value: number; color: string }[],
  animate = false,
  children,
}: {
  size?: number;
  stroke?: number;
  segments?: { value: number; color: string }[];
  animate?: boolean;
  children?: React.ReactNode;
}) {
  const r = (size - stroke) / 2;
  const C = 2 * Math.PI * r;
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;
  let offset = 0;
  return (
    <div style={{ position: "relative", width: size, height: size, display: "inline-block" }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          stroke="var(--lp-border2)"
        />
        {segments.map((s, i) => {
          const len = (s.value / total) * C;
          // strokeDashoffset positions each segment correctly from the start;
          // strokeDasharray starts at "0 C" (invisible) and transitions to
          // the real value when animate=true — CSS handles the draw-in.
          const el = (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              strokeWidth={stroke}
              stroke={s.color}
              strokeDasharray={animate ? `${len} ${C - len}` : `0 ${C}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
              style={{
                transition: animate
                  ? `stroke-dasharray 0.75s cubic-bezier(0.4, 0, 0.2, 1) ${i * 180}ms`
                  : "none",
              }}
            />
          );
          offset += len;
          return el;
        })}
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ─── QR Code placeholder ──────────────────────────────────────────────────
export function VowQR({ size = 180 }: { size?: number }) {
  const N = 21;
  const seed = (x: number, y: number) => {
    const v = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return v - Math.floor(v) > 0.5;
  };
  const cells: boolean[] = [];
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const inFinder = (fx: number, fy: number) =>
        x >= fx && x < fx + 7 && y >= fy && y < fy + 7;
      const isFinderRing = (fx: number, fy: number): boolean | null => {
        if (!inFinder(fx, fy)) return null;
        const rx = x - fx, ry = y - fy;
        if (rx === 0 || rx === 6 || ry === 0 || ry === 6) return true;
        if (rx >= 2 && rx <= 4 && ry >= 2 && ry <= 4) return true;
        return false;
      };
      let on = isFinderRing(0, 0) ?? isFinderRing(14, 0) ?? isFinderRing(0, 14);
      if (on === null) {
        on = x >= 9 && x <= 11 && y >= 9 && y <= 11 ? false : seed(x, y);
      }
      cells.push(!!on);
    }
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        background: "#fff",
        padding: 10,
        borderRadius: 12,
        border: "1px solid #ece7f5",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${N}, 1fr)`,
          gap: 1,
          width: "100%",
          height: "100%",
        }}
      >
        {cells.map((on, i) => (
          <i
            key={i}
            style={{
              background: on ? "#0f0b1e" : "transparent",
              display: "block",
              aspectRatio: "1",
            }}
          />
        ))}
      </div>
      {/* Centre logo */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: size * 0.18,
          height: size * 0.18,
          borderRadius: 6,
          background: "linear-gradient(135deg,#ff4d8d 0%,#b14eff 60%,#7a3aff 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: size * 0.09,
          fontWeight: 700,
          boxShadow: "0 2px 8px rgba(0,0,0,.2)",
        }}
      >
        V
      </div>
    </div>
  );
}
