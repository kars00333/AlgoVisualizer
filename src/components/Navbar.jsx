import { ALGORITHMS, Icons, THEMES } from "../App";

export default function Navbar({ algo, isDark, running, onAlgoChange, onThemeToggle }) {
  const T = THEMES[isDark ? "dark" : "light"];

  return (
    <nav
      className="navbar"
      style={{
        background: T.navBg,
        borderBottom: `1px solid ${T.border}`,
      }}
    >
      {/* Logo */}
      <div className="navbar__logo">
        <div
          className="navbar__logo-mark"
          style={{
            background: ALGORITHMS[algo].accent,
            boxShadow: `0 2px 8px ${ALGORITHMS[algo].accent}55`,
          }}
        >
          Kduong
        </div>
        <span className="navbar__wordmark" style={{ color: T.text }}>
          Algorithm Visualizer 
        </span>
      </div>

      {/* Algorithm tabs */}
      <div
        className="navbar__tabs"
        style={{ background: T.surfaceAlt }}
      >
        {Object.entries(ALGORITHMS).map(([key, alg]) => {
          const ac = isDark ? alg.accentDark : alg.accent;
          const active = algo === key;
          return (
            <button
              key={key}
              className="algo-tab"
              onClick={() => onAlgoChange(key)}
              disabled={running}
              style={{
                background: active ? T.surface : "transparent",
                color: active ? ac : T.textMuted,
                fontWeight: active ? 600 : 400,
                boxShadow: active ? T.shadow : "none",
              }}
            >
              {alg.name}
            </button>
          );
        })}
      </div>

      <div className="navbar__spacer" />

      {/* Theme toggle */}
      <button
        className="navbar__theme-btn btn"
        onClick={onThemeToggle}
        style={{
          border: `1px solid ${T.border}`,
          background: T.surfaceAlt,
        }}
        aria-label="Toggle theme"
      >
        {isDark ? Icons.sun(T.textMuted) : Icons.moon(T.textMuted)}
      </button>
    </nav>
  );
}
