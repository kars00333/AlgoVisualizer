import { Icons, THEMES } from "../App";

export default function Controls({
  isDark,
  algo,
  running,
  done,
  size,
  speed,
  onRun,
  onPause,
  onShuffle,
  onSizeChange,
  onSpeedChange,
}) {
  const T = THEMES[isDark ? "dark" : "light"];
  const accent = isDark
    ? (algo === "bubble" ? "#60a5fa" : algo === "merge" ? "#34d399" : "#fbbf24")
    : (algo === "bubble" ? "#3b82f6" : algo === "merge" ? "#10b981" : "#f59e0b");

  const fillSlider = (val, min, max) =>
    `linear-gradient(to right, ${accent} ${((val - min) / (max - min)) * 100}%, ${T.border} 0%)`;

  return (
    <div
      className="controls"
      style={{ borderBottom: `1px solid ${T.border}` }}
    >
      {/* Run / Pause */}
      <button
        className="btn btn--primary"
        onClick={running ? onPause : onRun}
        style={{
          background: running ? T.surfaceAlt : accent,
          color: "#fff",
          boxShadow: running ? "none" : `0 3px 10px ${accent}45`,
        }}
      >
        {running ? Icons.pause("#fff") : Icons.play("#fff")}
        {running ? "Pause" : done ? "Run Again" : "Run"}
      </button>

      {/* Shuffle */}
      <button
        className="btn btn--secondary"
        onClick={onShuffle}
        disabled={running}
        style={{
          border: `1px solid ${T.border}`,
          color: T.textMuted,
        }}
      >
        Shuffle
      </button>

      <div
        className="controls__divider"
        style={{ background: T.border }}
      />

      {/* Array size */}
      <label className="slider-label">
        <span className="slider-label__text" style={{ color: T.textMuted }}>
          Size
        </span>
        <input
          type="range"
          min={8}
          max={72}
          value={size}
          onChange={(e) => onSizeChange(+e.target.value)}
          disabled={running}
          style={{ width: 90, background: fillSlider(size, 8, 72) }}
        />
        <span className="slider-label__value" style={{ color: T.text }}>
          {size}
        </span>
      </label>

      {/* Speed */}
      <label className="slider-label">
        <span className="slider-label__text" style={{ color: T.textMuted }}>
          Speed
        </span>
        <input
          type="range"
          min={1}
          max={100}
          value={speed}
          onChange={(e) => onSpeedChange(+e.target.value)}
          style={{ width: 90, background: fillSlider(speed, 1, 100) }}
        />
        <span className="slider-label__value" style={{ color: T.text }}>
          {speed}%
        </span>
      </label>

      {/* Status */}
      <div className="status">
        {done && (
          <span className="status__sorted">
            {Icons.check("#10b981")} Sorted!
          </span>
        )}
        {running && (
          <span className="status__sorting" style={{ color: T.textMuted }}>
            <span className="spinner">{Icons.shuffle(T.textMuted)}</span>
            Sorting…
          </span>
        )}
      </div>
    </div>
  );
}
