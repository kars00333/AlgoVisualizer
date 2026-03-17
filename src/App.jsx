import { useState, useRef, useCallback } from "react";
import Navbar     from "./components/Navbar";
import Controls   from "./components/Controls";
import Visualizer from "./components/Visualizer";
import { bubbleSort } from "./algorithms/bubbleSort";
import { mergeSort  } from "./algorithms/mergeSort";
import { quickSort  } from "./algorithms/quickSort";
import "./styles/visualizer.css";

/* ─── Shared constants (exported so components can import them) ───────────── */

export const ALGORITHMS = {
  bubble: {
    name: "Bubble Sort",
    complexity: "O(n²)",
    space: "O(1)",
    desc: "Repeatedly compares adjacent elements and swaps them if out of order.",
    accent: "#3b82f6",
    accentDark: "#60a5fa",
  },
  merge: {
    name: "Merge Sort",
    complexity: "O(n log n)",
    space: "O(n)",
    desc: "Divides the array in half, sorts each half, then merges them together.",
    accent: "#10b981",
    accentDark: "#34d399",
  },
  quick: {
    name: "Quick Sort",
    complexity: "O(n log n)",
    space: "O(log n)",
    desc: "Picks a pivot, partitions around it, then recursively sorts each side.",
    accent: "#f59e0b",
    accentDark: "#fbbf24",
  },
};

export const THEMES = {
  light: {
    bg:         "#f4f5f8",
    surface:    "#ffffff",
    surfaceAlt: "#eef0f5",
    border:     "#e2e5ed",
    text:       "#0f1117",
    textMuted:  "#64748b",
    textFaint:  "#b0b8cc",
    barIdle:    "#dde2ee",
    shadow:     "0 2px 12px rgba(0,0,0,0.07)",
    navBg:      "rgba(255,255,255,0.9)",
  },
  dark: {
    bg:         "#0e1018",
    surface:    "#151820",
    surfaceAlt: "#1d2030",
    border:     "#272c3e",
    text:       "#e2e8f6",
    textMuted:  "#64748b",
    textFaint:  "#303650",
    barIdle:    "#1d2130",
    shadow:     "0 2px 12px rgba(0,0,0,0.5)",
    navBg:      "rgba(21,24,32,0.92)",
  },
};

export const Icons = {
  bubble: (color) => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="5"  cy="13" r="2.5" stroke={color} strokeWidth="1.5" />
      <circle cx="13" cy="13" r="2.5" stroke={color} strokeWidth="1.5" />
      <circle cx="9"  cy="6"  r="2.5" stroke={color} strokeWidth="1.5" />
    </svg>
  ),
  merge: (color) => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M3 3 L9 9 L15 3" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 9 L9 15"       stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  quick: (color) => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <line x1="9" y1="2"  x2="9"  y2="16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M3 6  L9 2  L15 6"  stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 12 L9 16 L15 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  sun: (color) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="3" stroke={color} strokeWidth="1.5" />
      <line x1="8" y1="1"  x2="8"  y2="3"  stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="13" x2="8"  y2="15" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="1" y1="8"  x2="3"  y2="8"  stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="13" y1="8" x2="15" y2="8"  stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="2.9"  y1="2.9"  x2="4.3"  y2="4.3"  stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="11.7" y1="11.7" x2="13.1" y2="13.1" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="13.1" y1="2.9"  x2="11.7" y2="4.3"  stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="4.3"  y1="11.7" x2="2.9"  y2="13.1" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  moon: (color) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M13.5 10.5A6 6 0 015.5 2.5a6 6 0 000 11 6 6 0 008-3z"
        stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  check: (color) => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M2 7L5.5 10.5L11 4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  shuffle: (color) => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M1 3h3l6 8h3"   stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M1 11h3L7 7"    stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M10 1l3 2-3 2"  stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 9l3 2-3 2"  stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  play: (color) => (
    <svg width="11" height="12" viewBox="0 0 11 12" fill="none">
      <path d="M2 1.5 L9.5 6 L2 10.5 Z" fill={color} />
    </svg>
  ),
  pause: (color) => (
    <svg width="11" height="12" viewBox="0 0 11 12" fill="none">
      <rect x="1.5" y="1.5" width="3" height="9" rx="1" fill={color} />
      <rect x="6.5" y="1.5" width="3" height="9" rx="1" fill={color} />
    </svg>
  ),
};

/* ─── Sort function map ───────────────────────────────────────────────────── */
const SORT_FNS = { bubble: bubbleSort, merge: mergeSort, quick: quickSort };

/* ─── Array factory ───────────────────────────────────────────────────────── */
function generateArray(size) {
  return Array.from({ length: size }, (_, i) => ({
    value: Math.floor(Math.random() * 84) + 8,
    id:    `bar-${i}-${Math.random()}`,
    state: "idle",
  }));
}

/* ─── App ─────────────────────────────────────────────────────────────────── */
export default function App() {
  const [isDark,  setIsDark]  = useState(false);
  const [algo,    setAlgo]    = useState("bubble");
  const [size,    setSize]    = useState(42);
  const [speed,   setSpeed]   = useState(55);
  const [array,   setArray]   = useState(() => generateArray(42));
  const [running, setRunning] = useState(false);
  const [done,    setDone]    = useState(false);
  const [stats,   setStats]   = useState({ swaps: 0, comps: 0, time: 0 });

  const genRef  = useRef(null);
  const animRef = useRef(null);
  const t0Ref   = useRef(null);

  const T = THEMES[isDark ? "dark" : "light"];

  /* ── Reset / shuffle ── */
  const reset = useCallback(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    genRef.current = null;
    setArray(generateArray(size));
    setRunning(false);
    setDone(false);
    setStats({ swaps: 0, comps: 0, time: 0 });
  }, [size]);

  /* ── Switch algorithm ── */
  const handleAlgoChange = (key) => {
    if (running) return;
    setAlgo(key);
    setArray(generateArray(size));
    setDone(false);
    setStats({ swaps: 0, comps: 0, time: 0 });
  };

  /* ── Handle size change ── */
  const handleSizeChange = (val) => {
    if (running) return;
    setSize(val);
    setArray(generateArray(val));
    setDone(false);
    setStats({ swaps: 0, comps: 0, time: 0 });
  };

  /* ── Run sort ── */
  const run = useCallback(() => {
    if (running) return;
    setRunning(true);
    setDone(false);
    t0Ref.current = performance.now();

    const fresh = array.map((x) => ({ ...x, state: "idle" }));
    const gen   = SORT_FNS[algo](fresh);
    genRef.current = gen;

    const delay = () => Math.max(1, 155 - speed * 1.5);

    const finish = (t, sw, cp) => {
      setRunning(false);
      setDone(true);
      genRef.current = null;
      if (sw !== undefined) setStats({ swaps: sw, comps: cp, time: t });
    };

    const tick = async () => {
      if (!genRef.current) return;
      const { value, done: genDone } = await gen.next();
      const elapsed = +((performance.now() - t0Ref.current) / 1000).toFixed(2);
      if (genDone || !value) { finish(elapsed); return; }

      const { arr, swaps, comps, done: sorted } = value;
      setArray(arr);
      setStats({ swaps, comps, time: elapsed });

      if (sorted) { finish(elapsed, swaps, comps); return; }
      await new Promise((r) => setTimeout(r, delay()));
      animRef.current = requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [running, array, algo, speed]);

  /* ── Pause ── */
  const pause = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    genRef.current = null;
    setRunning(false);
  };

  return (
    <div
      className="theme-root"
      style={{ background: T.bg, color: T.text }}
    >
      {/* Navigation */}
      <Navbar
        algo={algo}
        isDark={isDark}
        running={running}
        onAlgoChange={handleAlgoChange}
        onThemeToggle={() => setIsDark((d) => !d)}
      />

      <main style={{ maxWidth: 1060, margin: "0 auto", padding: "24px 20px 48px" }}>

        {/* Visualizer (info card + stats + bars) */}
        <div
          className="card page-enter-1"
          style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 14,
            overflow: "hidden",
            boxShadow: T.shadow,
            marginBottom: 14,
          }}
        >
          <Controls
            isDark={isDark}
            algo={algo}
            running={running}
            done={done}
            size={size}
            speed={speed}
            onRun={run}
            onPause={pause}
            onShuffle={reset}
            onSizeChange={handleSizeChange}
            onSpeedChange={setSpeed}
          />
          <Visualizer
            algo={algo}
            isDark={isDark}
            array={array}
            stats={stats}
          />
        </div>

        {/* Algorithm reference cards */}
        <div
          className="page-enter-2"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 10,
          }}
        >
          {Object.entries(ALGORITHMS).map(([key, alg]) => {
            const ac = isDark ? alg.accentDark : alg.accent;
            const active = algo === key;
            return (
              <div
                key={key}
                className="card card--clickable"
                onClick={() => handleAlgoChange(key)}
                style={{
                  background: active ? `${ac}0b` : T.surface,
                  border: `1px solid ${active ? ac + "40" : T.border}`,
                  borderRadius: 11,
                  padding: "13px 16px",
                  pointerEvents: running ? "none" : "auto",
                  cursor: running ? "default" : "pointer",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 6,
                  }}
                >
                  <span
                    style={{
                      fontWeight: 600,
                      fontSize: 13,
                      color: active ? ac : T.text,
                    }}
                  >
                    {alg.name}
                  </span>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 11,
                      padding: "1px 7px",
                      borderRadius: 4,
                      background: `${ac}14`,
                      color: ac,
                    }}
                  >
                    {alg.complexity}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 12,
                    color: T.textMuted,
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {alg.desc}
                </p>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
