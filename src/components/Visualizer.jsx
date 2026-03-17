import { useState, useEffect } from "react";
import { ALGORITHMS, THEMES } from "../App";

/* ── Single animated bar ─────────────────────────────────────────────────── */
function Bar({ bar, width, gap, accentColor, idleColor, isDark }) {
  const colorMap = {
    idle:      idleColor,
    comparing: isDark ? "#818cf8" : "#6366f1",
    swapping:  "#f97316",
    pivot:     "#ef4444",
    sorted:    accentColor,
  };

  return (
    <div
      className={`bar bar--${bar.state}`}
      style={{
        width,
        flexShrink: 0,
        height: `${bar.value}%`,
        background: colorMap[bar.state] ?? idleColor,
        marginRight: gap,
        transformOrigin: "bottom center",
      }}
    />
  );
}

/* ── Stat counter with enter animation ──────────────────────────────────── */
function StatNum({ value, label, color }) {
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey((k) => k + 1);
  }, [value]);

  return (
    <div style={{ textAlign: "center", minWidth: 56 }}>
      <div key={key} className="stat-num" style={{ color }}>
        {value}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

/* ── Main Visualizer ─────────────────────────────────────────────────────── */
export default function Visualizer({ algo, isDark, array, stats }) {
  const T = THEMES[isDark ? "dark" : "light"];
  const accent = isDark
    ? ALGORITHMS[algo].accentDark
    : ALGORITHMS[algo].accent;

  const totalBars = array.length;
  const gap = totalBars > 55 ? 1 : totalBars > 35 ? 2 : 3;

  const legendItems = [
    { color: T.barIdle,                        label: "Idle" },
    { color: isDark ? "#818cf8" : "#6366f1",   label: "Comparing" },
    { color: "#f97316",                        label: "Swapping" },
    { color: "#ef4444",                        label: "Pivot" },
    { color: accent,                           label: "Sorted" },
  ];

  return (
    <>
      {/* ── Info + Stats row ── */}
      <div
        className="page-enter"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 12,
          marginBottom: 14,
        }}
      >
        {/* Algorithm info card */}
        <div
          className="card"
          style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
            padding: "15px 20px",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              flexShrink: 0,
              background: `${accent}18`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.3s",
            }}
          >
            {/* Inline SVG icon per algorithm */}
            {algo === "bubble" && (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="5"  cy="13" r="2.5" stroke={accent} strokeWidth="1.5" />
                <circle cx="13" cy="13" r="2.5" stroke={accent} strokeWidth="1.5" />
                <circle cx="9"  cy="6"  r="2.5" stroke={accent} strokeWidth="1.5" />
              </svg>
            )}
            {algo === "merge" && (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 3 L9 9 L15 3" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 9 L9 15"       stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}
            {algo === "quick" && (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <line x1="9" y1="2"  x2="9"  y2="16" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
                <path d="M3 6  L9 2  L15 6"  stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 12 L9 16 L15 12" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>

          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 5,
                flexWrap: "wrap",
              }}
            >
              <span style={{ fontWeight: 600, fontSize: 15 }}>
                {ALGORITHMS[algo].name}
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  padding: "2px 8px",
                  borderRadius: 5,
                  background: `${accent}18`,
                  color: accent,
                  fontWeight: 500,
                }}
              >
                {ALGORITHMS[algo].complexity}
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  padding: "2px 8px",
                  borderRadius: 5,
                  background: T.surfaceAlt,
                  color: T.textMuted,
                  fontWeight: 500,
                }}
              >
                Space {ALGORITHMS[algo].space}
              </span>
            </div>
            <p
              style={{
                fontSize: 13,
                color: T.textMuted,
                lineHeight: 1.65,
                maxWidth: 480,
              }}
            >
              {ALGORITHMS[algo].desc}
            </p>
          </div>
        </div>

        {/* Stats card */}
        <div
          className="card"
          style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
            padding: "14px 24px",
            display: "flex",
            gap: 20,
            alignItems: "center",
          }}
        >
          <StatNum key={`sw-${algo}`} value={stats.swaps} label="Swaps"        color={accent} />
          <div style={{ width: 1, height: 30, background: T.border }} />
          <StatNum key={`cp-${algo}`} value={stats.comps} label="Comparisons"  color={accent} />
          <div style={{ width: 1, height: 30, background: T.border }} />
          <StatNum key={`tm-${algo}`} value={`${stats.time}s`} label="Time"    color={accent} />
        </div>
      </div>

      {/* ── Bar chart ── */}
      <div className="visualizer">
        <div className="visualizer__bars">
          {array.map((bar) => (
            <Bar
              key={bar.id}
              bar={bar}
              width={`calc((100% - ${(totalBars - 1) * gap}px) / ${totalBars})`}
              gap={gap}
              accentColor={accent}
              idleColor={T.barIdle}
              isDark={isDark}
            />
          ))}
        </div>

        {/* Legend */}
        <div
          className="legend"
          style={{ borderTop: `1px solid ${T.border}` }}
        >
          {legendItems.map(({ color, label }) => (
            <div key={label} className="legend__item">
              <div
                className="legend__swatch"
                style={{ background: color }}
              />
              <span className="legend__label" style={{ color: T.textMuted }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
