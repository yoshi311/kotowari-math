export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  color = 'var(--accent)',
}: {
  label: React.ReactNode;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  color?: string;
}) {
  return (
    <label className="slider">
      <span className="slider-label">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ accentColor: color }}
      />
      <span className="slider-value" style={{ color }}>
        {value}
      </span>
    </label>
  );
}
